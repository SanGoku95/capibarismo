/**
 * Hook for handling vote submission with optimistic updates and rollback.
 * Manages vote count locally and syncs with the server.
 * Also updates local Elo ratings for smart pair selection.
 */

import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSubmitVote } from './useGameAPI';
import { sessionService } from '@/services/sessionService';
import { usePostHog, captureDeferred } from '@/lib/posthog';
import type { Pair } from '../../api/types';

export function useOptimisticVote(sessionId: string) {
  const [localVoteCount, setLocalVoteCount] = useState(() => {
    return sessionService.getVoteCount(sessionId);
  });
  const posthog = usePostHog();

  // Reset vote count when sessionId changes (e.g., after "Nueva Partida")
  useEffect(() => {
    const currentCount = sessionService.getVoteCount(sessionId);
    setLocalVoteCount(currentCount);
  }, [sessionId]);

  const submitVoteMutation = useSubmitVote(sessionId);

  const handleVote = useCallback(
    (pair: Pair | undefined, winner: 'A' | 'B') => {
      if (!pair) return;
      if (submitVoteMutation.isPending) return; // Prevent double votes

      const winnerId = winner === 'A' ? pair.a.id : pair.b.id;
      const loserId = winner === 'A' ? pair.b.id : pair.a.id;

      // Optimistic update - increment immediately
      const previousCount = localVoteCount;
      const nextCount = sessionService.incrementVoteCount();
      setLocalVoteCount(nextCount);

      // Update local Elo ratings for smart pair selection
      sessionService.updateLocalRatings(winnerId, loserId);

      // Track vote - deferred to avoid blocking INP
      // Properties are captured immediately to avoid stale closures
      captureDeferred(posthog, 'game_vote', {
        sessionId,
        pairId: pair.pairId,
        winnerId,
        loserId,
        winner,
        voteNumber: nextCount,
      });

      // Fire mutation without awaiting
      submitVoteMutation.mutate(
        {
          sessionId,
          pairId: pair.pairId,
          aId: pair.a.id,
          bId: pair.b.id,
          outcome: winner,
        },
        {
          onError: (error) => {
            // Roll back optimistic update
            sessionService.decrementVoteCount();
            setLocalVoteCount(previousCount);
            // Note: We don't roll back local ratings as it's too complex
            // and the user will likely vote again anyway

            console.error('Failed to submit vote:', error);
            toast.error(
              error instanceof Error ? error.message : 'Error al enviar voto'
            );
          },
        }
      );
    },
    [sessionId, submitVoteMutation, localVoteCount, posthog]
  );

  return {
    voteCount: localVoteCount,
    handleVote,
    isSubmitting: submitVoteMutation.isPending,
  };
}
