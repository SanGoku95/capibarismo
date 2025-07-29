import { motion } from 'framer-motion';
import { candidates } from '@/data/candidates';
import { useCompareStore } from '@/store/useCompareStore';
import { cn } from '@/lib/utils';

export function CandidatePicker() {
  const {
    leftCandidate,
    rightCandidate,
    selectCandidate
  } = useCompareStore();

  const isSelected = (candidateId: string) => {
    return leftCandidate?.id === candidateId || rightCandidate?.id === candidateId;
  };

  const getSelectedSide = (candidateId: string) => {
    if (leftCandidate?.id === candidateId) return 'left';
    if (rightCandidate?.id === candidateId) return 'right';
    return null;
  };

  const renderCandidateButton = (candidate: (typeof candidates)[0]) => {
    const selected = isSelected(candidate.id);
    const side = getSelectedSide(candidate.id);
    return (
      <motion.button
        key={candidate.id}
        onClick={() => selectCandidate(candidate)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fighting-game-selector relative p-1 lg:p-3 rounded-xl lg:rounded-2xl transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "flex-shrink-0 w-16 lg:w-24"
        )}
        aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
        tabIndex={0}
      >
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
            className="w-10 h-10 lg:w-16 lg:h-16 rounded-full object-cover mx-auto ring-2 ring-border"
          />
          <div className="mt-1 text-xs font-medium max-w-full truncate">
            {candidate.nombre.split(' ')[0]}
          </div>
          <div className="text-xs text-muted-foreground truncate hidden lg:block">
            {candidate.nombre.split(' ').slice(1).join(' ')}
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:static w-full border-t-2 border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto p-2 lg:p-4">
        {/* Header with instructions */}
        <div className="flex items-center justify-between mb-2 lg:mb-4">
          <div>
            <h2 className="text-base lg:text-lg font-bold">Candidatos</h2>
            <p className="text-xs lg:text-sm text-muted-foreground">
              {!leftCandidate && !rightCandidate 
                ? "Elige dos para comparar" 
                : leftCandidate && rightCandidate 
                ? "Comparando. Haz clic para cambiar." 
                : "Elige el segundo candidato"}
            </p>
          </div>
          
          {/* VS Indicator (Desktop) */}
          {leftCandidate && rightCandidate && (
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={leftCandidate.headshot} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">{leftCandidate.nombre.split(' ')[0]}</span>
              </div>
              <div className="fighting-game-vs text-xl font-bold">VS</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{rightCandidate.nombre.split(' ')[0]}</span>
                <img src={rightCandidate.headshot} alt="" className="w-8 h-8 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Unified Responsive Candidate List */}
        <div className="flex flex-row gap-2 overflow-x-auto pb-2 scrollbar-hide lg:flex-wrap lg:justify-center lg:gap-3 lg:overflow-visible">
          {candidates.map(renderCandidateButton)}
        </div>
      </div>
    </div>
  );
}