// API endpoint: POST /api/game/vote
// Submits a vote for a pair

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { waitUntil } from '@vercel/functions';
import { saveVote } from '../storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { sessionId, aId, bId, outcome } = req.body;

    if (!sessionId || !aId || !bId || !outcome) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const winnerId = outcome === 'A' ? aId : bId;
    const loserId = outcome === 'A' ? bId : aId;

    // Background processing for instant response
    waitUntil(saveVote(sessionId, winnerId, loserId));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Vote error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
