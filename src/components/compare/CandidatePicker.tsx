import { useCompareStore } from '@/store/useCompareStore';
import { cn } from '@/lib/utils';
import { listCandidates } from '@/data';
import type { CandidateBase } from '@/data/types';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          "flex-shrink-0 w-20 lg:w-20 overflow-hidden rounded-lg",
          "min-h-[80px]",
          !selected && "hover:scale-[1.03] active:scale-[0.98]"
        )}
        aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
        tabIndex={0}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center">
          <div className="text-xs font-bold text-white truncate">
            {candidate.nombre.split(' ')[0]}
          </div>
        </div>
        {selected && (
          <div className={cn(
            "absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white",
            side === 'left' ? "bg-team-left" : "bg-team-right"
          )}>
            {side === 'left' ? '1' : '2'}
          </div>
        )}
        
        <img
          src={candidate.headshot}
          alt={`Retrato de ${candidate.nombre}`}
          className="w-full h-full object-cover"
        />
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:static w-full border-t-2 border-border bg-background/80 backdrop-blur-sm lg:flex-shrink-0 lg:h-auto">
      <div className="container mx-auto p-2 lg:p-3">
        {/* Header with instructions */}
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <div>
            <h2 className="text-base lg:text-lg font-bold flex items-baseline">
              <span>Candidatos:</span>
              <span className="text-xs lg:text-sm text-muted-foreground font-normal ml-2">
                {!leftCandidate && !rightCandidate 
                  ? "Elige dos para comparar" 
                  : leftCandidate && rightCandidate 
                  ? "Haz clic para cambiar." 
                  : "Elige el segundo candidato"}
              </span>
            </h2>
          </div>
          
          {/* VS Indicator (Desktop) */}
          {leftCandidate && rightCandidate && (
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={leftCandidate.headshot} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">{leftCandidate.nombre.split(' ')[0]}</span>
              </div>
              <div className="fighting-game-vs">VS</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{rightCandidate.nombre.split(' ')[0]}</span>
                <img src={rightCandidate.headshot} alt="" className="w-8 h-8 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Unified Responsive Candidate Grid */}
        <div className="flex flex-wrap gap-2 justify-center max-w-[516px] mx-auto">
          {listCandidates().map(renderCandidateButton)}
          
          {/* Placeholder for upcoming candidates */}
          <Link
            to="/#apoyar"
            className={cn(
              "relative aspect-square",
              "flex-shrink-0 w-20 lg:w-20 overflow-hidden rounded-lg",
              "min-h-[80px]",
              "bg-muted/30 border-2 border-dashed border-muted-foreground/30",
              "flex items-center justify-center",
              "opacity-60 hover:opacity-100 hover:border-muted-foreground/50 transition-all duration-200",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            aria-label="Apoya el proyecto - Ayúdanos a agregar más candidatos"
            title="Apoya el proyecto"
          >
            <Plus className="w-8 h-8 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}