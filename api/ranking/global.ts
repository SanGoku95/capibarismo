// API endpoint: GET /api/ranking/global
// Returns global rankings

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllRatings } from '../storage.js';
import { listCandidates } from '../candidates-data.js';
import type { GlobalRankingEntry } from '../types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    
    // For MVP, we only support 'all' window since we don't have timestamps
    // In production, you would filter by createdAt timestamp
    
    const ratings = await getAllRatings();
    const candidates = listCandidates();
    const candidateMap = new Map(candidates.map(c => [c.id, c]));
    
    // Calculate min/max ratings for normalization
    const ratingValues = ratings.map(r => r.rating);
    const minRating = Math.min(...ratingValues);
    const maxRating = Math.max(...ratingValues);
    const ratingRange = maxRating - minRating || 1;
    
    // Build ranking entries
    const entries: GlobalRankingEntry[] = ratings
      .filter(r => r.games > 0) // Only include candidates with games
      .map(r => {
        const candidate = candidateMap.get(r.candidateId);
        const normalizedScore = ((r.rating - minRating) / ratingRange) * 100;
        const winRate = r.games > 0 ? (r.wins / r.games) * 100 : 0;
        
        return {
          rank: 0, // Will be set after sorting
          candidateId: r.candidateId,
          name: candidate?.nombre || 'Unknown',
          ideologia: candidate?.ideologia,
          imageFullBodyUrl: candidate?.fullBody,
          score: Math.round(normalizedScore),
          rating: Math.round(r.rating),
          games: r.games,
          wins: r.wins,
          losses: r.losses,
          winRate: Math.round(winRate),
          rd: Math.round(r.rd),
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    
    // Apply filters (for future implementation)
    // if (filter.startsWith('party:')) {
    //   const party = filter.slice(6);
    //   entries = entries.filter(e => e.partido === party);
    // }
    
    return res.status(200).json(entries);
  } catch (error) {
    console.error('Error in /api/ranking/global:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
