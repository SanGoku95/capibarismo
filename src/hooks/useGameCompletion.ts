/**
 * Hook for managing game completion modal logic.
 * Handles showing the completion modal when the user reaches the completion goal.
 */

import { useEffect } from 'react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { sessionService } from '@/services/sessionService';
import { COMPLETION_GOAL } from '@/lib/gameConstants';

export function useGameCompletion(voteCount: number) {
  const { openCompletionModal } = useGameUIStore();

  useEffect(() => {
    // Don't show modal if user hasn't reached the goal
    if (voteCount < COMPLETION_GOAL) return;

    // Don't show modal if already shown in this session
    if (sessionService.isCompletionShown()) return;

    // Show modal and mark as shown
    openCompletionModal();
    sessionService.markCompletionAsShown();
  }, [voteCount, openCompletionModal]);
}
