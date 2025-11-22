// API endpoint: GET /api/ranking/global
// Returns global rankings

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGlobalRatings } from '../storage.js';
import { listCandidates } from '../candidates-data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const snapshot = await getGlobalRatings();
    const candidates = listCandidates();
    
    const ranking = candidates.map(c => {
      const stats = snapshot.ratings[c.id] || { elo: 1200, wins: 0, losses: 0, matches: 0 };
      const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;
      
      return {
        candidateId: c.id, // Changed from id to candidateId
        name: c.nombre,
        ideologia: c.ideologia,
        imageFullBodyUrl: (c as any).foto_cuerpo || (c as any).imagen, // Map image if available
        rating: Math.round(stats.elo),
        score: Math.round(stats.elo), // Using Elo as score for display
        wins: stats.wins,
        losses: stats.losses,
        games: stats.matches, // Changed from matches to games
        winRate: winRate,
        rd: 0 // Default uncertainty if not in snapshot
      };
    }).sort((a, b) => b.rating - a.rating)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return res.status(200).json(ranking);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
