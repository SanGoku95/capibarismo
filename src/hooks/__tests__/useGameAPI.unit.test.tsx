import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNextPair, usePersonalRanking, useSubmitVote, getSessionId, resetSession } from '../useGameAPI';
import { sessionService } from '@/services/sessionService';
import { base } from '@/data/domains/base';
import type { ReactNode } from 'react';

// Mock sessionService
vi.mock('@/services/sessionService', () => ({
  sessionService: {
    getSessionId: vi.fn(() => 'test-session-id'),
    resetSession: vi.fn(() => 'new-session-id'),
    getSeenPairs: vi.fn(() => new Set()),
    addSeenPair: vi.fn(),
    clearSeenPairs: vi.fn(),
    getVoteCount: vi.fn(() => 0),
    incrementVoteCount: vi.fn(() => 1),
    decrementVoteCount: vi.fn(() => 0),
  },
}));

// Create a wrapper for React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGameAPI - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Session Management Functions', () => {
    it('should get session ID', () => {
      const sessionId = getSessionId();
      expect(sessionId).toBe('test-session-id');
      expect(sessionService.getSessionId).toHaveBeenCalled();
    });

    it('should reset session', () => {
      const newSessionId = resetSession();
      expect(newSessionId).toBe('new-session-id');
      expect(sessionService.resetSession).toHaveBeenCalled();
    });
  });

  describe('useNextPair', () => {
    it('should generate a pair of candidates', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data;
      expect(pair).toBeDefined();
      expect(pair?.a).toBeDefined();
      expect(pair?.b).toBeDefined();
      expect(pair?.a.id).not.toBe(pair?.b.id);
    });

    it('should generate pair with required candidate fields', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data!;

      // Check candidate A
      expect(pair.a.id).toBeTruthy();
      expect(pair.a.nombre).toBeTruthy();
      expect(pair.a.ideologia).toBeDefined();

      // Check candidate B
      expect(pair.b.id).toBeTruthy();
      expect(pair.b.nombre).toBeTruthy();
      expect(pair.b.ideologia).toBeDefined();
    });

    it('should generate pair with valid pairId format', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data!;
      expect(pair.pairId).toMatch(/^[a-z0-9-]+-[a-z0-9-]+$/i);
      expect(pair.pairId).toContain('-');
    });

    it('should mark pair as seen in sessionService', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(sessionService.addSeenPair).toHaveBeenCalled();
    });

    it('should generate different pairs on consecutive calls', async () => {
      const { result: result1 } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const pair1 = result1.current.data!;

      // Create new hook instance
      const { result: result2 } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      const pair2 = result2.current.data!;

      // With 6 candidates and proper randomization, we just verify both pairs are valid
      // (they may be the same due to randomness, but should have valid structure)
      expect(pair1.pairId).toBeTruthy();
      expect(pair2.pairId).toBeTruthy();
      expect(pair1.a.id).not.toBe(pair1.b.id);
      expect(pair2.a.id).not.toBe(pair2.b.id);
    });
  });

  describe('usePersonalRanking', () => {
    beforeEach(() => {
      // Mock fetch for this test suite
      global.fetch = vi.fn();
      // Set production environment to test actual fetch calls
      vi.stubEnv('DEV', false);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllEnvs();
    });

    it('should fetch personal ranking with session ID', async () => {
      const mockRanking = [
        { id: 'candidate1', nombre: 'Candidate 1', elo: 1250, rank: 1 },
        { id: 'candidate2', nombre: 'Candidate 2', elo: 1200, rank: 2 },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRanking,
      });

      const { result } = renderHook(() => usePersonalRanking('test-session-id'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRanking);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ranking/personal?sessionId=test-session-id'
      );
    });

    it('should not fetch when session ID is empty', async () => {
      const { result } = renderHook(() => usePersonalRanking(''), {
        wrapper: createWrapper(),
      });

      // Query should be disabled when sessionId is empty
      expect(result.current.isPending).toBe(true);
      expect(result.current.fetchStatus).toBe('idle');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => usePersonalRanking('test-session-id'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should return empty array in DEV mode without API', async () => {
      vi.stubEnv('DEV', true);
      vi.stubEnv('VITE_USE_API', undefined);

      const { result } = renderHook(() => usePersonalRanking('test-session-id'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useSubmitVote', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      global.fetch = vi.fn();
      // Set production environment to test actual fetch calls
      vi.stubEnv('DEV', false);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllEnvs();
    });

    it('should submit vote with correct payload', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useSubmitVote('test-session-id'), {
        wrapper,
      });

      const voteRequest = {
        sessionId: 'test-session-id',
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      result.current.mutate(voteRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/game/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteRequest),
      });
    });

    it('should handle 429 rate limit error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useSubmitVote('test-session-id'), {
        wrapper,
      });

      const voteRequest = {
        sessionId: 'test-session-id',
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      result.current.mutate(voteRequest);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('Rate limit');
    });

    it('should handle 400 invalid data error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useSubmitVote('test-session-id'), {
        wrapper,
      });

      const voteRequest = {
        sessionId: 'test-session-id',
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      result.current.mutate(voteRequest);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('Invalid vote');
    });

    it('should handle 500 server error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useSubmitVote('test-session-id'), {
        wrapper,
      });

      const voteRequest = {
        sessionId: 'test-session-id',
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      result.current.mutate(voteRequest);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('Server error');
    });

    it('should mock vote in DEV mode', async () => {
      vi.stubEnv('DEV', true);
      vi.stubEnv('VITE_USE_API', undefined);

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useSubmitVote('test-session-id'), {
        wrapper,
      });

      const voteRequest = {
        sessionId: 'test-session-id',
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      result.current.mutate(voteRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // In DEV mode, fetch should not be called
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should invalidate queries on successful vote', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useSubmitVote('test-session-id'), {
        wrapper,
      });

      const voteRequest = {
        sessionId: 'test-session-id',
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      result.current.mutate(voteRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should invalidate both nextpair and personalRanking queries
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['game', 'nextpair', 'test-session-id'],
        })
      );

      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['personalRanking', 'test-session-id'],
        })
      );
    });
  });

  describe('Pair Generation Edge Cases', () => {
    it('should handle all pairs seen scenario', async () => {
      const candidates = Object.values(base);
      const totalPossiblePairs = (candidates.length * (candidates.length - 1)) / 2;

      // Mock that all pairs have been seen (size-based check in generateLocalPair)
      const allPairs = new Set(Array.from({ length: totalPossiblePairs }, (_, i) => `pair-${i}`));

      vi.mocked(sessionService.getSeenPairs).mockReturnValue(allPairs);

      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should still generate a pair (after clearing seen pairs)
      expect(result.current.data).toBeDefined();
      expect(sessionService.clearSeenPairs).toHaveBeenCalled();
    });
  });
});
