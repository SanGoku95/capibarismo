// API endpoint: POST /api/game/vote
// Submits a vote (minimal, fast response)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveVote } from '../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure only POST method is handled
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { sessionId, aId, bId, outcome } = req.body;

    // Validate required fields only
    if (!sessionId || !aId || !bId || (outcome !== 'A' && outcome !== 'B')) {
      return res.status(400).json({ error: 'Invalid vote data' });
    }

    const winnerId = outcome === 'A' ? aId : bId;
    const loserId = outcome === 'A' ? bId : aId;

    // Asynchronously save the vote without waiting
    saveVote(sessionId, winnerId, loserId).catch(console.error);

    // Return immediate success response
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[vote] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
