import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameCompletion } from '../useGameCompletion';
import { useGameUIStore } from '@/store/useGameUIStore';
import { sessionService } from '@/services/sessionService';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';

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
    getCompletionTierShown: vi.fn(() => 'none'),
    markCompletionTierShown: vi.fn(),
    getSessionId: vi.fn(() => 'test-session-id'),
    // Legacy compatibility
    isCompletionShown: vi.fn(() => false),
    markCompletionAsShown: vi.fn(),
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

    vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('none');
    vi.mocked(sessionService.getSessionId).mockReturnValue('test-session-id');
  });

  describe('Preliminary Goal (15 votes)', () => {
    it('should not show modal when vote count is below preliminary goal', () => {
      renderHook(() => useGameCompletion(PRELIMINARY_GOAL - 1));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
      expect(sessionService.markCompletionTierShown).not.toHaveBeenCalled();
    });

    it('should show preliminary modal when vote count reaches preliminary goal', () => {
      renderHook(() => useGameCompletion(PRELIMINARY_GOAL));

      expect(mockOpenCompletionModal).toHaveBeenCalledWith('preliminary');
      expect(sessionService.markCompletionTierShown).toHaveBeenCalledWith('preliminary');
    });

    it('should not show modal at 0 votes', () => {
      renderHook(() => useGameCompletion(0));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });

    it('should work with PRELIMINARY_GOAL of 15', () => {
      expect(PRELIMINARY_GOAL).toBe(15);

      renderHook(() => useGameCompletion(14));
      expect(mockOpenCompletionModal).not.toHaveBeenCalled();

      vi.clearAllMocks();
      renderHook(() => useGameCompletion(15));
      expect(mockOpenCompletionModal).toHaveBeenCalledWith('preliminary');
    });
  });

  describe('Recommended Goal (30 votes)', () => {
    it('should show recommended modal when vote count reaches recommended goal', () => {
      vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('preliminary');

      renderHook(() => useGameCompletion(RECOMMENDED_GOAL));

      expect(mockOpenCompletionModal).toHaveBeenCalledWith('recommended');
      expect(sessionService.markCompletionTierShown).toHaveBeenCalledWith('recommended');
    });

    it('should show recommended modal when vote count exceeds recommended goal', () => {
      vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('preliminary');

      renderHook(() => useGameCompletion(RECOMMENDED_GOAL + 5));

      expect(mockOpenCompletionModal).toHaveBeenCalledWith('recommended');
    });

    it('should work with RECOMMENDED_GOAL of 30', () => {
      expect(RECOMMENDED_GOAL).toBe(30);
    });
  });

  describe('Tier Progression Logic', () => {
    it('should not show preliminary modal if already shown', () => {
      vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('preliminary');

      renderHook(() => useGameCompletion(PRELIMINARY_GOAL));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });

    it('should not show recommended modal if already shown', () => {
      vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('recommended');

      renderHook(() => useGameCompletion(RECOMMENDED_GOAL));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });

    it('should show recommended even if preliminary was skipped', () => {
      // User jumped from 0 to 30 votes (skipped preliminary)
      vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('none');

      renderHook(() => useGameCompletion(RECOMMENDED_GOAL));

      // Should show recommended directly
      expect(mockOpenCompletionModal).toHaveBeenCalledWith('recommended');
    });
  });

  describe('Modal Close Behavior', () => {
    it('should close modal if vote count drops below preliminary goal', () => {
      vi.mocked(useGameUIStore).mockReturnValue({
        openCompletionModal: mockOpenCompletionModal,
        closeCompletionModal: mockCloseCompletionModal,
        completionModalOpen: true,
      } as any);

      renderHook(() => useGameCompletion(PRELIMINARY_GOAL - 5));

      expect(mockCloseCompletionModal).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative vote count', () => {
      renderHook(() => useGameCompletion(-5));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });

    it('should handle very large vote count', () => {
      vi.mocked(sessionService.getCompletionTierShown).mockReturnValue('none');

      renderHook(() => useGameCompletion(1000));

      expect(mockOpenCompletionModal).toHaveBeenCalledWith('recommended');
    });

    it('should handle exactly PRELIMINARY_GOAL', () => {
      renderHook(() => useGameCompletion(PRELIMINARY_GOAL));

      expect(mockOpenCompletionModal).toHaveBeenCalledWith('preliminary');
    });

    it('should handle floating point vote count', () => {
      renderHook(() => useGameCompletion(14.9));

      expect(mockOpenCompletionModal).not.toHaveBeenCalled();
    });
  });
});
