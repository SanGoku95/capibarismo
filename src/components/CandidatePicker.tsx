import { motion } from 'framer-motion';
import { candidates } from '@/data/candidates';
import { useCompareStore } from '@/store/useCompareStore';
import { cn } from '@/lib/utils';

export function CandidatePicker() {
  const { leftCandidate, rightCandidate, selectCandidate } = useCompareStore();

  const isSelected = (candidateId: string) => {
    return leftCandidate?.id === candidateId || rightCandidate?.id === candidateId;
  };

  const getSelectedSide = (candidateId: string) => {
    if (leftCandidate?.id === candidateId) return 'left';
    if (rightCandidate?.id === candidateId) return 'right';
    return null;
  };

  // Split candidates into grid rows for Street Fighter style
  const rows = [];
  const candidatesPerRow = 8;
  for (let i = 0; i < candidates.length; i += candidatesPerRow) {
    rows.push(candidates.slice(i, i + candidatesPerRow));
  }

  const renderCandidateButton = (candidate: any, index: number) => {
    const selected = isSelected(candidate.id);
    const side = getSelectedSide(candidate.id);
    
    return (
      <motion.button
        key={candidate.id}
        onClick={() => selectCandidate(candidate)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "fighting-game-selector relative transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900",
          "aspect-[4/3] w-full max-w-[120px] min-h-[90px]",
          selected && (side === 'left' ? "ring-2 ring-team-left shadow-team-left/50" : "ring-2 ring-team-right shadow-team-right/50")
        )}
        aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
        tabIndex={0}
      >
        {/* Selection overlay */}
        {selected && (
          <div className={cn(
            "absolute inset-0 rounded-lg border-2 border-opacity-80 z-10",
            side === 'left' ? "border-team-left bg-team-left/10" : "border-team-right bg-team-right/10"
          )}>
            <div className={cn(
              "absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white border-2 border-gray-800 z-20",
              side === 'left' ? "bg-team-left" : "bg-team-right"
            )}>
              {side === 'left' ? '1' : '2'}
            </div>
          </div>
        )}
        
        {/* Character portrait */}
        <div className="w-full h-full p-2 relative overflow-hidden rounded-lg">
          <img
            src={candidate.headshot}
            alt={`Retrato de ${candidate.nombre}`}
            className="w-full h-full object-cover rounded border border-gray-600"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-${1500000000000 + Math.abs(candidate.nombre.charCodeAt(0) * 1000000)}?w=150&h=150&fit=crop&crop=face`;
            }}
            loading="lazy"
          />
          
          {/* Character name overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
            <div className="text-white text-xs font-bold truncate drop-shadow-sm">
              {candidate.nombre.split(' ')[0]}
            </div>
            <div className="text-gray-300 text-xs truncate drop-shadow-sm">
              {candidate.nombre.split(' ').slice(1).join(' ')}
            </div>
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="w-full border-t-4 border-yellow-500 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto p-4">
        {/* Street Fighter Style Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-yellow-400 font-black text-2xl tracking-wider">
              CHARACTER SELECT
            </div>
            <div className="text-gray-400 text-sm">
              {!leftCandidate && !rightCandidate 
                ? "Choose your fighters"
                : leftCandidate && rightCandidate
                ? "Ready to fight!"
                : "Choose second fighter"
              }
            </div>
          </div>
          
          {/* Player indicators */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-team-left rounded-full animate-pulse"></div>
              <span className="text-team-left font-bold text-sm">1P</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-team-right rounded-full animate-pulse"></div>
              <span className="text-team-right font-bold text-sm">2P</span>
            </div>
          </div>
        </div>

        {/* Character Grid */}
        <div className="space-y-3">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="relative">
              {/* Mobile: Horizontal scroll */}
              <div className="lg:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {row.map((candidate, index) => renderCandidateButton(candidate, rowIndex * candidatesPerRow + index))}
                </div>
              </div>
              
              {/* Desktop: Grid */}
              <div className="hidden lg:grid lg:grid-cols-8 lg:gap-3 lg:justify-center">
                {row.map((candidate, index) => renderCandidateButton(candidate, rowIndex * candidatesPerRow + index))}
              </div>
            </div>
          ))}
        </div>

        {/* Battle Status */}
        {leftCandidate && rightCandidate && (
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center gap-8 bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <img src={leftCandidate.headshot} alt="" className="w-10 h-10 rounded border-2 border-team-left" />
                <div>
                  <div className="text-white font-bold text-sm">{leftCandidate.nombre.split(' ')[0]}</div>
                  <div className="text-team-left text-xs">{leftCandidate.ideologia}</div>
                </div>
              </div>
              
              <div className="fighting-game-vs text-2xl font-black px-4 py-2 rounded">
                VS
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white font-bold text-sm">{rightCandidate.nombre.split(' ')[0]}</div>
                  <div className="text-team-right text-xs">{rightCandidate.ideologia}</div>
                </div>
                <img src={rightCandidate.headshot} alt="" className="w-10 h-10 rounded border-2 border-team-right" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}