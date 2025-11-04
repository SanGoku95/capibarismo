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
    queryKey: ['game', 'nextpair', sessionId],
    queryFn: async () => {
      console.log('[useNextPair] Fetching pair for session:', sessionId);
      const result = await fetcher<Pair>(`/api/game/nextpair?sessionId=${sessionId}`);
      console.log('[useNextPair] Got result:', result ? 'pair found' : 'null');
      return result;
    },
    keepPreviousData: true,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// New: Hook: useGameState
export function useGameState() {
  const sessionId = getSessionId();
  return useQuery({
    queryKey: ['game', 'state', sessionId],
    queryFn: () => fetcher(`/api/game/state?sessionId=${sessionId}`),
    keepPreviousData: true,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// Hook: useSubmitVote
export function useSubmitVote() {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  
  return useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      // Invalidate and refetch the correct query keys
      queryClient.invalidateQueries({ queryKey: ['game', 'nextpair', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['game', 'state', sessionId] });
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

// --- replace the previous fetcher + unused fetchNextPair / fetchGameState definitions
async function fetcher<T = any>(url: string, opts?: RequestInit): Promise<T | null> {
  const res = await fetch(url, opts);

  // 304 Not Modified -> no new data; return null so react-query sees a defined value
  if (res.status === 304) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  try {
    // If response has no body or is not JSON, return null rather than undefined
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (e) {
    return null;
  }
}
