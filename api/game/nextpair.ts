// API endpoint: GET /api/game/nextpair
// Returns the next pair of candidates to compare

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { selectNextPair } from '../pair-selection.js';
import { listCandidates } from '../candidates-data.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    
    console.log('[nextpair] Request received, sessionId:', sessionId);
    
    if (!sessionId) {
      console.error('[nextpair] Missing sessionId');
      return res.status(400).json({ error: 'sessionId is required' });
    }
    
    // Verify we have candidates
    const candidates = listCandidates();
    console.log('[nextpair] Available candidates:', candidates.length);
    
    if (candidates.length < 2) {
      console.error('[nextpair] Not enough candidates:', candidates.length);
      return res.status(500).json({ error: 'Not enough candidates available' });
    }
    
    const pair = await selectNextPair(sessionId);
    
    console.log('[nextpair] selectNextPair result:', pair ? `Pair ID: ${pair.pairId}` : 'NULL');
    
    if (!pair) {
      console.error('[nextpair] selectNextPair returned null for session:', sessionId);
      console.error('[nextpair] This suggests an issue in pair-selection logic');
      // This should never happen, but if it does, return an error instead of null
      return res.status(500).json({ 
        error: 'Failed to generate pair',
        sessionId,
        candidateCount: candidates.length
      });
    }
    
    console.log('[nextpair] Successfully generated pair:', pair.pairId, 'A:', pair.a.nombre, 'vs B:', pair.b.nombre);
    return res.status(200).json(pair);
  } catch (error) {
    console.error('[nextpair] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
