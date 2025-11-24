// TanStack Query hooks for the ranking game

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { base } from '../data/domains/base';
import type { CandidateBase } from '../data/types';

// Helper to match previous API function signature
const listCandidates = (): CandidateBase[] => Object.values(base);

// Types
import type { Pair, GameState, VoteRequest, RankingEntry } from '../../api/types';
// Session ID management
const SESSION_KEY = 'ranking-game-session-id';
const SEEN_PAIRS_KEY_PREFIX = 'ranking-game-seen-pairs';
const MAX_PAIR_SELECTION_ATTEMPTS = 50;

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
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('Session ID unavailable');
      }

      const pair = generateLocalPair(sessionId);
      prefetchNextPair(pair);
      return pair;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
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
export function useSubmitVote() {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  
  return useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      // Just invalidate the next pair and personal ranking
      queryClient.invalidateQueries({ queryKey: ['game', 'nextpair', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['personalRanking', sessionId] });
    },
    onError: (error) => {
      console.error('Vote submission failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit vote');
    }
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
async function fetcher<T = unknown>(url: string, opts?: RequestInit): Promise<T | null> {
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

function generateLocalPair(sessionId: string): Pair {
  if (typeof window === 'undefined') {
    throw new Error('Pair generation requires a browser environment');
  }

  const candidates = listCandidates();
  if (candidates.length < 2) {
    throw new Error('Not enough candidates to generate a pair');
  }

  const seenPairs = loadSeenPairs(sessionId);
  const totalPossiblePairs = (candidates.length * (candidates.length - 1)) / 2;

  if (seenPairs.size >= totalPossiblePairs) {
    seenPairs.clear();
    persistSeenPairs(sessionId, seenPairs);
  }

  let pair: Pair | null = null;

  for (let attempt = 0; attempt < MAX_PAIR_SELECTION_ATTEMPTS; attempt++) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    const pairId = createPairId(candidateA.id, candidateB.id);

    if (!seenPairs.has(pairId)) {
      pair = createPair(candidateA, candidateB, pairId);
      break;
    }
  }

  if (!pair) {
    const [candidateA, candidateB] = pickDistinctCandidates(candidates);
    pair = createPair(candidateA, candidateB);
  }

  seenPairs.add(pair.pairId);
  persistSeenPairs(sessionId, seenPairs);

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

function loadSeenPairs(sessionId: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(getSeenPairsKey(sessionId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((value): value is string => typeof value === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function persistSeenPairs(sessionId: string, seenPairs: Set<string>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getSeenPairsKey(sessionId), JSON.stringify(Array.from(seenPairs)));
}

function getSeenPairsKey(sessionId: string): string {
  return `${SEEN_PAIRS_KEY_PREFIX}:${sessionId}`;
}
