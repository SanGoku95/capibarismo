// API endpoint: GET /api/game/nextpair
// Returns the next pair of candidates to compare

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { selectNextPair } from '../pair-selection';
import { listCandidates } from '../candidates-data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Strong no-cache to avoid platform returning 304
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.removeHeader?.('ETag');

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
      return res.status(400).json({ error: 'sessionId is required' });
    }
    
    const pair = selectNextPair(sessionId);
    
    if (!pair) {
      return res.status(200).json(null);
    }
    
    return res.status(200).json(pair);
  } catch (error) {
    console.error('nextpair error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
