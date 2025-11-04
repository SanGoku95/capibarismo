// API endpoint: GET /api/game/nextpair
// Returns the next pair of candidates to compare

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { selectNextPair } from '../pair-selection';

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
    
    const pair = selectNextPair(sessionId);
    
    if (!pair) {
      return res.status(404).json({ error: 'No pairs available' });
    }
    
    return res.status(200).json(pair);
  } catch (error) {
    console.error('Error in /api/game/nextpair:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
