import { useCompareStore } from '@/store/useCompareStore';
import { cn } from '@/lib/utils';
import { listCandidates } from '@/data';
import type { CandidateBase } from '@/data/types';

export function CandidatePicker() {
  const {
    leftCandidate,
    rightCandidate,
    selectCandidate,
  } = useCompareStore();

  const isSelected = (candidateId: string) => {
    return leftCandidate?.id === candidateId || rightCandidate?.id === candidateId;
  };

  const getSelectedSide = (candidateId: string) => {
    if (leftCandidate?.id === candidateId) return 'left';
    if (rightCandidate?.id === candidateId) return 'right';
    return null;
  };

  const handleCandidateButtonClick = (candidate: CandidateBase) => {
    // Store now accepts CandidateBase
    selectCandidate(candidate);
  };

  const renderCandidateButton = (candidate: CandidateBase) => {
    const selected = isSelected(candidate.id);
    const side = getSelectedSide(candidate.id);
    return (
      <button
        type="button"
        key={candidate.id}
        onClick={() => handleCandidateButtonClick(candidate)}
        className={cn(
          "relative aspect-square transition-transform duration-150 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "overflow-hidden rounded-md",
          "w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16",
          !selected && "hover:scale-[1.03] active:scale-[0.98]"
        )}
        aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
        aria-selected={selected}
        tabIndex={0}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-0.5 text-center">
          <div className="text-[0.6rem] sm:text-xs font-bold text-white truncate leading-tight">
            {candidate.nombre.split(' ')[0]}
          </div>
        </div>
        {selected && (
          <div className={cn(
            "absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[0.6rem] sm:text-xs font-bold flex items-center justify-center text-white",
            side === 'left' ? "bg-team-left" : "bg-team-right"
          )}>
            {side === 'left' ? '1' : '2'}
          </div>
        )}
        
        <img
          src={candidate.headshot}
          alt={`Retrato de ${candidate.nombre}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </button>
    );
  };

  const statusText =
    leftCandidate && rightCandidate ? 'Listo' : leftCandidate || rightCandidate ? 'Falta 1' : 'Elige 2';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:static w-full border-t-2 border-border bg-background/80 backdrop-blur-sm lg:flex-shrink-0 lg:h-auto">
      <div className="container mx-auto px-2 py-1 lg:px-3 lg:py-2">
        {/* Header (compact) */}
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs lg:text-sm font-bold">Candidatos</h2>
            <span className={cn(
              "text-[10px] lg:text-xs font-semibold rounded-full px-2 py-0.5 border",
              leftCandidate && rightCandidate
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-muted-foreground/20 bg-muted/30 text-muted-foreground"
            )}>
              {statusText}
            </span>
          </div>

          {/* keep VS only when both selected (already minimal) */}
          {leftCandidate && rightCandidate && (
            <div className="hidden lg:flex items-center gap-3">
              <img src={leftCandidate.headshot} alt="" className="w-7 h-7 rounded-full" />
              <div className="fighting-game-vs text-sm">VS</div>
              <img src={rightCandidate.headshot} alt="" className="w-7 h-7 rounded-full" />
            </div>
          )}
        </div>

        {/* Unified Responsive Candidate Grid */}
        <div 
          className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1 sm:gap-1.5 md:gap-2 max-h-[18vh] sm:max-h-[25vh] lg:max-h-[30vh] overflow-y-auto pr-1 pb-1"
        >
          {listCandidates().map(renderCandidateButton)}
        </div>
      </div>
    </div>
  );
}