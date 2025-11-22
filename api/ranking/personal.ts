import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserHistory } from '../storage.js';
import { listCandidates } from '../candidates-data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sessionId = req.query.sessionId as string;
  if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

  try {
    const history = await getUserHistory(sessionId);
    const candidates = listCandidates();
    
    // Local Elo Calculation & Stats Tracking
    const localRatings: Record<string, number> = {};
    const stats: Record<string, { wins: number, losses: number, matches: number }> = {};
    
    candidates.forEach(c => {
      localRatings[c.id] = 1200;
      stats[c.id] = { wins: 0, losses: 0, matches: 0 };
    });

    const K = 32;
    
    for (const vote of history) {
      const rA = localRatings[vote.winnerId] || 1200;
      const rB = localRatings[vote.loserId] || 1200;
      
      const expectedA = 1 / (1 + Math.pow(10, (rB - rA) / 400));
      const expectedB = 1 / (1 + Math.pow(10, (rA - rB) / 400));
      
      localRatings[vote.winnerId] = rA + K * (1 - expectedA);
      localRatings[vote.loserId] = rB + K * (0 - expectedB);

      // Track stats
      if (stats[vote.winnerId]) {
        stats[vote.winnerId].wins++;
        stats[vote.winnerId].matches++;
      }
      if (stats[vote.loserId]) {
        stats[vote.loserId].losses++;
        stats[vote.loserId].matches++;
      }
    }

    const ranking = candidates
      .map(c => {
        const s = stats[c.id];
        const rating = Math.round(localRatings[c.id] || 1200);
        const winRate = s.matches > 0 ? Math.round((s.wins / s.matches) * 100) : 0;

        return {
          candidateId: c.id,
          name: c.nombre,
          ideologia: c.ideologia,
          imageFullBodyUrl: (c as any).foto_cuerpo || (c as any).imagen,
          rating: rating,
          score: rating,
          games: s.matches,
          winRate: winRate,
          rd: 0 // Personal ranking uncertainty placeholder
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return res.status(200).json(ranking);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}