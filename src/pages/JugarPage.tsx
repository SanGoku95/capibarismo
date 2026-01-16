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
import { Keyboard } from 'lucide-react';
import { COMPLETION_GOAL } from '@/lib/gameConstants';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import { usePostHog, trackJugarView } from '@/lib/posthog';

export function JugarPage() {
  const sessionId = getSessionId();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const {
    closeCandidateInfo,
    setReducedMotion,
  } = useGameUIStore();

  const {
    data: pair,
    isLoading: pairLoading,
    isFetching: pairFetching,
    error: pairError
  } = useNextPair();

  const { voteCount, handleVote, isSubmitting } = useOptimisticVote(sessionId);

  useEffect(() => {
    trackJugarView(posthog, { sessionId });
  }, [sessionId, posthog]);

  // Redirect to ranking if game was already completed AND modal was already shown
  // This handles the case when user navigates back to /jugar after completing the game
  useEffect(() => {
    if (voteCount >= COMPLETION_GOAL && sessionService.isCompletionShown()) {
      navigate(`/ranking?mode=personal&sessionId=${sessionId}`);
    }
  }, [voteCount, sessionId, navigate]);

  // Handle game completion modal
  useGameCompletion(voteCount);

  // Handle keyboard controls
  const isGameCompleted = voteCount >= COMPLETION_GOAL;
  useGameKeyboard({
    onVoteA: () => pair && !isGameCompleted && handleVote(pair, 'A'),
    onVoteB: () => pair && !isGameCompleted && handleVote(pair, 'B'),
    onEscape: closeCandidateInfo,
    enabled: !!pair && !isGameCompleted,
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

  const progressPercent = Math.min(
    100,
    Math.round((voteCount / COMPLETION_GOAL) * 100)
  );

  // Show loading while submitting vote OR fetching next pair (refetch)
  const isLoadingNext = isSubmitting || pairFetching;

  return (
    <div className="min-h-screen fighting-game-bg flex flex-col">
      {/* HUD */}
      <GameHUD
        comparisons={voteCount}
        progressPercent={progressPercent}
      />

      {/* Main game area */}
      <div className="flex-1 relative overflow-hidden">
        <VSScreen
          pair={pair}
          onVote={(winner) => !isGameCompleted && handleVote(pair, winner)}
          isSubmitting={isLoadingNext || isGameCompleted}
        />
      </div>

      {/* Controls footer - more compact on mobile */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-white/10 p-2 sm:p-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 text-white/70 text-[10px] sm:text-xs md:text-sm">
            <Keyboard className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">← / → para elegir</span>
            <span className="sm:hidden">← / →</span>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <CandidateInfoOverlay />
      <CompletionModal />
      <OnboardingModal />
    </div>
  );
}
