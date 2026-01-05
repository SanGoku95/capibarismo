// TanStack Query hooks for the ranking game

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base } from '../data/domains/base';
import type { CandidateBase } from '../data/types';
import { MAX_PAIR_SELECTION_ATTEMPTS } from '@/lib/gameConstants';
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
      // Generate pair locally - no network call needed
      const pair = generateLocalPair();
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

// Generate a pair of candidates locally
function generateLocalPair(): Pair {
  if (typeof window === 'undefined') {
    throw new Error('Pair generation requires a browser environment');
  }

  const candidates = listCandidates();
  if (candidates.length < 2) {
    throw new Error('Not enough candidates to generate a pair');
  }

  const seenPairs = sessionService.getSeenPairs();
  const totalPossiblePairs = (candidates.length * (candidates.length - 1)) / 2;

  // Reset seen pairs if all possible pairs have been shown
  if (seenPairs.size >= totalPossiblePairs) {
    sessionService.clearSeenPairs();
  }

  let pair: Pair | null = null;

  // Try to find an unseen pair
  for (let attempt = 0; attempt < MAX_PAIR_SELECTION_ATTEMPTS; attempt++) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    const pairId = createPairId(candidateA.id, candidateB.id);

    if (!seenPairs.has(pairId)) {
      pair = createPair(candidateA, candidateB, pairId);
      break;
    }
  }

  // Fallback: if we couldn't find an unseen pair, just generate a random one
  if (!pair) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    pair = createPair(candidateA, candidateB);
  }

  // Mark pair as seen
  sessionService.addSeenPair(pair.pairId);

  return pair;
}

function pickDistinctCandidates(candidates: CandidateBase[]): [CandidateBase, CandidateBase] {
  const firstIndex = Math.floor(Math.random() * candidates.length);
  let secondIndex = Math.floor(Math.random() * (candidates.length - 1));
  if (secondIndex >= firstIndex) {
    secondIndex += 1;
  }
  return [candidates[firstIndex], candidates[secondIndex]];
}

function createPair(candidateA: CandidateBase, candidateB: CandidateBase, pairId?: string): Pair {
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
    hint: { rationale: 'random' },
  };
}

function createPairId(aId: string, bId: string): string {
  return [aId, bId].sort().join('-');
}
