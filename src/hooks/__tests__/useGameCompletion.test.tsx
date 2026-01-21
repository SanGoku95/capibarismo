import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameCompletion } from '../useGameCompletion';
import { useGameUIStore } from '@/store/useGameUIStore';
import { sessionService } from '@/services/sessionService';
import { COMPLETION_GOAL } from '@/lib/gameConstants';

// Mock PostHog BEFORE other mocks to prevent real initialization
vi.mock('@/lib/posthog', () => ({
  usePostHog: vi.fn(() => ({
    capture: vi.fn(),
  })),
  captureDeferred: vi.fn(),
}));

// Mock dependencies
vi.mock('@/store/useGameUIStore', () => ({
  useGameUIStore: vi.fn(() => ({
    openCompletionModal: vi.fn(),
    closeCompletionModal: vi.fn(),
    completionModalOpen: false,
  })),
}));

vi.mock('@/services/sessionService', () => ({
  sessionService: {
    isCompletionShown: vi.fn(() => false),
    markCompletionAsShown: vi.fn(),
    getSessionId: vi.fn(() => 'test-session-id'),
  },
}));

describe('useGameCompletion', () => {
  let mockOpenCompletionModal: ReturnType<typeof vi.fn>;
  let mockCloseCompletionModal: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockOpenCompletionModal = vi.fn();
    mockCloseCompletionModal = vi.fn();
    vi.mocked(useGameUIStore).mockReturnValue({
      openCompletionModal: mockOpenCompletionModal,
      closeCompletionModal: mockCloseCompletionModal,
      completionModalOpen: false,
    } as any);

    vi.mocked(sessionService.isCompletionShown).mockReturnValue(false);
    vi.mocked(sessionService.getSessionId).mockReturnValue('test-session-id');
  });

  describe('Completion Goal', () => {
    it('should not show modal when vote count is below goal', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL - 1));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
      expect(sessionService.markCompletionAsShown).not.toHaveBeenCalled();
    });

    it('should show modal when vote count reaches goal', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL));

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
      expect(sessionService.markCompletionAsShown).toHaveBeenCalledTimes(1);
    });

    it('should show modal when vote count exceeds goal', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL + 5));

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
      expect(sessionService.markCompletionAsShown).toHaveBeenCalledTimes(1);
    });

    it('should not show modal at 0 votes', () => {
      renderHook(() => useGameCompletion(0));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });

    it('should work with COMPLETION_GOAL of 15', () => {
      expect(COMPLETION_GOAL).toBe(15);

      renderHook(() => useGameCompletion(14));
      expect(mockOpenCompletionModal).not.toHaveBeenCalled();

      renderHook(() => useGameCompletion(15));
      expect(mockOpenCompletionModal).toHaveBeenCalled();
    });
  });

  describe('One-Time Display Logic', () => {
    it('should not show modal if already shown in session', () => {
      vi.mocked(sessionService.isCompletionShown).mockReturnValue(true);

      renderHook(() => useGameCompletion(COMPLETION_GOAL));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
      expect(sessionService.markCompletionAsShown).not.toHaveBeenCalled();
    });

    it('should check completion status before showing modal', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL));

      expect(sessionService.isCompletionShown).toHaveBeenCalled();
    });

    it('should not show modal multiple times as vote count increases', () => {
      vi.mocked(sessionService.isCompletionShown).mockReturnValue(false);

      const { rerender } = renderHook(
        ({ voteCount }) => useGameCompletion(voteCount),
        { initialProps: { voteCount: COMPLETION_GOAL - 1 } }
      );

      // First update: reach goal
      rerender({ voteCount: COMPLETION_GOAL });
      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);

      // Mark as shown
      vi.mocked(sessionService.isCompletionShown).mockReturnValue(true);

      // Further updates: should not show again
      rerender({ voteCount: COMPLETION_GOAL + 1 });
      rerender({ voteCount: COMPLETION_GOAL + 2 });
      rerender({ voteCount: COMPLETION_GOAL + 10 });

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('Vote Count Changes', () => {
    it('should respond to vote count updates', () => {
      const { rerender } = renderHook(
        ({ voteCount }) => useGameCompletion(voteCount),
        { initialProps: { voteCount: 0 } }
      );

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();

      // Increment gradually
      for (let i = 1; i < COMPLETION_GOAL; i++) {
        rerender({ voteCount: i });
        expect(mockOpenCompletionModal).not.toHaveBeenCalled();
      }

      // Hit goal
      rerender({ voteCount: COMPLETION_GOAL });
      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
    });

    it('should show modal immediately if starting at or above goal', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL + 20));

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
    });

    it('should not show modal if vote count decreases after reaching goal', () => {
      vi.mocked(sessionService.isCompletionShown).mockReturnValue(true);

      const { rerender } = renderHook(
        ({ voteCount }) => useGameCompletion(voteCount),
        { initialProps: { voteCount: COMPLETION_GOAL + 5 } }
      );

      // Somehow vote count decreases (edge case)
      rerender({ voteCount: COMPLETION_GOAL - 1 });

      // Should not show modal (already shown)
      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });
  });

  describe('Effect Dependencies', () => {
    it('should re-evaluate when voteCount changes', () => {
      const { rerender } = renderHook(
        ({ voteCount }) => useGameCompletion(voteCount),
        { initialProps: { voteCount: 5 } }
      );

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();

      // Vote count changes but doesn't reach goal
      rerender({ voteCount: 6 });
      expect(mockOpenCompletionModal).not.toHaveBeenCalled();

      // Reach goal
      rerender({ voteCount: COMPLETION_GOAL });
      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
    });

    it('should use the correct openCompletionModal callback', () => {
      const firstCallback = vi.fn();
      const secondCallback = vi.fn();

      vi.mocked(useGameUIStore).mockReturnValue({
        openCompletionModal: firstCallback,
      } as any);

      const { rerender } = renderHook(() => useGameCompletion(COMPLETION_GOAL));

      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).not.toHaveBeenCalled();

      // Update the store mock
      vi.mocked(useGameUIStore).mockReturnValue({
        openCompletionModal: secondCallback,
      } as any);

      // Mark as not shown for test purposes
      vi.mocked(sessionService.isCompletionShown).mockReturnValue(false);

      rerender();

      // The new callback should be used
      expect(secondCallback).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative vote count', () => {
      renderHook(() => useGameCompletion(-1));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });

    it('should handle very large vote count', () => {
      renderHook(() => useGameCompletion(999999));

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
    });

    it('should handle exactly COMPLETION_GOAL', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL));

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
      expect(sessionService.markCompletionAsShown).toHaveBeenCalledTimes(1);
    });

    it('should handle floating point vote count', () => {
      renderHook(() => useGameCompletion(COMPLETION_GOAL + 0.5));

      expect(mockOpenCompletionModal).toHaveBeenCalledTimes(1);
    });
  });
});
