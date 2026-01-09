import { put, list } from '@vercel/blob';
import { VoteRecord } from './types.js';

// In-memory storage for local development
const devStorage = new Map<string, VoteRecord[]>();

/**
 * Saves a vote as an individual file to avoid race conditions.
 */
export async function saveVote(sessionId: string, winnerId: string, loserId: string) {
  const vote: VoteRecord = { winnerId, loserId, timestamp: Date.now() };

  // Use in-memory storage in development to avoid contaminating production data
  if (process.env.NODE_ENV !== 'production') {
    const key = `sessions/${sessionId}/votes`;
    const votes = devStorage.get(key) || [];
    votes.push(vote);
    devStorage.set(key, votes);
    console.log('[DEV] Vote saved to memory:', vote);
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('Blob write token is missing');
  }

  // Store each vote as a separate file with timestamp to avoid conflicts
  const voteKey = `sessions/${sessionId}/votes/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.json`;

  await put(voteKey, JSON.stringify(vote), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    token,
    cacheControlMaxAge: 0
  });
}

/**
 * Gets a user's raw vote history by reading all vote files.
 */
export async function getUserHistory(sessionId: string): Promise<VoteRecord[]> {
  // Use in-memory storage in development
  if (process.env.NODE_ENV !== 'production') {
    const key = `sessions/${sessionId}/votes`;
    const votes = devStorage.get(key) || [];
    console.log('[DEV] Returning votes from memory:', votes.length);
    return votes;
  }

  try {
    const { blobs } = await list({
      prefix: `sessions/${sessionId}/votes/`,
      limit: 1000
    });

    if (blobs.length === 0) return [];

    // Fetch all vote files in parallel
    const votes = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url, { cache: 'no-store' });
          if (!res.ok) return null;
          return await res.json() as VoteRecord;
        } catch {
          return null;
        }
      })
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