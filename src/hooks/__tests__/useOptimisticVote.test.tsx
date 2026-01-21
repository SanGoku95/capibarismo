import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
    updateLocalRatings: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@/lib/posthog', () => ({
  usePostHog: vi.fn(() => ({
    capture: vi.fn(),
  })),
  captureDeferred: vi.fn(),
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
    vi.mocked(sessionService.updateLocalRatings).mockImplementation(() => {});

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

  const mockPair = {
    pairId: 'candidate-a-candidate-b',
    a: { id: 'candidate-a', nombre: 'Candidate A' },
    b: { id: 'candidate-b', nombre: 'Candidate B' },
  };

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

      act(() => {
        result.current.handleVote(mockPair as any, 'A');
      });

      expect(sessionService.incrementVoteCount).toHaveBeenCalled();
      expect(result.current.voteCount).toBe(1);
    });

    it('should update local Elo ratings', () => {
      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleVote(mockPair as any, 'A');
      });

      expect(sessionService.updateLocalRatings).toHaveBeenCalledWith('candidate-a', 'candidate-b');
    });

    it('should call submitVote mutation with correct data', () => {
      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleVote(mockPair as any, 'A');
      });

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: 'test-session-id',
          aId: 'candidate-a',
          bId: 'candidate-b',
          outcome: 'A',
        }),
        expect.any(Object)
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
      vi.mocked(useSubmitVote).mockReturnValue(mockMutation as any);

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleVote(mockPair as any, 'A');
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling and Rollback', () => {
    it('should rollback optimistic update on error', async () => {
      let onErrorCallback: ((error: Error) => void) | undefined;

      mockMutate.mockImplementation((data: any, options: any) => {
        onErrorCallback = options.onError;
      });

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleVote(mockPair as any, 'A');
      });

      // Simulate error
      act(() => {
        onErrorCallback?.(new Error('Network error'));
      });

      expect(sessionService.decrementVoteCount).toHaveBeenCalled();
    });

    it('should show error toast on submission failure', async () => {
      let onErrorCallback: ((error: Error) => void) | undefined;

      mockMutate.mockImplementation((data: any, options: any) => {
        onErrorCallback = options.onError;
      });

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleVote(mockPair as any, 'A');
      });

      act(() => {
        onErrorCallback?.(new Error('Network error'));
      });

      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('isPending State', () => {
    it('should reflect mutation pending state', () => {
      mockMutation.isPending = true;
      vi.mocked(useSubmitVote).mockReturnValue(mockMutation as any);

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSubmitting).toBe(true);
    });

    it('should be false when mutation is not pending', () => {
      mockMutation.isPending = false;
      vi.mocked(useSubmitVote).mockReturnValue(mockMutation as any);

      const { result } = renderHook(() => useOptimisticVote('test-session-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
