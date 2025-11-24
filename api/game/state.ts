// API endpoint: GET /api/game/state
// Returns lightweight session statistics for game HUD

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserHistory } from '../storage.js';
import { listCandidates } from '../candidates-data.js';
import { INITIAL_ELO, updateElo } from '../elo.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sessionId = req.query.sessionId as string;
  if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

  try {
    const history = await getUserHistory(sessionId);
    const candidates = listCandidates();
    
    // Calculate ratings and track seen pairs
    const localRatings: Record<string, number> = {};
    candidates.forEach(c => localRatings[c.id] = INITIAL_ELO);
    
    const seenPairs = new Set<string>();

    for (const vote of history) {
      seenPairs.add([vote.winnerId, vote.loserId].sort().join('-'));
      
      const rA = localRatings[vote.winnerId] || INITIAL_ELO;
      const rB = localRatings[vote.loserId] || INITIAL_ELO;
      const [newA, newB] = updateElo(rA, rB, true);
      
      localRatings[vote.winnerId] = newA;
      localRatings[vote.loserId] = newB;
    }

    return res.status(200).json({
      sessionId,
      comparisons: history.length,
      seenPairs: Array.from(seenPairs)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}