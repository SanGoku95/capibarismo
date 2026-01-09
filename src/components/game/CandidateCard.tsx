import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { CandidateFullBodyMedia } from '@/components/candidate/CandidateFullBody';
import type { CandidateBase } from '@/data/types';

interface CandidateCardProps {
  candidate: CandidateBase;
  side: 'left' | 'right';
  onSelect: () => void;
  disabled?: boolean;
}

export function CandidateCard({ candidate, side, onSelect, disabled }: CandidateCardProps) {
  const { openCandidateInfo } = useGameUIStore();
  const isDisabled = Boolean(disabled);

  const safeSrc = (url: string) => encodeURI(url);

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
      <div className="w-full flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white h-6 w-6 sm:h-8 sm:w-8"
          onClick={handleInfoClick}
          title="Ver información"
        >
          <Info className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>

      {/* Image - use same media component as compare */}
      <div className="cursor-pointer w-full flex justify-center" onClick={handleSelect}>
        {candidate.fullBody ? (
          <CandidateFullBodyMedia
            candidate={candidate}
            side={side}
            className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 rounded overflow-hidden shadow-lg"
          />
        ) : candidate.headshot ? (
          <img
            src={safeSrc(candidate.headshot)}
            alt={candidate.nombre}
            className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 object-cover rounded overflow-hidden shadow-lg"
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
