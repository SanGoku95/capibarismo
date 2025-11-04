// Pair selection logic for the ranking game

import { listCandidates } from './candidates-data';
import type { Pair } from './types';
import { getRating, getSeenPairs } from './storage';
import { nanoid } from 'nanoid';

// Pair selection strategy weights
const STRATEGY_WEIGHTS = {
  EXPLORE_UNCERTAINTY: 0.70,  // 70% of the time: high uncertainty candidates
  EXPLOIT_CLOSE_RATING: 0.20, // 20% of the time: close ratings to refine
  RANDOM_FALLBACK: 0.10,      // 10% of the time: random pairs
} as const;

// Generate a pair ID from two candidate IDs
function makePairId(aId: string, bId: string): string {
  // Normalize order to ensure same pair always has same ID
  const [first, second] = [aId, bId].sort();
  return `${first}:${second}`;
}

// Select next pair for a session
export function selectNextPair(sessionId: string): Pair | null {
  const candidates = listCandidates();
  const seenPairs = getSeenPairs(sessionId);
  
  if (candidates.length < 2) {
    return null;
  }
  
  // Get all candidate ratings
  const candidateRatings = candidates.map(c => ({
    ...c,
    rating: getRating(c.id),
  }));
  
  // Strategy 1: Explore high-uncertainty candidates
  if (Math.random() < STRATEGY_WEIGHTS.EXPLORE_UNCERTAINTY) {
    const pair = selectByUncertainty(candidateRatings, seenPairs);
    if (pair) return pair;
  }
  
  // Strategy 2: Exploit close ratings to refine ordering
  // Probability of this strategy among remaining strategies:
  // EXPLOIT_CLOSE_RATING / (EXPLOIT_CLOSE_RATING + RANDOM_FALLBACK) = 0.20 / 0.30 = 0.667
  const remainingProbability = STRATEGY_WEIGHTS.EXPLOIT_CLOSE_RATING / 
    (STRATEGY_WEIGHTS.EXPLOIT_CLOSE_RATING + STRATEGY_WEIGHTS.RANDOM_FALLBACK);
  
  if (Math.random() < remainingProbability) {
    const pair = selectByCloseRating(candidateRatings, seenPairs);
    if (pair) return pair;
  }
  
  // Strategy 3: Random fallback
  return selectRandom(candidateRatings, seenPairs);
}

// Select pair with highest combined uncertainty
function selectByUncertainty(
  candidates: Array<ReturnType<typeof listCandidates>[0] & { rating: ReturnType<typeof getRating> }>,
  seenPairs: Set<string>
): Pair | null {
  let bestPair: Pair | null = null;
  let bestScore = -1;
  
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const a = candidates[i];
      const b = candidates[j];
      const pairId = makePairId(a.id, b.id);
      
      if (seenPairs.has(pairId)) continue;
      
      const combinedRd = a.rating.rd + b.rating.rd;
      if (combinedRd > bestScore) {
        bestScore = combinedRd;
        bestPair = {
          pairId,
          a: {
            id: a.id,
            nombre: a.nombre,
            ideologia: a.ideologia,
            fullBody: a.fullBody,
            headshot: a.headshot,
          },
          b: {
            id: b.id,
            nombre: b.nombre,
            ideologia: b.ideologia,
            fullBody: b.fullBody,
            headshot: b.headshot,
          },
          hint: { rationale: "uncertainty" },
        };
      }
    }
  }
  
  return bestPair;
}

// Select pair with close ratings
function selectByCloseRating(
  candidates: Array<ReturnType<typeof listCandidates>[0] & { rating: ReturnType<typeof getRating> }>,
  seenPairs: Set<string>
): Pair | null {
  // Sort by rating
  const sorted = [...candidates].sort((a, b) => b.rating.rating - a.rating.rating);
  
  let bestPair: Pair | null = null;
  let smallestDiff = Infinity;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const pairId = makePairId(a.id, b.id);
    
    if (seenPairs.has(pairId)) continue;
    
    const diff = Math.abs(a.rating.rating - b.rating.rating);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestPair = {
        pairId,
        a: {
          id: a.id,
          nombre: a.nombre,
          ideologia: a.ideologia,
          fullBody: a.fullBody,
          headshot: a.headshot,
        },
        b: {
          id: b.id,
          nombre: b.nombre,
          ideologia: b.ideologia,
          fullBody: b.fullBody,
          headshot: b.headshot,
        },
        hint: { rationale: "close_rating" },
      };
    }
  }
  
  return bestPair;
}

// Select random pair
function selectRandom(
  candidates: Array<ReturnType<typeof listCandidates>[0] & { rating: ReturnType<typeof getRating> }>,
  seenPairs: Set<string>
): Pair | null {
  const unseenPairs: Array<[number, number]> = [];
  
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const pairId = makePairId(candidates[i].id, candidates[j].id);
      if (!seenPairs.has(pairId)) {
        unseenPairs.push([i, j]);
      }
    }
  }
  
  if (unseenPairs.length === 0) {
    // All pairs seen, pick any random pair
    const i = Math.floor(Math.random() * candidates.length);
    let j = Math.floor(Math.random() * candidates.length);
    while (j === i) {
      j = Math.floor(Math.random() * candidates.length);
    }
    
    const a = candidates[i];
    const b = candidates[j];
    
    return {
      pairId: makePairId(a.id, b.id),
      a: {
        id: a.id,
        nombre: a.nombre,
        ideologia: a.ideologia,
        fullBody: a.fullBody,
        headshot: a.headshot,
      },
      b: {
        id: b.id,
        nombre: b.nombre,
        ideologia: b.ideologia,
        fullBody: b.fullBody,
        headshot: b.headshot,
      },
      hint: { rationale: "random" },
    };
  }
  
  const [i, j] = unseenPairs[Math.floor(Math.random() * unseenPairs.length)];
  const a = candidates[i];
  const b = candidates[j];
  
  return {
    pairId: makePairId(a.id, b.id),
    a: {
      id: a.id,
      nombre: a.nombre,
      ideologia: a.ideologia,
      fullBody: a.fullBody,
      headshot: a.headshot,
    },
    b: {
      id: b.id,
      nombre: b.nombre,
      ideologia: b.ideologia,
      fullBody: b.fullBody,
      headshot: b.headshot,
    },
    hint: { rationale: "random" },
  };
}
