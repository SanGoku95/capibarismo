import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOptimisticVote } from '../useOptimisticVote';
import { sessionService } from '@/services/sessionService';
import type { ReactNode } from 'react';

// Mock dependencies
vi.mock('@/services/sessionService', () => ({
  sessionService: {
    getVoteCount: vi.fn(() => 0),
    incrementVoteCount: vi.fn(() => 1),
    decrementVoteCount: vi.fn(() => 0),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('../useGameAPI', () => ({
  useSubmitVote: vi.fn((sessionId: string) => {
    const mutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    return mutation;
  }),
}));

import { useSubmitVote } from '../useGameAPI';
import { toast } from 'sonner';

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

describe('useOptimisticVote', () => {
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockMutation: { mutate: typeof mockMutate; isPending: boolean };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset vote count
    vi.mocked(sessionService.getVoteCount).mockReturnValue(0);
    vi.mocked(sessionService.incrementVoteCount).mockReturnValue(1);
    vi.mocked(sessionService.decrementVoteCount).mockReturnValue(0);

    // Setup mock mutation
    mockMutate = vi.fn();
    mockMutation = {
      mutate: mockMutate,
      isPending: false,
    };
    vi.mocked(useSubmitVote).mockReturnValue(mockMutation as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with vote count from sessionService', () => {
      vi.mocked(sessionService.getVoteCount).mockReturnValue(5);

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.voteCount).toBe(5);
      expect(sessionService.getVoteCount).toHaveBeenCalled();
    });

    it('should start with isSubmitting false', () => {
      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('Optimistic Vote Submission', () => {
    it('should increment vote count immediately (optimistic update)', () => {
      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'A');
      });

      // Should increment vote count immediately
      expect(sessionService.incrementVoteCount).toHaveBeenCalled();
      expect(result.current.voteCount).toBe(1);
    });

    it('should call submitVote mutation with correct data', () => {
      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'B');
      });

      expect(mockMutate).toHaveBeenCalledWith(
        {
          sessionId: 'test-session-id',
          pairId: 'candidate1-candidate2',
          aId: 'candidate1',
          bId: 'candidate2',
          outcome: 'B',
        },
        expect.objectContaining({
          onError: expect.any(Function),
        })
      );
    });

    it('should not submit vote if pair is undefined', () => {
      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleVote(undefined, 'A');
      });

      expect(mockMutate).not.toHaveBeenCalled();
      expect(sessionService.incrementVoteCount).not.toHaveBeenCalled();
    });

    it('should prevent double voting when mutation is pending', () => {
      mockMutation.isPending = true;

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'A');
      });

      expect(mockMutate).not.toHaveBeenCalled();
      expect(sessionService.incrementVoteCount).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling and Rollback', () => {
    it('should rollback optimistic update on error', () => {
      let onErrorCallback: ((error: Error) => void) | null = null;

      // Capture the onError callback
      mockMutate.mockImplementation((voteRequest, options) => {
        onErrorCallback = options.onError;
      });

      vi.mocked(sessionService.getVoteCount).mockReturnValue(5);
      vi.mocked(sessionService.incrementVoteCount).mockReturnValue(6);
      vi.mocked(sessionService.decrementVoteCount).mockReturnValue(5);

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'A');
      });

      // Verify optimistic update happened
      expect(sessionService.incrementVoteCount).toHaveBeenCalled();
      expect(result.current.voteCount).toBe(6);

      // Simulate error
      act(() => {
        onErrorCallback?.(new Error('Network error'));
      });

      // Should rollback
      expect(sessionService.decrementVoteCount).toHaveBeenCalled();
      expect(result.current.voteCount).toBe(5);
    });

    it('should show error toast on submission failure', () => {
      let onErrorCallback: ((error: Error) => void) | null = null;

      mockMutate.mockImplementation((voteRequest, options) => {
        onErrorCallback = options.onError;
      });

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'A');
      });

      // Simulate error
      act(() => {
        onErrorCallback?.(new Error('Rate limit exceeded'));
      });

      expect(toast.error).toHaveBeenCalledWith('Rate limit exceeded');
    });

    it('should show generic error message for non-Error objects', () => {
      let onErrorCallback: ((error: any) => void) | null = null;

      mockMutate.mockImplementation((voteRequest, options) => {
        onErrorCallback = options.onError;
      });

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'A');
      });

      // Simulate error with non-Error object
      act(() => {
        onErrorCallback?.('Something went wrong');
      });

      expect(toast.error).toHaveBeenCalledWith('Error al enviar voto');
    });

    it('should log error to console on failure', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      let onErrorCallback: ((error: Error) => void) | null = null;

      mockMutate.mockImplementation((voteRequest, options) => {
        onErrorCallback = options.onError;
      });

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair, 'A');
      });

      const testError = new Error('Test error');
      act(() => {
        onErrorCallback?.(testError);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to submit vote:', testError);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Multiple Votes', () => {
    it('should handle multiple successful votes sequentially', () => {
      vi.mocked(sessionService.getVoteCount).mockReturnValue(0);
      let voteCount = 0;
      vi.mocked(sessionService.incrementVoteCount).mockImplementation(() => {
        voteCount++;
        return voteCount;
      });

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      const mockPair1 = {
        pairId: 'candidate1-candidate2',
        a: { id: 'candidate1', nombre: 'Candidate 1', ideologia: 'Centro' },
        b: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        hint: { rationale: 'random' as const },
      };

      const mockPair2 = {
        pairId: 'candidate2-candidate3',
        a: { id: 'candidate2', nombre: 'Candidate 2', ideologia: 'Izquierda' },
        b: { id: 'candidate3', nombre: 'Candidate 3', ideologia: 'Derecha' },
        hint: { rationale: 'random' as const },
      };

      act(() => {
        result.current.handleVote(mockPair1, 'A');
      });
      expect(result.current.voteCount).toBe(1);

      act(() => {
        result.current.handleVote(mockPair2, 'B');
      });
      expect(result.current.voteCount).toBe(2);

      expect(sessionService.incrementVoteCount).toHaveBeenCalledTimes(2);
      expect(mockMutate).toHaveBeenCalledTimes(2);
    });
  });

  describe('isPending State', () => {
    it('should reflect mutation pending state', () => {
      mockMutation.isPending = true;

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSubmitting).toBe(true);
    });

    it('should update when mutation pending state changes', () => {
      const { result, rerender } = renderHook(
        () => useOptimisticVote('test-session-id'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isSubmitting).toBe(false);

      // Change pending state
      mockMutation.isPending = true;
      rerender();

      expect(result.current.isSubmitting).toBe(true);
    });
  });
});
