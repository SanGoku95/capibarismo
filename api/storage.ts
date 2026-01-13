import { put, list } from '@vercel/blob';
import { VoteRecord } from './types.js';

// Configuration
const MAX_VOTES_PER_USER = 1000;
const VOTE_PREFIX = 'sessions';

// Storage interface for dependency injection and testing
interface StorageAdapter {
  saveVote(sessionId: string, vote: VoteRecord): Promise<void>;
  getVotes(sessionId: string): Promise<VoteRecord[]>;
}

// In-memory storage adapter for development
class InMemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, VoteRecord[]>();

  async saveVote(sessionId: string, vote: VoteRecord): Promise<void> {
    const key = this.getKey(sessionId);
    const votes = this.storage.get(key) || [];
    votes.push(vote);
    this.storage.set(key, votes);
    console.log('[DEV] Vote saved to memory:', vote);
  }

  async getVotes(sessionId: string): Promise<VoteRecord[]> {
    const key = this.getKey(sessionId);
    const votes = this.storage.get(key) || [];
    console.log('[DEV] Returning votes from memory:', votes.length);
    return votes;
  }

  private getKey(sessionId: string): string {
    return `${VOTE_PREFIX}/${sessionId}/votes`;
  }

  // Utility method for testing/cleanup
  clear(): void {
    this.storage.clear();
  }
}

// Vercel Blob storage adapter for production
class BlobStorageAdapter implements StorageAdapter {
  private readonly token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('Blob token is required for BlobStorageAdapter');
    }
    this.token = token;
  }

  async saveVote(sessionId: string, vote: VoteRecord): Promise<void> {
    const voteKey = this.generateVoteKey(sessionId);

    await put(voteKey, JSON.stringify(vote), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      token: this.token,
      cacheControlMaxAge: 0
    });
  }

  async getVotes(sessionId: string): Promise<VoteRecord[]> {
    try {
      const prefix = `${VOTE_PREFIX}/${sessionId}/votes/`;

      const { blobs } = await list({
        prefix,
        limit: MAX_VOTES_PER_USER,
        token: this.token,
      });

      if (blobs.length === 0) {
        return [];
      }

      // Fetch all vote files in parallel
      const votes = await Promise.all(
        blobs.map(blob => this.fetchVote(blob.url))
      );

      // Filter out failed fetches and sort by timestamp
      return votes
        .filter((v): v is VoteRecord => v !== null)
        .sort((a, b) => a.timestamp - b.timestamp);

    } catch (error) {
      console.error('Error reading user history:', error);
      return [];
    }
  }

  private async fetchVote(url: string): Promise<VoteRecord | null> {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json() as VoteRecord;
    } catch {
      return null;
    }
  }

  private generateVoteKey(sessionId: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    return `${VOTE_PREFIX}/${sessionId}/votes/${timestamp}-${randomSuffix}.json`;
  }
}

// Factory function to create the appropriate storage adapter
function createStorageAdapter(): StorageAdapter {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('Blob write token is missing');
    }
    return new BlobStorageAdapter(token);
  }

  return new InMemoryStorageAdapter();
}

// Singleton storage instance
let storageInstance: StorageAdapter | null = null;

function getStorage(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = createStorageAdapter();
  }
  return storageInstance;
}

// Public API functions

/**
 * Saves a vote as an individual file to avoid race conditions.
 */
export async function saveVote(
  sessionId: string,
  winnerId: string,
  loserId: string
): Promise<void> {
  const vote: VoteRecord = {
    winnerId,
    loserId,
    timestamp: Date.now()
  };

  const storage = getStorage();
  await storage.saveVote(sessionId, vote);
}

/**
 * Gets a user's raw vote history by reading all vote files.
 */
export async function getUserHistory(sessionId: string): Promise<VoteRecord[]> {
  const storage = getStorage();
  return storage.getVotes(sessionId);
}

// Utility function for testing
export function resetStorage(): void {
  storageInstance = null;
}

// Export for testing purposes
export { InMemoryStorageAdapter, BlobStorageAdapter };
