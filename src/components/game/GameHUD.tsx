import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { resetSession } from '@/hooks/useGameAPI';
import { useNavigate } from 'react-router-dom';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';

// =============================================================================
// Types
// =============================================================================

interface GameHUDProps {
  comparisons: number;
}

interface ProgressState {
  isPastPreliminary: boolean;
  isComplete: boolean;
  percent: number;
  label: string;
}

// =============================================================================
// Progress Calculation
// =============================================================================

function calculateProgressState(comparisons: number): ProgressState {
  const isPastPreliminary = comparisons >= PRELIMINARY_GOAL;
  const isComplete = comparisons >= RECOMMENDED_GOAL;

  const percent = isPastPreliminary
    ? calculatePhase2Progress(comparisons)
    : calculatePhase1Progress(comparisons);

  const label = getProgressLabel(comparisons, isPastPreliminary, isComplete);

  return { isPastPreliminary, isComplete, percent, label };
}

function calculatePhase1Progress(comparisons: number): number {
  return Math.min(100, Math.round((comparisons / PRELIMINARY_GOAL) * 100));
}

function calculatePhase2Progress(comparisons: number): number {
  const phase2Progress = comparisons - PRELIMINARY_GOAL;
  const phase2Total = RECOMMENDED_GOAL - PRELIMINARY_GOAL;
  return Math.min(100, Math.round((phase2Progress / phase2Total) * 100));
}

function getProgressLabel(
  comparisons: number, 
  isPastPreliminary: boolean, 
  isComplete: boolean
): string {
  if (isComplete) {
    return '¡Ranking completo! 🏆';
  }
  if (isPastPreliminary) {
    return `${comparisons}/${RECOMMENDED_GOAL} - ¡Mejorando precisión!`;
  }
  return `${comparisons}/${PRELIMINARY_GOAL} - Descubre tus preferencias`;
}

// =============================================================================
// Component
// =============================================================================

export function GameHUD({ comparisons }: GameHUDProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const progress = calculateProgressState(comparisons);

  const handleNewGame = () => {
    resetSession();
    queryClient.clear();
    navigate('/jugar');
    // Force reload to ensure clean state
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4">
        {/* Top row: Counter + New Game Button */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold text-sm sm:text-base">
            Comparaciones: {comparisons}
          </span>
          
          <Button
            onClick={handleNewGame}
            variant="outline"
            size="sm"
            className="gap-2 text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 border-white/20 hover:bg-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Nueva Partida</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </div>

        {/* Bottom row: Progress bar */}
        <div className="w-full">
          <p className="text-white/80 text-xs sm:text-sm mb-2">
            {progress.label}
          </p>
          
          <div className="relative">
            <Progress value={progress.percent} className="h-2 sm:h-2.5" />
            
            {progress.isPastPreliminary && !progress.isComplete}
          </div>
        </div>
      </div>
    </div>
  );
}

