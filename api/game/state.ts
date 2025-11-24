// API endpoint: GET /api/game/state
// Returns session statistics

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserHistory } from '../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // No caching for game state
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sessionId = req.query.sessionId as string;
  if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

  try {
    const history = await getUserHistory(sessionId);
    
    // Create a set of seen pairs for the client to avoid duplicates
    const seenPairs = new Set<string>();

    for (const vote of history) {
      // Track seen pairs (sorted so A-B is same as B-A)
      const pairId = [vote.winnerId, vote.loserId].sort().join('-');
      seenPairs.add(pairId);
    }

    const GOAL = 20;
    const progressPercent = Math.min(100, Math.round((history.length / GOAL) * 100));

    return res.status(200).json({
      sessionId,
      comparisons: history.length,
      progressPercent,
      seenPairs: Array.from(seenPairs)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
