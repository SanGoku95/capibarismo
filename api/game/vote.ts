// API endpoint: POST /api/game/vote
// Submits a vote (minimal, fast response)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { waitUntil } from '@vercel/functions';
import { saveVote } from '../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { sessionId, aId, bId, outcome } = req.body;

    // Validate required fields only
    if (!sessionId || !aId || !bId || (outcome !== 'A' && outcome !== 'B')) {
      return res.status(400).json({ error: 'Invalid vote data' });
    }

    const winnerId = outcome === 'A' ? aId : bId;
    const loserId = outcome === 'A' ? bId : aId;

    // Process vote in background for instant response
    await saveVote(sessionId, winnerId, loserId);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[vote] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
