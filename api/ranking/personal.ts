import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserHistory } from '../storage.js';
import { listCandidates } from '../candidates-data.js';
import { INITIAL_ELO, updateElo } from '../elo.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure only GET method is handled
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    // This now works correctly because storage.ts is fixed
    const history = await getUserHistory(sessionId);
    const candidates = listCandidates();

    // Initialize ratings and stats
    const localRatings: Record<string, number> = {};
    const stats: Record<string, { wins: number; losses: number; matches: number }> = {};

    candidates.forEach((c) => {
      localRatings[c.id] = INITIAL_ELO;
      stats[c.id] = { wins: 0, losses: 0, matches: 0 };
    });

    // Replay vote history to calculate personal ranking
    for (const vote of history) {
      const rA = localRatings[vote.winnerId] || INITIAL_ELO;
      const rB = localRatings[vote.loserId] || INITIAL_ELO;
      const [newA, newB] = updateElo(rA, rB, true);

      localRatings[vote.winnerId] = newA;
      localRatings[vote.loserId] = newB;

      if (stats[vote.winnerId]) {
        stats[vote.winnerId].wins++;
        stats[vote.winnerId].matches++;
      }
      if (stats[vote.loserId]) {
        stats[vote.loserId].losses++;
        stats[vote.loserId].matches++;
      }
    }

    // Build and sort the final ranking
    const ranking = candidates
      .map((c) => {
        const s = stats[c.id];
        const rating = Math.round(localRatings[c.id]);
        const winRate = s.matches > 0 ? Math.round((s.wins / s.matches) * 100) : 0;

        return {
          rank: 0,
          candidateId: c.id,
          name: c.nombre,
          ideologia: c.ideologia,
          rating,
          score: rating,
          wins: s.wins,
          losses: s.losses,
          games: s.matches,
          winRate,
          rd: 0,
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return res.status(200).json(ranking);
  } catch (error) {
    console.error('[personal] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}