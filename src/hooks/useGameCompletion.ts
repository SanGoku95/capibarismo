/**
 * Hook for managing game completion modal logic.
 * 
 * Shows completion modals at two milestones:
 * - Preliminary (15 votes): Quick preview of preferences
 * - Recommended (30 votes): Statistically reliable ranking
 */

import { useEffect } from 'react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { sessionService, type CompletionTier } from '@/services/sessionService';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';
import { usePostHog } from '@/lib/posthog';

// =============================================================================
// Types
// =============================================================================

interface CompletionState {
  currentTier: CompletionTier;
  tierShown: CompletionTier;
}

// =============================================================================
// Hook
// =============================================================================

export function useGameCompletion(voteCount: number): void {
  const { openCompletionModal, closeCompletionModal, completionModalOpen } = useGameUIStore();
  const posthog = usePostHog();

  useEffect(() => {
    const state = getCompletionState(voteCount);
    
    // Close modal if user hasn't reached any goal
    if (state.currentTier === 'none') {
      if (completionModalOpen) closeCompletionModal();
      return;
    }

    // Show appropriate modal based on progression
    const tierToShow = getTierToShow(state);
    
    if (tierToShow) {
      trackCompletion(posthog, tierToShow, voteCount);
      openCompletionModal(tierToShow);
      sessionService.markCompletionTierShown(tierToShow);
    }
  }, [voteCount, openCompletionModal, closeCompletionModal, completionModalOpen, posthog]);
}

// =============================================================================
// Helper Functions
// =============================================================================

function getCompletionState(voteCount: number): CompletionState {
  return {
    currentTier: calculateCurrentTier(voteCount),
    tierShown: sessionService.getCompletionTierShown(),
  };
}

function calculateCurrentTier(voteCount: number): CompletionTier {
  if (voteCount >= RECOMMENDED_GOAL) return 'recommended';
  if (voteCount >= PRELIMINARY_GOAL) return 'preliminary';
  return 'none';
}

function getTierToShow(state: CompletionState): CompletionTier | null {
  const { currentTier, tierShown } = state;

  // Show preliminary if just reached and not yet shown
  if (currentTier === 'preliminary' && tierShown === 'none') {
    return 'preliminary';
  }

  // Show recommended if reached and not yet shown
  if (currentTier === 'recommended' && tierShown !== 'recommended') {
    return 'recommended';
  }

  return null;
}

function trackCompletion(
  posthog: ReturnType<typeof usePostHog>,
  tier: CompletionTier,
  voteCount: number
): void {
  const eventName = tier === 'preliminary' 
    ? 'game_preliminary_completed' 
    : 'game_completed';

  posthog?.capture(eventName, {
    sessionId: sessionService.getSessionId(),
    totalVotes: voteCount,
  });
}
