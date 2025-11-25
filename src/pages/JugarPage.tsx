import { useEffect, useCallback, useState } from 'react';
import { VSScreen } from '@/components/game/VSScreen';
import { GameHUD } from '@/components/game/GameHUD';
import { CandidateInfoOverlay } from '@/components/game/CandidateInfoOverlay';
import { CompletionModal } from '@/components/game/CompletionModal';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNextPair, useSubmitVote, getSessionId } from '@/hooks/useGameAPI';
import { Button } from '@/components/ui/button';
import { Keyboard, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const COMPLETION_GOAL = 20;

export function JugarPage() {
  const sessionId = getSessionId();
  const localVotesStorageKey = `local-vote-count-${sessionId}`;
  const [localVoteCount, setLocalVoteCount] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = Number(localStorage.getItem(localVotesStorageKey));
    return Number.isFinite(stored) ? stored : 0;
  });
  const completionShownKey = `completion-shown-${sessionId}`;
  
  const { 
    closeCandidateInfo,
    retroEffects, 
    toggleRetroEffects,
    setReducedMotion,
    openCompletionModal,
  } = useGameUIStore();
  
  const { 
    data: pair, 
    isLoading: pairLoading, 
    isFetching: pairFetching,
    error: pairError 
  } = useNextPair();
  const submitVoteMutation = useSubmitVote(sessionId);
  
  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);
  
  // Check if ready for completion
  useEffect(() => {
    if (localVoteCount < COMPLETION_GOAL) return;
    if (!sessionStorage.getItem(completionShownKey)) {
      openCompletionModal();
      sessionStorage.setItem(completionShownKey, 'true');
    }
  }, [localVoteCount, completionShownKey, openCompletionModal]);
  
  // Handle vote with optimistic updates
  const handleVote = useCallback(
    (winner: 'A' | 'B') => {
      if (!pair) return;
      if (submitVoteMutation.isPending) return; // prevent double votes for same pair

      const wasAtGoal = localVoteCount >= COMPLETION_GOAL;

      // Optimistic update - increment immediately
      setLocalVoteCount((prev) => {
        const next = prev + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem(localVotesStorageKey, String(next));
        }
        return next;
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
            setLocalVoteCount((prev) => {
              const next = Math.max(0, prev - 1);
              if (typeof window !== 'undefined') {
                localStorage.setItem(localVotesStorageKey, String(next));
              }
              return next;
            });

            // Roll back completion flag if we had just crossed the threshold
            if (!wasAtGoal && typeof window !== 'undefined') {
              sessionStorage.removeItem(completionShownKey);
            }

            console.error('Failed to submit vote:', error);
            toast.error(
              error instanceof Error ? error.message : 'Error al enviar voto'
            );
          },
        }
      );
    },
    [pair, submitVoteMutation, sessionId, localVotesStorageKey, localVoteCount, completionShownKey]
  );
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if overlay is open
      if (document.querySelector('[role="dialog"]')) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (pair) handleVote('A');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (pair) handleVote('B');
          break;
        case 'Escape':
          closeCandidateInfo();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pair, handleVote, closeCandidateInfo]);
  
  // Initial load spinner
  if (pairLoading) {
    return (
      <div className="min-h-screen fighting-game-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (pairError || !pair) {
    return (
      <div className="min-h-screen fighting-game-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/80 mb-4">
            {pairError 
              ? `Error al cargar el juego: ${pairError instanceof Error ? pairError.message : 'Error desconocido'}` 
              : 'No hay pares disponibles. Por favor intenta de nuevo.'}
          </p>
          {pairError && (
            <p className="text-white/60 text-sm mb-4">
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
  
  const localProgressPercent = Math.min(
    100,
    Math.round((localVoteCount / COMPLETION_GOAL) * 100)
  );

  // Show loading while submitting vote OR fetching next pair (refetch)
  const isLoadingNext = submitVoteMutation.isPending || pairFetching;

  return (
    <div className="min-h-screen fighting-game-bg flex flex-col">
      {/* HUD */}
      <GameHUD
        comparisons={localVoteCount}
        progressPercent={localProgressPercent}
      />
      
      {/* Main game area */}
      <div className="flex-1 relative">
        <VSScreen
          pair={pair}
          onVote={handleVote}
          isSubmitting={isLoadingNext}
        />
      </div>
      
      {/* Controls footer */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-white/10 p-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">← / → para elegir</span>
            <span className="sm:hidden">← / →</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRetroEffects}
            className="text-white/70 hover:text-white"
          >
            {retroEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="ml-2 hidden sm:inline">Efectos retro</span>
          </Button>
        </div>
      </div>
      
      {/* Overlays */}
      <CandidateInfoOverlay />
      <CompletionModal onContinue={() => {/* Continue playing */}} />
    </div>
  );
}
