import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { resetSession } from '@/hooks/useGameAPI';
import { useNavigate } from 'react-router-dom';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';

interface GameHUDProps {
  comparisons: number;
}

export function GameHUD({ comparisons }: GameHUDProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Determine which phase the user is in
  const isPastPreliminary = comparisons >= PRELIMINARY_GOAL;
  
  // Calculate progress percentage based on current phase
  const progressPercent = isPastPreliminary
    ? Math.min(100, Math.round(((comparisons - PRELIMINARY_GOAL) / (RECOMMENDED_GOAL - PRELIMINARY_GOAL)) * 100))
    : Math.min(100, Math.round((comparisons / PRELIMINARY_GOAL) * 100));
  
  // Motivational labels
  const getProgressLabel = () => {
    if (comparisons >= RECOMMENDED_GOAL) {
      return '¡Ranking completo! 🏆';
    }
    if (isPastPreliminary) {
      return `${comparisons}/${RECOMMENDED_GOAL} - ¡Mejorando precisión!`;
    }
    return `${comparisons}/${PRELIMINARY_GOAL} - Descubre tus preferencias`;
  };
  
  const handleNewGame = () => {
    // Reset session and clear all cached data
    resetSession();
    
    // Clear all queries related to the old session
    queryClient.clear();
    
    // Force full page reload to reset all state
    navigate('/jugar');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <div className="w-full bg-black/50 border-b border-white/10 p-2 sm:p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:gap-6">
        <span className="text-white font-semibold text-sm sm:text-base whitespace-nowrap">
          Comparaciones: {comparisons}
        </span>
        
        <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-xs sm:text-sm">
              {getProgressLabel()}
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={progressPercent} 
              className="h-1.5 sm:h-2" 
            />
            {/* Show phase indicator when in second phase */}
            {isPastPreliminary && comparisons < RECOMMENDED_GOAL && (
              <div className="absolute -top-0.5 left-0 w-full flex justify-between text-[8px] sm:text-[10px] text-white/50">
                <span>{PRELIMINARY_GOAL}</span>
                <span>{RECOMMENDED_GOAL}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleNewGame}
          variant="outline"
          size="sm"
          className="gap-2 text-xs sm:text-sm h-8 sm:h-9"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Nueva Partida</span>
        </Button>
      </div>
    </div>
  );
}
