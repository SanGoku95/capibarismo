/**
 * Hook for managing game completion modal logic.
 * Handles showing the completion modal at two tiers:
 * - Preliminary (15 votes): Quick ranking preview
 * - Recommended (30 votes): Full reliable ranking
 */

import { useEffect } from 'react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { sessionService, type CompletionTier } from '@/services/sessionService';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';
import { usePostHog } from '@/lib/posthog';

export function useGameCompletion(voteCount: number) {
  const { openCompletionModal, closeCompletionModal, completionModalOpen } = useGameUIStore();
  const posthog = usePostHog();

  useEffect(() => {
    const tierShown = sessionService.getCompletionTierShown();

    // Determine which tier user has reached
    const currentTier: CompletionTier = 
      voteCount >= RECOMMENDED_GOAL ? 'recommended' :
      voteCount >= PRELIMINARY_GOAL ? 'preliminary' : 
      'none';

    // If user hasn't reached any goal, ensure modal is closed
    if (currentTier === 'none') {
      if (completionModalOpen) {
        closeCompletionModal();
      }
      return;
    }

    // Check if we should show a modal based on tier progression
    const shouldShowPreliminary = currentTier === 'preliminary' && tierShown === 'none';
    const shouldShowRecommended = currentTier === 'recommended' && tierShown !== 'recommended';

    if (shouldShowPreliminary) {
      // Track preliminary completion
      posthog?.capture('game_preliminary_completed', {
        sessionId: sessionService.getSessionId(),
        totalVotes: voteCount,
      });

      openCompletionModal('preliminary');
      sessionService.markCompletionTierShown('preliminary');
    } else if (shouldShowRecommended) {
      // Track full completion
      posthog?.capture('game_completed', {
        sessionId: sessionService.getSessionId(),
        totalVotes: voteCount,
      });

      openCompletionModal('recommended');
      sessionService.markCompletionTierShown('recommended');
    }
  }, [voteCount, openCompletionModal, closeCompletionModal, completionModalOpen, posthog]);
}
