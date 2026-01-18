/**
 * Hook for managing game completion modal logic.
 * Handles showing the completion modal when the user reaches the completion goal.
 */

import { useEffect } from 'react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { sessionService } from '@/services/sessionService';
import { COMPLETION_GOAL } from '@/lib/gameConstants';
import { usePostHog } from '@/lib/posthog';

export function useGameCompletion(voteCount: number) {
  const { openCompletionModal, closeCompletionModal, completionModalOpen } = useGameUIStore();
  const posthog = usePostHog();

  useEffect(() => {
    // If user hasn't reached the goal, ensure modal is closed
    if (voteCount < COMPLETION_GOAL) {
      if (completionModalOpen) {
        closeCompletionModal();
      }
      return;
    }

    // Don't show modal if already shown in this session
    if (sessionService.isCompletionShown()) return;

    // Track game completion
    posthog?.capture('game_completed', {
      sessionId: sessionService.getSessionId(),
      totalVotes: voteCount,
    });

    // Show modal and mark as shown
    openCompletionModal();
    sessionService.markCompletionAsShown();
  }, [voteCount, openCompletionModal, closeCompletionModal, completionModalOpen, posthog]);
}
