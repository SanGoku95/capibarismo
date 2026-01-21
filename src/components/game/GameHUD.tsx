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
    <div className="w-full bg-black/50 border-b border-white/10 p-2 sm:p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:gap-6">
        
        {/* Comparison Counter */}
        <span className="text-white font-semibold text-sm sm:text-base whitespace-nowrap">
          Comparaciones: {comparisons}
        </span>

        {/* Progress Section */}
        <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-xs sm:text-sm">
              {progress.label}
            </span>
          </div>
          
          <div className="relative">
            <Progress value={progress.percent} className="h-1.5 sm:h-2" />
            
            {/* Phase indicator for second phase */}
            {progress.isPastPreliminary && !progress.isComplete && (
              <PhaseIndicator />
            )}
          </div>
        </div>

        {/* New Game Button */}
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

function PhaseIndicator() {
  return (
    <div className="absolute -top-0.5 left-0 w-full flex justify-between text-[8px] sm:text-[10px] text-white/50">
      <span>{PRELIMINARY_GOAL}</span>
      <span>{RECOMMENDED_GOAL}</span>
    </div>
  );
}
