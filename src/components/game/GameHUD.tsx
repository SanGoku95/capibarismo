import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { resetSession } from '@/hooks/useGameAPI';

interface GameHUDProps {
  comparisons: number;
  progressPercent: number;
}

export function GameHUD({ comparisons, progressPercent }: GameHUDProps) {
  const queryClient = useQueryClient();
  
  const handleNewGame = () => {
    // Reset session and clear all cached data
    resetSession();
    
    // Clear all queries related to the old session
    queryClient.clear();
    
    // Force full page reload to reset all state
    window.location.reload();
  };
  
  return (
    <div className="w-full bg-black/50 border-b border-white/10 p-2 sm:p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:gap-6">
        <span className="text-white font-semibold text-sm sm:text-base">
          Comparaciones: {comparisons}
        </span>
        
        <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-xs sm:text-sm">
              Progreso: {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5 sm:h-2" />
        </div>
        
        <Button
          onClick={handleNewGame}
          variant="outline"
          size="sm"
          className="gap-2 text-xs sm:text-sm h-8 sm:h-9"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Nueva Partida</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>
    </div>
  );
}
