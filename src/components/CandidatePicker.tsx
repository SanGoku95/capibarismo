
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

  // Split candidates into two rows (10 each for fighting game feel)
  const firstRow = candidates.slice(0, 10);
  const secondRow = candidates.slice(10, 20);

  const renderCandidateButton = (candidate: any) => {
    const selected = isSelected(candidate.id);
    const side = getSelectedSide(candidate.id);
    
    return (
      <motion.button
        key={candidate.id}
        onClick={() => selectCandidate(candidate)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative p-2 lg:p-3 rounded-2xl border-2 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "flex-shrink-0 w-20 lg:w-24",
          selected
            ? side === 'left'
              ? "border-team-left bg-team-left/20 shadow-lg shadow-team-left/30"
              : "border-team-right bg-team-right/20 shadow-lg shadow-team-right/30"
            : "border-border hover:border-primary hover:shadow-md"
        )}
        aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
        tabIndex={0}
      >
        {/* Selection indicator */}
        {selected && (
          <div className={cn(
            "absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white",
            side === 'left' ? "bg-team-left" : "bg-team-right"
          )}>
            {side === 'left' ? '1' : '2'}
          </div>
        )}
        
        <div className="text-center">
          <img
            src={candidate.headshot}
            alt={`Retrato de ${candidate.nombre}`}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover mx-auto"
          />
          <div className="mt-1 text-xs font-medium max-w-full truncate">
            {candidate.nombre.split(' ')[0]}
          </div>
          <div className="text-xs text-muted-foreground truncate lg:block hidden">
            {candidate.nombre.split(' ').slice(1).join(' ')}
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="w-full bg-card border-t border-border">
      <div className="container mx-auto p-4">
        {/* Header with instructions */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Candidatos 2026</h2>
            <p className="text-sm text-muted-foreground">
              {!leftCandidate && !rightCandidate 
                ? "Elige dos candidatos para comparar"
                : leftCandidate && rightCandidate
                ? "Comparando candidatos - Haz clic para cambiar"
                : "Elige un segundo candidato"
              }
            </p>
          </div>
          
          {/* VS Indicator */}
          {leftCandidate && rightCandidate && (
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={leftCandidate.headshot} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">{leftCandidate.nombre.split(' ')[0]}</span>
              </div>
              <div className="text-xl font-bold text-primary">VS</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{rightCandidate.nombre.split(' ')[0]}</span>
                <img src={rightCandidate.headshot} alt="" className="w-8 h-8 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Fighting Game Style Character Grid */}
        <div className="space-y-3">
          {/* First Row */}
          <div className="relative">
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {firstRow.map(renderCandidateButton)}
              </div>
            </div>
            
            {/* Desktop: Fixed grid */}
            <div className="hidden lg:flex lg:justify-center lg:gap-3">
              {firstRow.map(renderCandidateButton)}
            </div>
          </div>

          {/* Second Row */}
          <div className="relative">
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {secondRow.map(renderCandidateButton)}
              </div>
            </div>
            
            {/* Desktop: Fixed grid */}
            <div className="hidden lg:flex lg:justify-center lg:gap-3">
              {secondRow.map(renderCandidateButton)}
            </div>
          </div>
        </div>

        {/* Selection Status (Mobile) */}
        {(leftCandidate || rightCandidate) && (
          <div className="lg:hidden mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-team-left rounded-full"></div>
              <span className="text-xs">
                {leftCandidate ? leftCandidate.nombre.split(' ')[0] : 'Candidato 1'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">VS</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-team-right rounded-full"></div>
              <span className="text-xs">
                {rightCandidate ? rightCandidate.nombre.split(' ')[0] : 'Candidato 2'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
