// API endpoint: GET /api/ranking/global
// Returns global rankings from pre-calculated snapshot

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGlobalRatings } from '../storage.js';
import { listCandidates } from '../candidates-data.js';
import { INITIAL_ELO } from '../elo.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const snapshot = await getGlobalRatings();
    const candidates = listCandidates();
    
    const ranking = candidates
      .map(c => {
        const stats = snapshot.ratings[c.id] || { 
          elo: INITIAL_ELO, 
          wins: 0, 
          losses: 0, 
          matches: 0 
        };
        const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;
        
        return {
          rank: 0, // Set after sorting
          candidateId: c.id,
          name: c.nombre,
          ideologia: c.ideologia,
          imageFullBodyUrl: (c as any).foto_cuerpo || (c as any).imagen,
          rating: Math.round(stats.elo),
          score: Math.round(stats.elo),
          wins: stats.wins,
          losses: stats.losses,
          games: stats.matches,
          winRate,
          rd: 0
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return res.status(200).json(ranking);
  } catch (error) {
    console.error('[global] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
