import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserHistory } from '../storage.js';
import { listCandidates, type CandidateBase } from '../candidates-data.js';
import { INITIAL_ELO, updateElo } from '../elo.js';
import type { VoteRecord, RankingEntry } from '../types.js';

// Configuration
const CORS_CONFIG = {
  origin: '*',
  methods: 'GET, OPTIONS',
  headers: 'Content-Type',
} as const;

// Types
interface CandidateStats {
  wins: number;
  losses: number;
  matches: number;
}

interface RatingState {
  ratings: Record<string, number>;
  stats: Record<string, CandidateStats>;
}

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
  res.setHeader('Allow', ['GET', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

function validateSessionId(sessionId: any): sessionId is string {
  return Boolean(sessionId && typeof sessionId === 'string');
}

function initializeRatingState(candidates: CandidateBase[]): RatingState {
  const ratings: Record<string, number> = {};
  const stats: Record<string, CandidateStats> = {};

  candidates.forEach((candidate) => {
    ratings[candidate.id] = INITIAL_ELO;
    stats[candidate.id] = { wins: 0, losses: 0, matches: 0 };
  });

  return { ratings, stats };
}

function processVoteHistory(
  history: VoteRecord[],
  state: RatingState
): void {
  for (const vote of history) {
    const { winnerId, loserId } = vote;

    // Get current ratings (default to INITIAL_ELO for unknown candidates)
    const ratingA = state.ratings[winnerId] ?? INITIAL_ELO;
    const ratingB = state.ratings[loserId] ?? INITIAL_ELO;

    // Update ELO ratings
    const [newA, newB] = updateElo(ratingA, ratingB, true);

    // Update ratings if candidates exist in our system
    if (state.ratings[winnerId] !== undefined) {
      state.ratings[winnerId] = newA;
    }
    if (state.ratings[loserId] !== undefined) {
      state.ratings[loserId] = newB;
    }

    // Update stats for known candidates
    if (state.stats[winnerId]) {
      state.stats[winnerId].wins++;
      state.stats[winnerId].matches++;
    }
    if (state.stats[loserId]) {
      state.stats[loserId].losses++;
      state.stats[loserId].matches++;
    }
  }
}

function calculateWinRate(wins: number, matches: number): number {
  if (matches === 0) return 0;
  return Math.round((wins / matches) * 100);
}

function buildRankingEntry(
  candidate: CandidateBase,
  state: RatingState
): Omit<RankingEntry, 'rank'> {
  const stats = state.stats[candidate.id];
  const rating = Math.round(state.ratings[candidate.id]);
  const winRate = calculateWinRate(stats.wins, stats.matches);

  return {
    candidateId: candidate.id,
    name: candidate.nombre,
    ideologia: candidate.ideologia,
    rating,
    score: rating,
    wins: stats.wins,
    losses: stats.losses,
    games: stats.matches,
    winRate,
    rd: 0, // Rating deviation placeholder
  };
}

function sortAndRankEntries(
  entries: Omit<RankingEntry, 'rank'>[]
): RankingEntry[] {
  return entries
    .sort((a, b) => b.rating - a.rating)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function calculatePersonalRanking(
  candidates: CandidateBase[],
  history: VoteRecord[]
): RankingEntry[] {
  // Initialize state
  const state = initializeRatingState(candidates);

  // Process all votes
  processVoteHistory(history, state);

  // Build ranking entries
  const entries = candidates.map((candidate) =>
    buildRankingEntry(candidate, state)
  );

  // Sort and assign ranks
  return sortAndRankEntries(entries);
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  setCorsHeaders(res);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightHeader(res);
  }

  // Ensure only GET method is handled
  if (req.method !== 'GET') {
    return handleInvalidMethod(req, res);
  }

  // Validate sessionId
  const sessionId = req.query.sessionId as string;
  if (!validateSessionId(sessionId)) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    // Fetch data in parallel for better performance
    const [history, candidates] = await Promise.all([
      getUserHistory(sessionId),
      Promise.resolve(listCandidates()),
    ]);

    // Calculate personal ranking
    const ranking = calculatePersonalRanking(candidates, history);

    return res.status(200).json(ranking);
  } catch (error) {
    console.error('[personal] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
