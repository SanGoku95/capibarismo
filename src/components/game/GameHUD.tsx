import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Trophy } from 'lucide-react';

interface GameHUDProps {
  comparisons: number;
  progressPercent: number;
  topN?: Array<{ candidateId: string; name: string; rating: number }>;
}

export function GameHUD({ comparisons, progressPercent, topN }: GameHUDProps) {
  return (
    <div className="w-full bg-black/50 backdrop-blur-sm border-b border-white/10 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          {/* Comparisons count */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold text-sm sm:text-base">
              Comparaciones: <span className="text-yellow-400">{comparisons}</span>
            </span>
          </div>
          
          {/* Progress */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                Progreso de estabilidad: {progressPercent}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          
          {/* Top preview (desktop only) */}
          {topN && topN.length > 0 && (
            <div className="hidden lg:flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="flex gap-1">
                {topN.slice(0, 3).map((entry, idx) => (
                  <Badge
                    key={entry.candidateId}
                    variant={idx === 0 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {idx + 1}. {entry.name.split(' ')[0]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
