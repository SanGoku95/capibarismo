import { Progress } from '@/components/ui/progress';

interface GameHUDProps {
  comparisons: number;
  progressPercent: number;
}

export function GameHUD({ comparisons, progressPercent }: GameHUDProps) {
  return (
    <div className="w-full bg-black/50 border-b border-white/10 p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <span className="text-white font-semibold">
          Comparaciones: {comparisons}
        </span>
        
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-sm">
              Progreso: {progressPercent}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>
    </div>
  );
}
