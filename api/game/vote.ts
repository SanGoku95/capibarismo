// API endpoint: POST /api/game/vote
// Submits a vote for a pair

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nanoid } from 'nanoid';
import { storeOutcome, addSessionPair, checkRateLimit } from '../storage.js';
import type { VoteRequest, PairwiseOutcome } from '../types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const body = req.body as VoteRequest;
    const { sessionId, pairId, aId, bId, outcome } = body;
    
    // Validate request
    if (!sessionId || !pairId || !aId || !bId || !outcome) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (outcome !== 'A' && outcome !== 'B') {
      return res.status(400).json({ error: 'Invalid outcome' });
    }
    
    // Check rate limit
    if (!(await checkRateLimit(sessionId, 30))) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    // Create outcome record
    const outcomeRecord: PairwiseOutcome = {
      id: nanoid(),
      sessionId,
      aId,
      bId,
      winner: outcome,
      createdAt: new Date().toISOString(),
      clientMeta: {
        uaHash: req.headers['user-agent'] ? hashString(req.headers['user-agent'] as string) : undefined,
        screen: req.headers['sec-ch-viewport-width'] as string,
        tz: req.headers['sec-ch-ua-timezone'] as string,
      },
    };
    
    // Store outcome and update ratings
    await storeOutcome(outcomeRecord);
    await addSessionPair(sessionId, pairId);
    
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error in /api/game/vote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Simple hash function for anonymization
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
