/**
 * Centralized session management service.
 * Handles session IDs, vote counts, seen pairs tracking, and local Elo ratings.
 */

import { nanoid } from 'nanoid';
import { localStorageService, sessionStorageService, type StorageService } from './browserStorage';
import { INITIAL_ELO, ELO_K } from '@/lib/gameConstants';

// Storage keys
const SESSION_KEY = 'ranking-game-session-id';
const SEEN_PAIRS_KEY_PREFIX = 'ranking-game-seen-pairs';
const LOCAL_VOTE_COUNT_PREFIX = 'local-vote-count';
const COMPLETION_SHOWN_PREFIX = 'completion-shown';
const LOCAL_RATINGS_PREFIX = 'local-ratings';
const CANDIDATE_APPEARANCES_PREFIX = 'candidate-appearances';

export type CompletionTier = 'none' | 'preliminary' | 'recommended';

export interface SessionService {
  // Session ID management
  getSessionId(): string;
  resetSession(): string;

  // Vote count management
  getVoteCount(sessionId?: string): number;
  incrementVoteCount(): number;
  decrementVoteCount(): number;
  resetVoteCount(): void;

  // Seen pairs management
  getSeenPairs(): Set<string>;
  addSeenPair(pairId: string): void;
  clearSeenPairs(): void;

  // Completion status (now supports tiers)
  getCompletionTierShown(): CompletionTier;
  markCompletionTierShown(tier: CompletionTier): void;
  clearCompletionStatus(): void;
  
  // Legacy compatibility
  isCompletionShown(): boolean;
  markCompletionAsShown(): void;

  // Local Elo ratings for smart pair selection
  getLocalRatings(): Record<string, number>;
  updateLocalRatings(winnerId: string, loserId: string): void;
  clearLocalRatings(): void;

  // Candidate appearances tracking for coverage
  getCandidateAppearances(): Record<string, number>;
  incrementCandidateAppearances(candidateIds: string[]): void;
  clearCandidateAppearances(): void;
}

// Elo calculation helper
function calculateExpected(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function updateEloRatings(
  ratings: Record<string, number>,
  winnerId: string,
  loserId: string
): Record<string, number> {
  const ratingA = ratings[winnerId] ?? INITIAL_ELO;
  const ratingB = ratings[loserId] ?? INITIAL_ELO;
  
  const expectedA = calculateExpected(ratingA, ratingB);
  const expectedB = calculateExpected(ratingB, ratingA);
  
  return {
    ...ratings,
    [winnerId]: ratingA + ELO_K * (1 - expectedA),
    [loserId]: ratingB + ELO_K * (0 - expectedB),
  };
}

/**
 * Creates a session service with the given storage implementations.
 * This allows dependency injection for testing.
 */
export function createSessionService(
  localStorage: StorageService = localStorageService,
  sessionStorage: StorageService = sessionStorageService
): SessionService {
  let _cachedSessionId: string | null = null;

  function getSessionId(): string {
    if (_cachedSessionId) return _cachedSessionId;

    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = nanoid();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    _cachedSessionId = sessionId;
    return sessionId;
  }

  function resetSession(): string {
    // Get old session ID to clean up
    const oldSessionId = _cachedSessionId || localStorage.getItem(SESSION_KEY);
    if (oldSessionId) {
      // Clear all session-specific data
      localStorage.removeItem(getSeenPairsKey(oldSessionId));
      localStorage.removeItem(getVoteCountKey(oldSessionId));
      localStorage.removeItem(getLocalRatingsKey(oldSessionId));
      localStorage.removeItem(getCandidateAppearancesKey(oldSessionId));
      sessionStorage.removeItem(getCompletionKey(oldSessionId));
    }

    // Generate new session ID
    const newSessionId = nanoid();
    localStorage.setItem(SESSION_KEY, newSessionId);
    _cachedSessionId = newSessionId;

    return newSessionId;
  }

  function getVoteCountKey(sessionId?: string): string {
    const id = sessionId || getSessionId();
    return `${LOCAL_VOTE_COUNT_PREFIX}-${id}`;
  }

  function getSeenPairsKey(sessionId?: string): string {
    const id = sessionId || getSessionId();
    return `${SEEN_PAIRS_KEY_PREFIX}:${id}`;
  }

  function getCompletionKey(sessionId?: string): string {
    const id = sessionId || getSessionId();
    return `${COMPLETION_SHOWN_PREFIX}-${id}`;
  }

  function getLocalRatingsKey(sessionId?: string): string {
    const id = sessionId || getSessionId();
    return `${LOCAL_RATINGS_PREFIX}-${id}`;
  }

  function getCandidateAppearancesKey(sessionId?: string): string {
    const id = sessionId || getSessionId();
    return `${CANDIDATE_APPEARANCES_PREFIX}-${id}`;
  }

  function getVoteCount(sessionId?: string): number {
    const key = getVoteCountKey(sessionId);
    const stored = localStorage.getItem(key);
    if (!stored) return 0;

    const count = Number(stored);
    return Number.isFinite(count) ? count : 0;
  }

  function incrementVoteCount(): number {
    const current = getVoteCount();
    const next = current + 1;
    localStorage.setItem(getVoteCountKey(), String(next));
    return next;
  }

  function decrementVoteCount(): number {
    const current = getVoteCount();
    const next = Math.max(0, current - 1);
    localStorage.setItem(getVoteCountKey(), String(next));
    return next;
  }

  function resetVoteCount(): void {
    localStorage.removeItem(getVoteCountKey());
  }

  function getSeenPairs(): Set<string> {
    const key = getSeenPairsKey();
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();

      // Filter to ensure all values are strings
      return new Set(parsed.filter((value): value is string => typeof value === 'string'));
    } catch {
      return new Set();
    }
  }

  function addSeenPair(pairId: string): void {
    const seenPairs = getSeenPairs();
    seenPairs.add(pairId);
    localStorage.setItem(getSeenPairsKey(), JSON.stringify(Array.from(seenPairs)));
  }

  function clearSeenPairs(): void {
    localStorage.removeItem(getSeenPairsKey());
  }

  // New: Tiered completion status
  function getCompletionTierShown(): CompletionTier {
    const key = getCompletionKey();
    const value = sessionStorage.getItem(key);
    if (value === 'preliminary' || value === 'recommended') {
      return value;
    }
    // Legacy compatibility: 'true' means preliminary was shown
    if (value === 'true') {
      return 'preliminary';
    }
    return 'none';
  }

  function markCompletionTierShown(tier: CompletionTier): void {
    const key = getCompletionKey();
    sessionStorage.setItem(key, tier);
  }

  function clearCompletionStatus(): void {
    const key = getCompletionKey();
    sessionStorage.removeItem(key);
  }

  // Legacy compatibility
  function isCompletionShown(): boolean {
    return getCompletionTierShown() !== 'none';
  }

  function markCompletionAsShown(): void {
    markCompletionTierShown('preliminary');
  }

  // Local Elo ratings
  function getLocalRatings(): Record<string, number> {
    const raw = browserStorage.getItem(STORAGE_KEYS.LOCAL_RATINGS);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (!isRecordOfNumbers(parsed)) return {};
      return parsed;
    } catch {
      return {};
    }
  }

  function updateLocalRatings(winnerId: string, loserId: string): void {
    const current = getLocalRatings();
    const updated = updateEloRatings(current, winnerId, loserId);
    localStorage.setItem(getLocalRatingsKey(), JSON.stringify(updated));
  }

  function clearLocalRatings(): void {
    localStorage.removeItem(getLocalRatingsKey());
  }

  // Candidate appearances tracking
  function getCandidateAppearances(): Record<string, number> {
    const raw = browserStorage.getItem(STORAGE_KEYS.CANDIDATE_APPEARANCES);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (!isRecordOfNumbers(parsed)) return {};
      return parsed;
    } catch {
      return {};
    }
  }

  function incrementCandidateAppearances(candidateIds: string[]): void {
    const current = getCandidateAppearances();
    for (const id of candidateIds) {
      current[id] = (current[id] ?? 0) + 1;
    }
    localStorage.setItem(getCandidateAppearancesKey(), JSON.stringify(current));
  }

  function clearCandidateAppearances(): void {
    localStorage.removeItem(getCandidateAppearancesKey());
  }

  return {
    getSessionId,
    resetSession,
    getVoteCount,
    incrementVoteCount,
    decrementVoteCount,
    resetVoteCount,
    getSeenPairs,
    addSeenPair,
    clearSeenPairs,
    getCompletionTierShown,
    markCompletionTierShown,
    clearCompletionStatus,
    isCompletionShown,
    markCompletionAsShown,
    getLocalRatings,
    updateLocalRatings,
    clearLocalRatings,
    getCandidateAppearances,
    incrementCandidateAppearances,
    clearCandidateAppearances,
  };
}

/**
 * Default session service instance using browser storage.
 * Use this in application code.
 */
export const sessionService = createSessionService();
