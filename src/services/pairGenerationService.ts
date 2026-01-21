/**
 * Smart pair generation service for the ranking game.
 * 
 * Implements a two-phase algorithm:
 * 1. Coverage Phase: Ensures all candidates appear at least once
 * 2. Adaptive Phase: Pairs candidates with similar ratings for better discrimination
 */

import { base } from '@/data/domains/base';
import type { CandidateBase } from '@/data/types';
import type { Pair } from '../../api/types';
import { sessionService } from './sessionService';
import { MAX_PAIR_SELECTION_ATTEMPTS, INITIAL_ELO } from '@/lib/gameConstants';

// =============================================================================
// Types
// =============================================================================

type PairRationale = 
  | 'coverage-both-new' 
  | 'coverage-one-new' 
  | 'adaptive-similar-rating' 
  | 'random';

interface PairGenerationContext {
  candidates: CandidateBase[];
  seenPairs: Set<string>;
  appearances: Record<string, number>;
  ratings: Record<string, number>;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Generates a smart pair of candidates for comparison.
 * Prioritizes coverage first, then adaptive selection based on ratings.
 */
export function generateSmartPair(): Pair {
  assertBrowserEnvironment();

  const candidates = listCandidates();
  assertMinimumCandidates(candidates);

  const context = buildContext(candidates);
  
  const pair = 
    tryCoverageSelection(context) ??
    tryAdaptiveSelection(context) ??
    tryRandomSelection(context) ??
    createFallbackPair(context.candidates);

  recordPairSelection(pair);
  
  return pair;
}

// =============================================================================
// Context Building
// =============================================================================

function listCandidates(): CandidateBase[] {
  return Object.values(base);
}

function buildContext(candidates: CandidateBase[]): PairGenerationContext {
  let seenPairs = sessionService.getSeenPairs();
  const totalPossiblePairs = calculateTotalPairs(candidates.length);

  // Reset if all pairs have been shown
  if (seenPairs.size >= totalPossiblePairs) {
    sessionService.clearSeenPairs();
    seenPairs = new Set();
  }

  return {
    candidates,
    seenPairs,
    appearances: sessionService.getCandidateAppearances(),
    ratings: sessionService.getLocalRatings(),
  };
}

function calculateTotalPairs(n: number): number {
  return (n * (n - 1)) / 2;
}

// =============================================================================
// Phase 1: Coverage Selection
// =============================================================================

function tryCoverageSelection(ctx: PairGenerationContext): Pair | null {
  const unseenCandidates = ctx.candidates.filter(
    c => (ctx.appearances[c.id] ?? 0) === 0
  );

  if (unseenCandidates.length >= 2) {
    return tryPairFromList(unseenCandidates, ctx.seenPairs, 'coverage-both-new');
  }

  if (unseenCandidates.length === 1) {
    const seenCandidates = ctx.candidates.filter(
      c => (ctx.appearances[c.id] ?? 0) > 0
    );
    return tryPairWithCandidate(
      unseenCandidates[0], 
      seenCandidates, 
      ctx.seenPairs,
      'coverage-one-new'
    );
  }

  return null;
}

// =============================================================================
// Phase 2: Adaptive Selection
// =============================================================================

function tryAdaptiveSelection(ctx: PairGenerationContext): Pair | null {
  const sortedByRating = sortCandidatesByRating(ctx.candidates, ctx.ratings);
  
  // Try to pair adjacent candidates (similar ratings = more informative comparison)
  const NEARBY_RANGE = 3;
  
  for (let i = 0; i < sortedByRating.length - 1; i++) {
    const candidateA = sortedByRating[i];
    
    for (let offset = 1; offset <= NEARBY_RANGE; offset++) {
      const j = i + offset;
      if (j >= sortedByRating.length) break;
      
      const candidateB = sortedByRating[j];
      const pairId = createPairId(candidateA.id, candidateB.id);
      
      if (!ctx.seenPairs.has(pairId)) {
        return createPair(candidateA, candidateB, pairId, 'adaptive-similar-rating');
      }
    }
  }

  return null;
}

function sortCandidatesByRating(
  candidates: CandidateBase[], 
  ratings: Record<string, number>
): CandidateBase[] {
  return [...candidates].sort((a, b) => {
    const ratingA = ratings[a.id] ?? INITIAL_ELO;
    const ratingB = ratings[b.id] ?? INITIAL_ELO;
    return ratingB - ratingA;
  });
}

// =============================================================================
// Fallback: Random Selection
// =============================================================================

function tryRandomSelection(ctx: PairGenerationContext): Pair | null {
  for (let attempt = 0; attempt < MAX_PAIR_SELECTION_ATTEMPTS; attempt++) {
    const [a, b] = pickTwoRandomCandidates(ctx.candidates);
    const pairId = createPairId(a.id, b.id);

    if (!ctx.seenPairs.has(pairId)) {
      return createPair(a, b, pairId, 'random');
    }
  }
  return null;
}

function createFallbackPair(candidates: CandidateBase[]): Pair {
  const [a, b] = pickTwoRandomCandidates(candidates);
  return createPair(a, b);
}

// =============================================================================
// Helper Functions
// =============================================================================

function tryPairFromList(
  candidates: CandidateBase[],
  seenPairs: Set<string>,
  rationale: PairRationale
): Pair | null {
  const maxAttempts = Math.min(MAX_PAIR_SELECTION_ATTEMPTS, candidates.length * 2);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const [a, b] = pickTwoRandomCandidates(candidates);
    const pairId = createPairId(a.id, b.id);

    if (!seenPairs.has(pairId)) {
      return createPair(a, b, pairId, rationale);
    }
  }
  return null;
}

function tryPairWithCandidate(
  first: CandidateBase,
  others: CandidateBase[],
  seenPairs: Set<string>,
  rationale: PairRationale
): Pair | null {
  const shuffled = shuffleArray(others);
  
  for (const second of shuffled) {
    const pairId = createPairId(first.id, second.id);
    if (!seenPairs.has(pairId)) {
      return createPair(first, second, pairId, rationale);
    }
  }
  return null;
}

function pickTwoRandomCandidates(
  candidates: CandidateBase[]
): [CandidateBase, CandidateBase] {
  const firstIndex = Math.floor(Math.random() * candidates.length);
  let secondIndex = Math.floor(Math.random() * (candidates.length - 1));
  
  if (secondIndex >= firstIndex) {
    secondIndex += 1;
  }
  
  return [candidates[firstIndex], candidates[secondIndex]];
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function createPairId(aId: string, bId: string): string {
  return [aId, bId].sort().join('-');
}

function createPair(
  candidateA: CandidateBase,
  candidateB: CandidateBase,
  pairId?: string,
  rationale: PairRationale = 'random'
): Pair {
  const id = pairId ?? createPairId(candidateA.id, candidateB.id);
  
  return {
    pairId: id,
    a: mapCandidateToPairMember(candidateA),
    b: mapCandidateToPairMember(candidateB),
    hint: { rationale },
  };
}

function mapCandidateToPairMember(candidate: CandidateBase) {
  return {
    id: candidate.id,
    nombre: candidate.nombre,
    ideologia: candidate.ideologia,
    fullBody: candidate.fullBody,
    headshot: candidate.headshot,
  };
}

function recordPairSelection(pair: Pair): void {
  sessionService.addSeenPair(pair.pairId);
  sessionService.incrementCandidateAppearances([pair.a.id, pair.b.id]);
}

// =============================================================================
// Assertions
// =============================================================================

function assertBrowserEnvironment(): void {
  if (typeof window === 'undefined') {
    throw new Error('Pair generation requires a browser environment');
  }
}

function assertMinimumCandidates(candidates: CandidateBase[]): void {
  if (candidates.length < 2) {
    throw new Error('Not enough candidates to generate a pair');
  }
}