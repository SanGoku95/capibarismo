import { put } from '@vercel/blob';
import { VoteRecord } from './types.js';

/**
 * Saves a vote to the user's personal history file (sessions/{id}.json).
 */
export async function saveVote(sessionId: string, winnerId: string, loserId: string) {
  const vote: VoteRecord = { winnerId, loserId, timestamp: Date.now() };

  // 1. Update Personal History
  const sessionKey = `sessions/${sessionId}.json`;
  let history: VoteRecord[] = [];

  const baseUrl = process.env.BLOB_READ_URL;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!baseUrl || !token) {
    throw new Error('Blob environment variables are missing');
  }

  try {
    const res = await fetch(`${baseUrl}/${sessionKey}`, { cache: 'no-store' });
    if (res.ok) {
      history = await res.json();
    }
  } catch (e) {
    // File doesn't exist yet, start new history
  }
  history.push(vote);

  await put(sessionKey, JSON.stringify(history), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token
  });
}

/**
 * Gets a user's raw vote history.
 */
export async function getUserHistory(sessionId: string): Promise<VoteRecord[]> {
  try {
    const baseUrl = process.env.BLOB_READ_URL;
    if (!baseUrl) return [];

    const res = await fetch(`${baseUrl}/sessions/${sessionId}.json`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}