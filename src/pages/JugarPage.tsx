import { useEffect } from 'react';
import { VSScreen } from '@/components/game/VSScreen';
import { GameHUD } from '@/components/game/GameHUD';
import { CandidateInfoOverlay } from '@/components/game/CandidateInfoOverlay';
import { CompletionModal } from '@/components/game/CompletionModal';
import { OnboardingModal } from '@/components/game/OnboardingModal';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNextPair, getSessionId } from '@/hooks/useGameAPI';
import { useOptimisticVote } from '@/hooks/useOptimisticVote';
import { useGameCompletion } from '@/hooks/useGameCompletion';
import { useGameKeyboard } from '@/hooks/useGameKeyboard';
import { Button } from '@/components/ui/button';
import { COMPLETION_GOAL } from '@/lib/gameConstants';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import { useTrackJugarView } from '@/lib/posthog';

export function JugarPage() {
  const sessionId = getSessionId();

  const {
    closeCandidateInfo,
    setReducedMotion,
    completionModalOpen,
  } = useGameUIStore();

  const {
    data: pair,
    isLoading: pairLoading,
    isFetching: pairFetching,
    error: pairError
  } = useNextPair();

  const { voteCount, handleVote, isSubmitting } = useOptimisticVote(sessionId);

  useTrackJugarView({ sessionId });

  // Handle game completion modal (now handles both tiers)
  useGameCompletion(voteCount);

  // Handle keyboard controls - disable when modal is open
  useGameKeyboard({
    onVoteA: () => pair && !completionModalOpen && handleVote(pair, 'A'),
    onVoteB: () => pair && !completionModalOpen && handleVote(pair, 'B'),
    onEscape: closeCandidateInfo,
    enabled: !!pair && !completionModalOpen,
  });

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);

  // Initial load spinner
  if (pairLoading) {
    return (
      <div className="min-h-screen fighting-game-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (pairError || !pair) {
    return (
      <div className="min-h-screen fighting-game-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-sm sm:text-base text-white/80 mb-4">
            {pairError
              ? `Error al cargar el juego: ${pairError instanceof Error ? pairError.message : 'Error desconocido'}`
              : 'No hay pares disponibles. Por favor intenta de nuevo.'}
          </p>
          {pairError && (
            <p className="text-white/60 text-xs sm:text-sm mb-4">
              Session ID: {sessionId}
            </p>
          )}
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while submitting vote OR fetching next pair (refetch)
  const isLoadingNext = isSubmitting || pairFetching;

  return (
    <div className="min-h-screen fighting-game-bg flex flex-col">
      {/* HUD - now calculates its own progress based on comparisons */}
      <GameHUD comparisons={voteCount} />

      {/* Main game area */}
      <div className="flex-1 relative overflow-hidden">
        <VSScreen
          pair={pair}
          onVote={(winner) => !completionModalOpen && handleVote(pair, winner)}
          isSubmitting={isLoadingNext || completionModalOpen}
        />
      </div>

      {/* Overlays */}
      <CandidateInfoOverlay />
      <CompletionModal />
      <OnboardingModal />
    </div>
  );
}
