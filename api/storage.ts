// Simple in-memory storage for game data
// ⚠️ WARNING: This is MVP-only implementation!
// Data will reset on every deployment and won't persist across serverless instances.
// For production, replace with Redis (recommended: Upstash) or a database.
// See GAME_README.md for migration guide.

import type { PairwiseOutcome, Rating } from './types';
import { listCandidates } from './candidates-data';

// In-memory stores
const outcomes: PairwiseOutcome[] = [];
const ratings: Map<string, Rating> = new Map();
const sessionPairs: Map<string, Set<string>> = new Map();
const sessionVoteTimestamps: Map<string, number[]> = new Map();

// Constants
const INITIAL_ELO = 1500;
const INITIAL_RD = 350;
const BASE_K = 32;
const MIN_RD = 50;
const RD_DECAY_RATE = 0.95;

// Initialize ratings for all candidates
function initializeRatings() {
  if (ratings.size === 0) {
    const candidates = listCandidates();
    candidates.forEach(candidate => {
      ratings.set(candidate.id, {
        candidateId: candidate.id,
        rating: INITIAL_ELO,
        rd: INITIAL_RD,
        games: 0,
        wins: 0,
        losses: 0,
        lastUpdated: new Date().toISOString(),
      });
    });
  }
}

// Get or create rating
export function getRating(candidateId: string): Rating {
  initializeRatings();
  const rating = ratings.get(candidateId);
  if (!rating) {
    // Create new rating for unknown candidate
    const newRating: Rating = {
      candidateId,
      rating: INITIAL_ELO,
      rd: INITIAL_RD,
      games: 0,
      wins: 0,
      losses: 0,
      lastUpdated: new Date().toISOString(),
    };
    ratings.set(candidateId, newRating);
    return newRating;
  }
  return rating;
}

// Get all ratings
export function getAllRatings(): Rating[] {
  initializeRatings();
  return Array.from(ratings.values());
}

// Calculate expected score (Elo formula)
function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

// Calculate dynamic K-factor based on RD
function calculateK(rd: number): number {
  const rdFactor = Math.min(rd / INITIAL_RD, 1.5);
  return BASE_K * rdFactor;
}

// Update ratings after a match
export function updateRatings(winnerId: string, loserId: string): { winner: Rating; loser: Rating } {
  const winner = getRating(winnerId);
  const loser = getRating(loserId);

  const expectedWin = expectedScore(winner.rating, loser.rating);
  const expectedLoss = expectedScore(loser.rating, winner.rating);

  const kWinner = calculateK(winner.rd);
  const kLoser = calculateK(loser.rd);

  // Update ratings
  const newWinnerRating = winner.rating + kWinner * (1 - expectedWin);
  const newLoserRating = loser.rating + kLoser * (0 - expectedLoss);

  // Update RD (decrease with more games, but have a minimum)
  const newWinnerRd = Math.max(MIN_RD, winner.rd * RD_DECAY_RATE);
  const newLoserRd = Math.max(MIN_RD, loser.rd * RD_DECAY_RATE);

  const updatedWinner: Rating = {
    ...winner,
    rating: newWinnerRating,
    rd: newWinnerRd,
    games: winner.games + 1,
    wins: winner.wins + 1,
    lastUpdated: new Date().toISOString(),
  };

  const updatedLoser: Rating = {
    ...loser,
    rating: newLoserRating,
    rd: newLoserRd,
    games: loser.games + 1,
    losses: loser.losses + 1,
    lastUpdated: new Date().toISOString(),
  };

  ratings.set(winnerId, updatedWinner);
  ratings.set(loserId, updatedLoser);

  return { winner: updatedWinner, loser: updatedLoser };
}

// Store outcome
export function storeOutcome(outcome: PairwiseOutcome): void {
  outcomes.push(outcome);
  
  // Update ratings
  const winnerId = outcome.winner === "A" ? outcome.aId : outcome.bId;
  const loserId = outcome.winner === "A" ? outcome.bId : outcome.aId;
  updateRatings(winnerId, loserId);
}

// Get outcomes for a session
export function getSessionOutcomes(sessionId: string): PairwiseOutcome[] {
  return outcomes.filter(o => o.sessionId === sessionId);
}

// Track pairs shown to a session
export function addSessionPair(sessionId: string, pairId: string): void {
  if (!sessionPairs.has(sessionId)) {
    sessionPairs.set(sessionId, new Set());
  }
  sessionPairs.get(sessionId)!.add(pairId);
}

// Check if pair was already shown
export function hasSeenPair(sessionId: string, pairId: string): boolean {
  return sessionPairs.get(sessionId)?.has(pairId) || false;
}

// Get seen pairs for a session
export function getSeenPairs(sessionId: string): Set<string> {
  return sessionPairs.get(sessionId) || new Set();
}

// Rate limiting: track vote timestamps
export function addVoteTimestamp(sessionId: string): void {
  if (!sessionVoteTimestamps.has(sessionId)) {
    sessionVoteTimestamps.set(sessionId, []);
  }
  sessionVoteTimestamps.get(sessionId)!.push(Date.now());
}

// Check rate limit (max votes per minute)
export function checkRateLimit(sessionId: string, maxVotesPerMinute: number = 30): boolean {
  const timestamps = sessionVoteTimestamps.get(sessionId) || [];
  const oneMinuteAgo = Date.now() - 60000;
  const recentVotes = timestamps.filter(ts => ts > oneMinuteAgo);
  
  // Clean up old timestamps
  sessionVoteTimestamps.set(sessionId, recentVotes);
  
  return recentVotes.length < maxVotesPerMinute;
}

// Get all outcomes (for analytics)
export function getAllOutcomes(): PairwiseOutcome[] {
  return outcomes;
}

// Calculate session statistics
export function getSessionStats(sessionId: string): {
  comparisons: number;
  progressPercent: number;
  sessionRatings: Rating[];
} {
  const sessionOutcomes = getSessionOutcomes(sessionId);
  const comparisons = sessionOutcomes.length;
  
  // Build session-specific ratings
  const sessionRatingsMap = new Map<string, Rating>();
  const candidates = listCandidates();
  
  // Initialize with base ratings
  candidates.forEach(c => {
    sessionRatingsMap.set(c.id, {
      candidateId: c.id,
      rating: INITIAL_ELO,
      rd: INITIAL_RD,
      games: 0,
      wins: 0,
      losses: 0,
      lastUpdated: new Date().toISOString(),
    });
  });
  
  // Apply session outcomes
  sessionOutcomes.forEach(outcome => {
    const aRating = sessionRatingsMap.get(outcome.aId)!;
    const bRating = sessionRatingsMap.get(outcome.bId)!;
    
    const expectedA = expectedScore(aRating.rating, bRating.rating);
    const expectedB = expectedScore(bRating.rating, aRating.rating);
    
    const kA = calculateK(aRating.rd);
    const kB = calculateK(bRating.rd);
    
    if (outcome.winner === "A") {
      aRating.rating += kA * (1 - expectedA);
      bRating.rating += kB * (0 - expectedB);
      aRating.wins++;
      bRating.losses++;
    } else {
      bRating.rating += kB * (1 - expectedB);
      aRating.rating += kA * (0 - expectedA);
      bRating.wins++;
      aRating.losses++;
    }
    
    aRating.games++;
    bRating.games++;
    aRating.rd = Math.max(MIN_RD, aRating.rd * RD_DECAY_RATE);
    bRating.rd = Math.max(MIN_RD, bRating.rd * RD_DECAY_RATE);
  });
  
  const sessionRatings = Array.from(sessionRatingsMap.values())
    .filter(r => r.games > 0)
    .sort((a, b) => b.rating - a.rating);
  
  // Calculate progress
  const MIN_COMPARISONS = 15;
  const TARGET_AVG_RD = 120;
  
  const avgRd = sessionRatings.length > 0
    ? sessionRatings.reduce((sum, r) => sum + r.rd, 0) / sessionRatings.length
    : INITIAL_RD;
  
  const comparisonProgress = Math.min(comparisons / MIN_COMPARISONS, 1);
  const rdProgress = Math.max(0, 1 - (avgRd / TARGET_AVG_RD));
  const progressPercent = Math.round((comparisonProgress * 0.6 + rdProgress * 0.4) * 100);
  
  return {
    comparisons,
    progressPercent: Math.min(progressPercent, 100),
    sessionRatings,
  };
}
