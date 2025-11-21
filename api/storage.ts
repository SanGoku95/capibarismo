// Vercel Blob storage for game data
// Scalable, persistent storage across serverless instances
// Data persists across deployments and serverless instances

import { put, head, list } from '@vercel/blob';
import type { PairwiseOutcome, Rating } from './types.js';
import { listCandidates } from './candidates-data.js';

// Constants
const INITIAL_ELO = 1500;
const INITIAL_RD = 350;
const BASE_K = 32;
const MIN_RD = 50;
const RD_DECAY_RATE = 0.95;

// Blob storage keys
const RATINGS_KEY = 'rankings/ratings.json';
const OUTCOMES_KEY = 'rankings/outcomes.json';
const SESSION_PAIRS_PREFIX = 'rankings/sessions/';

// Cache for reducing blob reads (in-memory, per-instance)
let ratingsCache: Map<string, Rating> | null = null;
let ratingsCacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds

// Helper: Read JSON from blob
async function readBlob<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // Check if blob exists
    const blobs = await list({ prefix: key, limit: 1 });
    if (blobs.blobs.length === 0) return defaultValue;
    
    const response = await fetch(blobs.blobs[0].url);
    return await response.json();
  } catch (error) {
    console.error(`[storage] Error reading blob ${key}:`, error);
    return defaultValue;
  }
}

// Helper: Write JSON to blob
async function writeBlob(key: string, data: any): Promise<void> {
  try {
    const blob = JSON.stringify(data);
    await put(key, blob, { 
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error(`[storage] Error writing blob ${key}:`, error);
    throw error;
  }
}

// Get or create rating
export async function getRating(candidateId: string): Promise<Rating> {
  const ratings = await getAllRatings();
  const rating = ratings.find(r => r.candidateId === candidateId);
  
  if (!rating) {
    return {
      candidateId,
      rating: INITIAL_ELO,
      rd: INITIAL_RD,
      games: 0,
      wins: 0,
      losses: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
  
  return rating;
}

// Get all ratings with caching
export async function getAllRatings(): Promise<Rating[]> {
  const now = Date.now();
  
  // Use cache if fresh
  if (ratingsCache && (now - ratingsCacheTime) < CACHE_TTL) {
    return Array.from(ratingsCache.values());
  }
  
  // Read from blob
  const ratingsArray = await readBlob<Rating[]>(RATINGS_KEY, []);
  
  // Initialize if empty
  if (ratingsArray.length === 0) {
    const candidates = listCandidates();
    const initialized = candidates.map(c => ({
      candidateId: c.id,
      rating: INITIAL_ELO,
      rd: INITIAL_RD,
      games: 0,
      wins: 0,
      losses: 0,
      lastUpdated: new Date().toISOString(),
    }));
    await writeBlob(RATINGS_KEY, initialized);
    ratingsCache = new Map(initialized.map(r => [r.candidateId, r]));
    ratingsCacheTime = now;
    return initialized;
  }
  
  // Update cache
  ratingsCache = new Map(ratingsArray.map(r => [r.candidateId, r]));
  ratingsCacheTime = now;
  
  return ratingsArray;
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
export async function updateRatings(winnerId: string, loserId: string): Promise<{ winner: Rating; loser: Rating }> {
  const allRatings = await getAllRatings();
  const winner = allRatings.find(r => r.candidateId === winnerId) || await getRating(winnerId);
  const loser = allRatings.find(r => r.candidateId === loserId) || await getRating(loserId);

  const expectedWin = expectedScore(winner.rating, loser.rating);
  const expectedLoss = expectedScore(loser.rating, winner.rating);

  const kWinner = calculateK(winner.rd);
  const kLoser = calculateK(loser.rd);

  // Calculate new ratings
  const updatedWinner: Rating = {
    ...winner,
    rating: winner.rating + kWinner * (1 - expectedWin),
    rd: Math.max(MIN_RD, winner.rd * RD_DECAY_RATE),
    games: winner.games + 1,
    wins: winner.wins + 1,
    lastUpdated: new Date().toISOString(),
  };

  const updatedLoser: Rating = {
    ...loser,
    rating: loser.rating + kLoser * (0 - expectedLoss),
    rd: Math.max(MIN_RD, loser.rd * RD_DECAY_RATE),
    games: loser.games + 1,
    losses: loser.losses + 1,
    lastUpdated: new Date().toISOString(),
  };

  // Update all ratings in blob
  const updatedRatings = allRatings.map(r => {
    if (r.candidateId === winnerId) return updatedWinner;
    if (r.candidateId === loserId) return updatedLoser;
    return r;
  });
  
  await writeBlob(RATINGS_KEY, updatedRatings);
  
  // Invalidate cache
  ratingsCache = null;

  return { winner: updatedWinner, loser: updatedLoser };
}

// Store outcome
export async function storeOutcome(outcome: PairwiseOutcome): Promise<void> {
  const outcomes = await readBlob<PairwiseOutcome[]>(OUTCOMES_KEY, []);
  outcomes.push(outcome);
  await writeBlob(OUTCOMES_KEY, outcomes);
  
  // Update ratings
  const winnerId = outcome.winner === "A" ? outcome.aId : outcome.bId;
  const loserId = outcome.winner === "A" ? outcome.bId : outcome.aId;
  await updateRatings(winnerId, loserId);
}

// Get outcomes for a session
export async function getSessionOutcomes(sessionId: string): Promise<PairwiseOutcome[]> {
  const outcomes = await readBlob<PairwiseOutcome[]>(OUTCOMES_KEY, []);
  return outcomes.filter(o => o.sessionId === sessionId);
}

// Track pairs shown to a session
export async function addSessionPair(sessionId: string, pairId: string): Promise<void> {
  const key = `${SESSION_PAIRS_PREFIX}${sessionId}.json`;
  const pairs = await readBlob<string[]>(key, []);
  if (!pairs.includes(pairId)) {
    pairs.push(pairId);
    await writeBlob(key, pairs);
  }
}

// Get seen pairs for a session
export async function getSeenPairs(sessionId: string): Promise<Set<string>> {
  const key = `${SESSION_PAIRS_PREFIX}${sessionId}.json`;
  const pairs = await readBlob<string[]>(key, []);
  return new Set(pairs);
}

// Check rate limit (simplified - stores last N votes)
export async function checkRateLimit(sessionId: string, maxVotesPerMinute: number = 30): Promise<boolean> {
  const key = `${SESSION_PAIRS_PREFIX}${sessionId}-votes.json`;
  const timestamps = await readBlob<number[]>(key, []);
  
  const oneMinuteAgo = Date.now() - 60000;
  const recentVotes = timestamps.filter(ts => ts > oneMinuteAgo);
  
  // Add current timestamp
  recentVotes.push(Date.now());
  
  // Keep only recent votes
  await writeBlob(key, recentVotes.slice(-maxVotesPerMinute));
  
  return recentVotes.length <= maxVotesPerMinute;
}

// Calculate session statistics
export async function getSessionStats(sessionId: string): Promise<{
  comparisons: number;
  progressPercent: number;
  sessionRatings: Rating[];
}> {
  const sessionOutcomes = await getSessionOutcomes(sessionId);
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
