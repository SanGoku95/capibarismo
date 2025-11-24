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
  
  try {
    const res = await fetch(`${process.env.BLOB_READ_URL}/${sessionKey}`, { cache: 'no-store' });
    if (res.ok) {
      history = await res.json();
    }
  } catch (e) {
    // File doesn't exist yet, start new history
  }

  history.push(vote);

  // Update personal file (overwrite with new array)
  await put(sessionKey, JSON.stringify(history), { 
    access: 'public', 
    addRandomSuffix: false,
    allowOverwrite: true
  });
}

/**
 * Gets a user's raw vote history.
 */
export async function getUserHistory(sessionId: string): Promise<VoteRecord[]> {
  try {
    const res = await fetch(`${process.env.BLOB_READ_URL}/sessions/${sessionId}.json`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}