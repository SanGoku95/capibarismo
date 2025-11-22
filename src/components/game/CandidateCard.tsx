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
      className="flex flex-col items-center gap-4 p-4 rounded-lg border-2 border-white/20 bg-black/40 transition-opacity"
      style={{ opacity: isDisabled ? 0.6 : 1 }}
    >
      <div className="w-full flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white"
          onClick={handleInfoClick}
          title="Ver información"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>

      {/* Simple image */}
      <div className="cursor-pointer" onClick={handleSelect}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={candidate.nombre}
            className="w-48 h-64 object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-48 h-64 flex items-center justify-center bg-white/5 text-white/60 text-sm border border-white/10">
            Sin foto
          </div>
        )}
      </div>
      
      {/* Name */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          {candidate.nombre}
        </h3>
        {candidate.ideologia && (
          <p className="text-white/80 text-sm mb-4">
            {candidate.ideologia}
          </p>
        )}
        
        <Button
          onClick={handleSelect}
          disabled={isDisabled}
          className="w-full"
        >
          Elegir
        </Button>
      </div>
    </div>
  );
}
