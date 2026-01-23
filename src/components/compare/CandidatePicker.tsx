import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { cn } from '@/lib/utils';
import { listCandidates } from '@/data';
import type { CandidateBase } from '@/data/types';

export function CandidatePicker() {
  const [isExpanded, setIsExpanded] = useState(true);
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
          "relative flex-shrink-0 aspect-square transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "overflow-hidden rounded-lg",
          // Móvil: tamaño más grande
          "w-12 h-12",
          // Desktop: tamaño uniforme
          "lg:w-16 lg:h-16",
          // Bordes y sombras
          "border-2 border-transparent",
          selected ? (
            side === 'left'
              ? "border-team-left ring-2 ring-team-left/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              : "border-team-right ring-2 ring-team-right/50 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
          ) : "lg:hover:border-white/30 lg:hover:shadow-lg lg:hover:scale-105 active:scale-95"
        )}
        aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
        aria-selected={selected}
        tabIndex={0}
      >
        <img
          src={candidate.headshot}
          alt={`Retrato de ${candidate.nombre}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-0.5 text-center">
          <div className="text-[0.5rem] lg:text-xs font-bold text-white truncate leading-tight drop-shadow-md">
            {candidate.nombre.split(' ')[0]}
          </div>
        </div>
        {selected && (
          <div className={cn(
            "absolute top-0.5 right-0.5 lg:-top-1 lg:-right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full text-[0.6rem] lg:text-xs font-bold flex items-center justify-center text-white shadow-md",
            side === 'left' ? "bg-team-left" : "bg-team-right"
          )}>
            {side === 'left' ? '1' : '2'}
          </div>
        )}
      </button>
    );
  };

  const statusText =
    leftCandidate && rightCandidate ? 'Listo' : leftCandidate || rightCandidate ? 'Falta 1' : 'Elige 2';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:relative lg:z-auto w-full border-t-2 lg:border-t-0 lg:border-b-2 border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-2 py-1 lg:px-3 lg:py-2">
        {/* Header con toggle en móvil */}
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 lg:pointer-events-none"
          >
            <h2 className="text-xs lg:text-sm font-bold">Candidatos</h2>
            <span className={cn(
              "text-[10px] lg:text-xs font-semibold rounded-full px-2 py-0.5 border",
              leftCandidate && rightCandidate
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-muted-foreground/20 bg-muted/30 text-muted-foreground"
            )}>
              {statusText}
            </span>
            {/* Flecha solo en móvil */}
            <span className="lg:hidden text-muted-foreground">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </span>
          </button>

          {/* VS solo cuando ambos seleccionados (desktop) */}
          {leftCandidate && rightCandidate && (
            <div className="hidden lg:flex items-center gap-3">
              <img src={leftCandidate.headshot} alt="" className="w-7 h-7 rounded-full" />
              <div className="fighting-game-vs text-sm">VS</div>
              <img src={rightCandidate.headshot} alt="" className="w-7 h-7 rounded-full" />
            </div>
          )}
        </div>

        {/* Grid de candidatos - colapsable en móvil */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
          )}
        >
          <div
            className={cn(
              // Móvil: grid de 2 filas con scroll horizontal
              "grid grid-rows-2 grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-1",
              "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              // Desktop: grid de 12 columnas con distribución uniforme (36 candidatos = 3 filas de 12)
              "lg:grid-rows-none lg:grid-flow-row lg:auto-cols-auto",
              "lg:grid-cols-12 lg:gap-2 lg:overflow-x-visible lg:overflow-y-visible lg:justify-items-center"
            )}
          >
            {listCandidates().map(renderCandidateButton)}
          </div>
        </div>
      </div>
    </div>
  );
}