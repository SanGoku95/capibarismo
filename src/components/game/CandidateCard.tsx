import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useGameUIStore } from '@/store/useGameUIStore';

interface CandidateCardProps {
  candidate: {
    id: string;
    nombre: string;
    ideologia?: string;
    fullBody?: string;
    headshot?: string;
  };
  side: 'left' | 'right';
  onSelect: () => void;
  disabled?: boolean;
}

export function CandidateCard({ candidate, side, onSelect, disabled }: CandidateCardProps) {
  const { openCandidateInfo } = useGameUIStore();
  const imageSrc = candidate.fullBody || candidate.headshot;
  const isDisabled = Boolean(disabled);

  const handleInfoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    openCandidateInfo(candidate.id);
  };

  const handleSelect = () => {
    if (!isDisabled) {
      onSelect();
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg border border-white/20 sm:border-2 bg-black/40 transition-opacity"
      style={{ opacity: isDisabled ? 0.6 : 1 }}
    >
      {/* Info button - smaller on mobile */}
      <div className="w-full flex justify-end mb-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1.5 px-3 bg-black/40 hover:bg-accent hover:text-black border border-white/20 hover:border-accent rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 group backdrop-blur-sm"
          onClick={handleInfoClick}
        >
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-accent group-hover:text-black transition-colors" />
          <span className="text-white/90 group-hover:text-black">MÁS INFO</span>
        </Button>
      </div>

      {/* Image - responsive sizing */}
      <div className="cursor-pointer w-full flex justify-center" onClick={handleSelect}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={candidate.nombre}
            className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 flex items-center justify-center bg-white/5 text-white/60 text-xs sm:text-sm border border-white/10">
            Sin foto
          </div>
        )}
      </div>
      
      {/* Name and button - compact on mobile */}
      <div className="text-center w-full">
        <h3 className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 px-1 line-clamp-2">
          {candidate.nombre}
        </h3>
        {candidate.ideologia && (
          <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 px-1 line-clamp-2">
            {candidate.ideologia}
          </p>
        )}
        
        <Button
          onClick={handleSelect}
          disabled={isDisabled}
          className="w-full text-xs sm:text-sm h-8 sm:h-10"
          size="sm"
        >
          Elegir
        </Button>
      </div>
    </div>
  );
}
