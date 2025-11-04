import { useEffect, useCallback, useState } from 'react';
import { VSScreen } from '@/components/game/VSScreen';
import { GameHUD } from '@/components/game/GameHUD';
import { CandidateInfoOverlay } from '@/components/game/CandidateInfoOverlay';
import { CompletionModal } from '@/components/game/CompletionModal';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNextPair, useGameState, useSubmitVote, getSessionId, prefetchNextPair } from '@/hooks/useGameAPI';
import { Button } from '@/components/ui/button';
import { Keyboard, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

export function JugarPage() {
  const [isVoting, setIsVoting] = useState(false);
  const sessionId = getSessionId();
  
  const { 
    closeCandidateInfo,
    retroEffects, 
    toggleRetroEffects,
    setReducedMotion,
    openCompletionModal,
  } = useGameUIStore();
  
  const { data: pair, isLoading: pairLoading, error: pairError } = useNextPair();
  const { data: gameState, refetch: refetchGameState } = useGameState();
  const submitVoteMutation = useSubmitVote();
  
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
    if (gameState && gameState.progressPercent >= 100) {
      // Only show once per session
      const shownKey = `completion-shown-${sessionId}`;
      if (!sessionStorage.getItem(shownKey)) {
        openCompletionModal();
        sessionStorage.setItem(shownKey, 'true');
      }
    }
  }, [gameState, sessionId, openCompletionModal]);
  
  // Prefetch next pair
  useEffect(() => {
    if (pair) {
      prefetchNextPair(pair);
    }
  }, [pair]);
  
  // Handle vote
  const handleVote = useCallback(async (winner: 'A' | 'B') => {
    if (!pair || isVoting) return;
    
    setIsVoting(true);
    
    try {
      await submitVoteMutation.mutateAsync({
        sessionId,
        pairId: pair.pairId,
        aId: pair.a.id,
        bId: pair.b.id,
        outcome: winner,
      });
      
      // Refetch game state after vote
      await refetchGameState();
    } catch (error) {
      console.error('Failed to submit vote:', error);
      toast.error(error instanceof Error ? error.message : 'Error al enviar voto');
    } finally {
      setIsVoting(false);
    }
  }, [pair, isVoting, submitVoteMutation, sessionId, refetchGameState]);
  
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
  
  return (
    <div className="min-h-screen fighting-game-bg flex flex-col">
      {/* HUD */}
      <GameHUD
        comparisons={gameState?.comparisons || 0}
        progressPercent={gameState?.progressPercent || 0}
        topN={gameState?.topN}
      />
      
      {/* Main game area */}
      <div className="flex-1 relative">
        <VSScreen
          pair={pair}
          onVote={handleVote}
          isSubmitting={isVoting}
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
