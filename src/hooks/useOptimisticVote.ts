/**
 * Hook for handling vote submission with optimistic updates and rollback.
 * Manages vote count locally and syncs with the server.
 */

import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSubmitVote } from './useGameAPI';
import { sessionService } from '@/services/sessionService';
import { usePostHog } from '@/lib/posthog';
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

      // Optimistic update - increment immediately
      const previousCount = localVoteCount;
      const nextCount = sessionService.incrementVoteCount();
      setLocalVoteCount(nextCount);

      // Track every vote with vote count
      posthog?.capture('game_vote', {
        sessionId,
        pairId: pair.pairId,
        winnerId: winner === 'A' ? pair.a.id : pair.b.id,
        loserId: winner === 'A' ? pair.b.id : pair.a.id,
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
