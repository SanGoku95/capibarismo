// TanStack Query hooks for the ranking game

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base } from '../data/domains/base';
import type { CandidateBase } from '../data/types';
import { MAX_PAIR_SELECTION_ATTEMPTS, INITIAL_ELO } from '@/lib/gameConstants';
import { sessionService } from '@/services/sessionService';

// Helper to match previous API function signature
const listCandidates = (): CandidateBase[] => Object.values(base);

// Types
import type { Pair, VoteRequest, RankingEntry } from '../../api/types';

// Re-export session functions for backward compatibility
// Components can use these or directly use sessionService
export function getSessionId(): string {
  return sessionService.getSessionId();
}

export function resetSession(): string {
  return sessionService.resetSession();
}

// API base URL
const API_BASE = '/api';

// Prefetch next pair images
export function prefetchNextPair(pair: Pair | undefined) {
  if (!pair) return;

  // Prefetch images
  if (pair.a.fullBody) {
    const imgA = new Image();
    imgA.src = pair.a.fullBody;
  }
  if (pair.b.fullBody) {
    const imgB = new Image();
    imgB.src = pair.b.fullBody;
  }
}

// Fetch personal ranking
async function fetchPersonalRanking(sessionId: string): Promise<RankingEntry[]> {
  if (!sessionId) return [];

  // In development without API, return empty ranking
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_API) {
    console.log('[DEV] Mock ranking returned (empty)');
    return Promise.resolve([]);
  }

  const response = await fetch(`${API_BASE}/ranking/personal?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch personal ranking');
  }
  return response.json();
}

// Hook: useNextPair
export function useNextPair() {
  const sessionId = getSessionId();
  const isClient = typeof window !== 'undefined';

  return useQuery({
    queryKey: ['game', 'nextpair', sessionId],
    enabled: isClient && Boolean(sessionId),
    queryFn: () => {
      // Generate pair locally with smart selection
      const pair = generateSmartPair();
      prefetchNextPair(pair);
      return pair;
    },
    staleTime: 0, // Always generate fresh pair
    gcTime: 0, // Don't cache
    refetchOnWindowFocus: false,
  });
}

// Hook: usePersonalRanking
export function usePersonalRanking(sessionId: string) {
  return useQuery({
    queryKey: ['personalRanking', sessionId],
    queryFn: () => fetchPersonalRanking(sessionId),
    enabled: Boolean(sessionId),
    staleTime: 0, // Always fetch fresh data for personal results
    refetchOnWindowFocus: true,
  });
}

// Hook: useSubmitVote
export function useSubmitVote(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      // Invalidate in background (non-blocking)
      void queryClient.invalidateQueries({ queryKey: ['game', 'nextpair', sessionId] });
      void queryClient.invalidateQueries({ queryKey: ['personalRanking', sessionId] });
    },
    // Let caller handle errors
  });
}

// Submit vote with improved error handling
async function submitVote(vote: VoteRequest): Promise<{ ok: boolean }> {
  // In development without API, just mock success
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_API) {
    console.log('[DEV] Mock vote submitted:', vote);
    return Promise.resolve({ ok: true });
  }

  const response = await fetch(`${API_BASE}/game/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vote),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please slow down.');
    }
    if (response.status === 400) {
      throw new Error('Invalid vote data');
    }
    if (response.status >= 500) {
      throw new Error('Server error. Please try again.');
    }
    throw new Error('Failed to submit vote');
  }

  return response.json();
}

/**
 * Smart pair generation algorithm:
 * Phase 1 (Coverage): Prioritize candidates who haven't been seen yet
 * Phase 2 (Adaptive): Compare candidates with similar Elo ratings
 */
function generateSmartPair(): Pair {
  if (typeof window === 'undefined') {
    throw new Error('Pair generation requires a browser environment');
  }

  const candidates = listCandidates();
  if (candidates.length < 2) {
    throw new Error('Not enough candidates to generate a pair');
  }

  let seenPairs = sessionService.getSeenPairs();
  const appearances = sessionService.getCandidateAppearances();
  const ratings = sessionService.getLocalRatings();
  const totalPossiblePairs = (candidates.length * (candidates.length - 1)) / 2;

  // Reset seen pairs if all possible pairs have been shown
  if (seenPairs.size >= totalPossiblePairs) {
    sessionService.clearSeenPairs();
    seenPairs = new Set(); // Use fresh empty set after clearing
  }

  // Try smart selection first
  let pair = trySmartPairSelection(candidates, appearances, ratings, seenPairs);

  // Fallback to random if smart selection fails
  if (!pair) {
    pair = tryRandomPairSelection(candidates, seenPairs);
  }

  // Last resort: just pick any two candidates
  if (!pair) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    pair = createPair(candidateA, candidateB);
  }

  // Mark pair as seen and track appearances
  sessionService.addSeenPair(pair.pairId);
  sessionService.incrementCandidateAppearances([pair.a.id, pair.b.id]);

  return pair;
}

function trySmartPairSelection(
  candidates: CandidateBase[],
  appearances: Record<string, number>,
  ratings: Record<string, number>,
  seenPairs: Set<string>
): Pair | null {
  // Phase 1: Coverage - find candidates who haven't appeared yet
  const unseenCandidates = candidates.filter(c => (appearances[c.id] ?? 0) === 0);

  if (unseenCandidates.length >= 2) {
    // Pair two unseen candidates
    return tryPairFromList(unseenCandidates, seenPairs, 'coverage-both-new');
  }
  
  if (unseenCandidates.length === 1) {
    // Pair the unseen candidate with a random seen one
    const seenCandidates = candidates.filter(c => (appearances[c.id] ?? 0) > 0);
    if (seenCandidates.length > 0) {
      const pair = tryPairWithFirst(unseenCandidates[0], seenCandidates, seenPairs);
      if (pair) {
        return { ...pair, hint: { rationale: 'coverage-one-new' } };
      }
    }
  }

  // Phase 2: Adaptive - compare candidates with similar ratings
  // Sort by rating and pair adjacent candidates
  const sortedByRating = [...candidates].sort((a, b) => {
    const ratingA = ratings[a.id] ?? INITIAL_ELO;
    const ratingB = ratings[b.id] ?? INITIAL_ELO;
    return ratingB - ratingA;
  });

  // Try to find an unseen pair among candidates with similar ratings
  for (let i = 0; i < sortedByRating.length - 1; i++) {
    const candidateA = sortedByRating[i];
    // Look at nearby candidates (within 3 positions for variety)
    const nearbyIndices = [i + 1, i + 2, i + 3].filter(j => j < sortedByRating.length);
    
    for (const j of nearbyIndices) {
      const candidateB = sortedByRating[j];
      const pairId = createPairId(candidateA.id, candidateB.id);
      
      if (!seenPairs.has(pairId)) {
        return createPair(candidateA, candidateB, pairId, 'adaptive-similar-rating');
      }
    }
  }

  return null;
}

function tryRandomPairSelection(
  candidates: CandidateBase[],
  seenPairs: Set<string>
): Pair | null {
  for (let attempt = 0; attempt < MAX_PAIR_SELECTION_ATTEMPTS; attempt++) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    const pairId = createPairId(candidateA.id, candidateB.id);

    if (!seenPairs.has(pairId)) {
      return createPair(candidateA, candidateB, pairId, 'random');
    }
  }
  return null;
}

function tryPairFromList(
  candidates: CandidateBase[],
  seenPairs: Set<string>,
  rationale: string
): Pair | null {
  for (let attempt = 0; attempt < Math.min(MAX_PAIR_SELECTION_ATTEMPTS, candidates.length * 2); attempt++) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    const pairId = createPairId(candidateA.id, candidateB.id);

    if (!seenPairs.has(pairId)) {
      return createPair(candidateA, candidateB, pairId, rationale);
    }
  }
  return null;
}

function tryPairWithFirst(
  first: CandidateBase,
  others: CandidateBase[],
  seenPairs: Set<string>
): Pair | null {
  // Shuffle others for randomness
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  
  for (const second of shuffled) {
    const pairId = createPairId(first.id, second.id);
    if (!seenPairs.has(pairId)) {
      return createPair(first, second, pairId);
    }
  }
  return null;
}

function pickDistinctCandidates(candidates: CandidateBase[]): [CandidateBase, CandidateBase] {
  const firstIndex = Math.floor(Math.random() * candidates.length);
  let secondIndex = Math.floor(Math.random() * (candidates.length - 1));
  if (secondIndex >= firstIndex) {
    secondIndex += 1;
  }
  return [candidates[firstIndex], candidates[secondIndex]];
}

function createPair(
  candidateA: CandidateBase, 
  candidateB: CandidateBase, 
  pairId?: string,
  rationale: string = 'random'
): Pair {
  return {
    pairId: pairId ?? createPairId(candidateA.id, candidateB.id),
    a: {
      id: candidateA.id,
      nombre: candidateA.nombre,
      ideologia: candidateA.ideologia,
      fullBody: candidateA.fullBody,
      headshot: candidateA.headshot,
    },
    b: {
      id: candidateB.id,
      nombre: candidateB.nombre,
      ideologia: candidateB.ideologia,
      fullBody: candidateB.fullBody,
      headshot: candidateB.headshot,
    },
    hint: { rationale },
  };
}

function createPairId(aId: string, bId: string): string {
  return [aId, bId].sort().join('-');
}
