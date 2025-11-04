// API endpoint: GET /api/game/state
// Returns session statistics

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionStats } from '../storage';
import { listCandidates } from '../candidates-data';

export default function handler(req: VercelRequest, res: VercelResponse) {
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
    const sessionId = req.query.sessionId as string;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }
    
    const stats = getSessionStats(sessionId);
    const candidates = listCandidates();
    const candidateMap = new Map(candidates.map(c => [c.id, c]));
    
    // Build top-N preview
    const topN = stats.sessionRatings
      .slice(0, 5)
      .map(r => {
        const candidate = candidateMap.get(r.candidateId);
        return {
          candidateId: r.candidateId,
          name: candidate?.nombre || 'Unknown',
          rating: Math.round(r.rating),
        };
      });
    
    return res.status(200).json({
      sessionId,
      comparisons: stats.comparisons,
      progressPercent: stats.progressPercent,
      topN,
    });
  } catch (error) {
    console.error('Error in /api/game/state:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
