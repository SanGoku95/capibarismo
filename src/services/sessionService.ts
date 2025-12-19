/**
 * Centralized session management service.
 * Handles session IDs, vote counts, and seen pairs tracking.
 */

import { nanoid } from 'nanoid';
import { localStorageService, sessionStorageService, type StorageService } from './browserStorage';

// Storage keys
const SESSION_KEY = 'ranking-game-session-id';
const SEEN_PAIRS_KEY_PREFIX = 'ranking-game-seen-pairs';
const LOCAL_VOTE_COUNT_PREFIX = 'local-vote-count';
const COMPLETION_SHOWN_PREFIX = 'completion-shown';

export interface SessionService {
  // Session ID management
  getSessionId(): string;
  resetSession(): string;

  // Vote count management
  getVoteCount(): number;
  incrementVoteCount(): number;
  decrementVoteCount(): number;
  resetVoteCount(): void;

  // Seen pairs management
  getSeenPairs(): Set<string>;
  addSeenPair(pairId: string): void;
  clearSeenPairs(): void;

  // Completion status
  isCompletionShown(): boolean;
  markCompletionAsShown(): void;
  clearCompletionStatus(): void;
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
      // Clear seen pairs for old session
      localStorage.removeItem(getSeenPairsKey(oldSessionId));
      localStorage.removeItem(getVoteCountKey(oldSessionId));
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

  function getVoteCount(): number {
    const key = getVoteCountKey();
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

  function isCompletionShown(): boolean {
    const key = getCompletionKey();
    return sessionStorage.getItem(key) === 'true';
  }

  function markCompletionAsShown(): void {
    const key = getCompletionKey();
    sessionStorage.setItem(key, 'true');
  }

  function clearCompletionStatus(): void {
    const key = getCompletionKey();
    sessionStorage.removeItem(key);
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
    isCompletionShown,
    markCompletionAsShown,
    clearCompletionStatus,
  };
}

/**
 * Default session service instance using browser storage.
 * Use this in application code.
 */
export const sessionService = createSessionService();
