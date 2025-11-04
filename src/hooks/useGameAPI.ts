// TanStack Query hooks for the ranking game

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';

// Types
import type { Pair, GameState, VoteRequest, GlobalRankingEntry } from '../../api/types';
// Session ID management
const SESSION_KEY = 'ranking-game-session-id';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = nanoid();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// API base URL
const API_BASE = '/api';

// Fetch next pair
async function fetchNextPair(sessionId: string): Promise<Pair> {
  const response = await fetch(`${API_BASE}/game/nextpair?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch next pair');
  }
  return response.json();
}

// Fetch game state
async function fetchGameState(sessionId: string): Promise<GameState> {
  const response = await fetch(`${API_BASE}/game/state?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game state');
  }
  return response.json();
}

// Submit vote
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
    throw new Error('Failed to submit vote');
  }
  
  return response.json();
}

// Fetch global ranking
async function fetchGlobalRanking(params: {
  window?: 'all' | '7d' | '1d';
  filter?: string;
}): Promise<GlobalRankingEntry[]> {
  const queryParams = new URLSearchParams();
  if (params.window) queryParams.set('window', params.window);
  if (params.filter) queryParams.set('filter', params.filter);
  
  const response = await fetch(`${API_BASE}/ranking/global?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch global ranking');
  }
  return response.json();
}

// Hook: useNextPair
export function useNextPair() {
  const sessionId = getSessionId();
  
  return useQuery({
    queryKey: ['nextPair', sessionId],
    queryFn: () => fetchNextPair(sessionId),
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    enabled: !!sessionId,
  });
}

// Hook: useGameState
export function useGameState() {
  const sessionId = getSessionId();
  
  return useQuery({
    queryKey: ['gameState', sessionId],
    queryFn: () => fetchGameState(sessionId),
    staleTime: 0,
    refetchInterval: false,
    enabled: !!sessionId,
  });
}

// Hook: useSubmitVote
export function useSubmitVote() {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  
  return useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['nextPair', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['gameState', sessionId] });
    },
    retry: 1,
  });
}

// Hook: useGlobalRanking
export function useGlobalRanking(params: {
  window?: 'all' | '7d' | '1d';
  filter?: string;
} = {}) {
  return useQuery({
    queryKey: ['globalRanking', params],
    queryFn: () => fetchGlobalRanking(params),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

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
