/**
 * TanStack Query hooks for the ranking game.
 * Provides data fetching and mutation hooks for game state management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/sessionService';
import { generateSmartPair } from '@/services/pairGenerationService';
import { useGameUIStore } from '@/store/useGameUIStore';
import type { Pair, VoteRequest, RankingEntry } from '../../api/types';

// =============================================================================
// Constants
// =============================================================================

const API_BASE = '/api';

// =============================================================================
// Session Management (Re-exports for backward compatibility)
// =============================================================================

export const getSessionId = (): string => sessionService.getSessionId();
export const resetSession = (): string => sessionService.resetSession();

// =============================================================================
// Image Prefetching
// =============================================================================

function prefetchPairImages(pair: Pair | undefined): void {
  if (!pair) return;

  const prefetchImage = (src: string | undefined) => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  };

  prefetchImage(pair.a.fullBody);
  prefetchImage(pair.b.fullBody);
}

// =============================================================================
// API Functions
// =============================================================================

async function fetchPersonalRanking(sessionId: string): Promise<RankingEntry[]> {
  if (!sessionId) return [];

  if (import.meta.env.DEV && !import.meta.env.VITE_USE_API) {
    console.log('[DEV] Mock ranking returned (empty)');
    return [];
  }

  const response = await fetch(`${API_BASE}/ranking/personal?sessionId=${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch personal ranking');
  }
  
  return response.json();
}

async function submitVote(vote: VoteRequest): Promise<{ ok: boolean }> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_API) {
    console.log('[DEV] Mock vote submitted:', vote);
    return { ok: true };
  }

  const response = await fetch(`${API_BASE}/game/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vote),
  });

  if (!response.ok) {
    throw createVoteError(response.status);
  }

  return response.json();
}

function createVoteError(status: number): Error {
  const errorMessages: Record<number, string> = {
    429: 'Rate limit exceeded. Please slow down.',
    400: 'Invalid vote data',
  };
  
  if (status >= 500) {
    return new Error('Server error. Please try again.');
  }
  
  return new Error(errorMessages[status] ?? 'Failed to submit vote');
}

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to get the next pair of candidates for comparison.
 * Uses smart pair selection for optimal ranking convergence.
 * Respects qualifier filtering if the user has completed the qualifier round.
 */
export function useNextPair() {
  const sessionId = getSessionId();
  const isClient = typeof window !== 'undefined';
  const qualifiedCandidateIds = useGameUIStore(state => state.qualifiedCandidateIds);
  const hasCompletedQualifier = useGameUIStore(state => state.hasCompletedQualifier);

  return useQuery({
    queryKey: ['game', 'nextpair', sessionId, qualifiedCandidateIds],
    enabled: isClient && Boolean(sessionId),
    queryFn: () => {
      // Only filter by qualified candidates if qualifier has been completed
      const filterIds = hasCompletedQualifier && qualifiedCandidateIds.length > 0 
        ? qualifiedCandidateIds 
        : undefined;
      
      const pair = generateSmartPair(filterIds);
      prefetchPairImages(pair);
      return pair;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch the user's personal ranking based on their votes.
 */
export function usePersonalRanking(sessionId: string) {
  return useQuery({
    queryKey: ['personalRanking', sessionId],
    queryFn: () => fetchPersonalRanking(sessionId),
    enabled: Boolean(sessionId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to submit a vote. Invalidates relevant queries on success.
 */
export function useSubmitVote(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['game', 'nextpair', sessionId] });
      void queryClient.invalidateQueries({ queryKey: ['personalRanking', sessionId] });
    },
  });
}
