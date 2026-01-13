// API endpoint: POST /api/game/vote
// Submits a vote (minimal, fast response)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveVote } from '../storage.js';

// Types
interface VoteRequest {
  sessionId: string;
  aId: string;
  bId: string;
  outcome: 'A' | 'B';
}

// Configuration
const ALLOWED_METHODS = ['POST', 'OPTIONS'] as const;
const CORS_CONFIG = {
  origin: '*',
  methods: 'POST, OPTIONS',
  headers: 'Content-Type',
} as const;

// Helper functions
function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', CORS_CONFIG.origin);
  res.setHeader('Access-Control-Allow-Methods', CORS_CONFIG.methods);
  res.setHeader('Access-Control-Allow-Headers', CORS_CONFIG.headers);
}

function handleCorsPreflightHeader(res: VercelResponse): void {
  setCorsHeaders(res);
  res.status(200).end();
}

function handleInvalidMethod(req: VercelRequest, res: VercelResponse): void {
  setCorsHeaders(res);
  res.setHeader('Allow', ALLOWED_METHODS);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

function validateVoteRequest(body: any): body is VoteRequest {
  // Check if body exists and is an object
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return false;
  }

  const { sessionId, aId, bId, outcome } = body;

  // Validate all required fields are present and truthy
  if (!sessionId || !aId || !bId) {
    return false;
  }

  // Validate outcome is exactly 'A' or 'B'
  if (outcome !== 'A' && outcome !== 'B') {
    return false;
  }

  return true;
}

function processVote(voteData: VoteRequest): { winnerId: string; loserId: string } {
  const { aId, bId, outcome } = voteData;

  if (outcome === 'A') {
    return { winnerId: aId, loserId: bId };
  } else {
    return { winnerId: bId, loserId: aId };
  }
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  setCorsHeaders(res);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightHeader(res);
  }

  // Ensure only POST method is handled
  if (req.method !== 'POST') {
    return handleInvalidMethod(req, res);
  }

  try {
    // Validate request body
    if (!validateVoteRequest(req.body)) {
      return res.status(400).json({ error: 'Invalid vote data' });
    }

    const { sessionId } = req.body;
    const { winnerId, loserId } = processVote(req.body);

    // Asynchronously save the vote without waiting for it to complete
    // This provides a snappy user experience
    saveVote(sessionId, winnerId, loserId).catch((error) => {
      console.error('[vote] Failed to save vote:', error);
    });

    // Return immediate success response
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[vote] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
