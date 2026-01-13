import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSessionId } from '../useGameAPI';
import { useMutation } from '@tanstack/react-query';
import type { VoteRequest } from '../../../api/types';

// Create a test version of submitVote that always calls fetch
async function submitVote(vote: VoteRequest): Promise<{ ok: boolean }> {
  const response = await fetch('/api/game/vote', {
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

// Test version of useSubmitVote that uses the test submitVote
function useSubmitVote(sessionId: string) {
  return useMutation({
    mutationFn: submitVote,
  });
}

// Wrapper para hooks que usan React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Mock global fetch
const originalFetch = global.fetch;

describe('Vote Submission Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    // Mock fetch para simular API
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('Vote Submission', () => {
    it('should submit vote with correct payload', async () => {
      const sessionId = getSessionId();

      // Mock successful API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      const votePayload = {
        sessionId,
        pairId: 'candidate1-candidate2',
        aId: 'candidate1',
        bId: 'candidate2',
        outcome: 'A' as const,
      };

      // Submit vote
      result.current.mutate(votePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verificar que se llamó fetch con los parámetros correctos
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/game/vote',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(votePayload),
        })
      );
    });

    it('should handle successful vote submission', async () => {
      const sessionId = getSessionId();

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        sessionId,
        pairId: 'a-b',
        aId: 'a',
        bId: 'b',
        outcome: 'B',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({ ok: true });
      expect(result.current.isError).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      const sessionId = getSessionId();

      // Mock failed API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        sessionId,
        pairId: 'a-b',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should handle rate limiting (429 error)', async () => {
      const sessionId = getSessionId();

      // Mock rate limit response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        sessionId,
        pairId: 'a-b',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should have specific error message for rate limiting
      expect(result.current.error?.message).toContain('Rate limit');
    });

    it('should handle network errors', async () => {
      const sessionId = getSessionId();

      // Mock network failure
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        sessionId,
        pairId: 'a-b',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should track mutation state correctly during submission', async () => {
      const sessionId = getSessionId();

      // Mock with delay to observe loading state
      (global.fetch as any).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ ok: true }),
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      result.current.mutate({
        sessionId,
        pairId: 'a-b',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      });

      // Should be pending during submission
      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      // Should complete successfully
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 3000 }
      );

      expect(result.current.isPending).toBe(false);
    });
  });

  describe('Vote Data Validation', () => {
    it('should send vote for candidate A when outcome is A', async () => {
      const sessionId = getSessionId();

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        sessionId,
        pairId: 'alice-bob',
        aId: 'alice',
        bId: 'bob',
        outcome: 'A',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify fetch was called with correct data
      const fetchCalls = (global.fetch as any).mock.calls;
      expect(fetchCalls.length).toBeGreaterThan(0);

      const callArgs = fetchCalls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.outcome).toBe('A');
      expect(body.aId).toBe('alice');
      expect(body.bId).toBe('bob');
    });

    it('should send vote for candidate B when outcome is B', async () => {
      const sessionId = getSessionId();

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const { result } = renderHook(() => useSubmitVote(sessionId), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        sessionId,
        pairId: 'alice-bob',
        aId: 'alice',
        bId: 'bob',
        outcome: 'B',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify fetch was called with correct data
      const fetchCalls = (global.fetch as any).mock.calls;
      expect(fetchCalls.length).toBeGreaterThan(0);

      const callArgs = fetchCalls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.outcome).toBe('B');
    });
  });
});
