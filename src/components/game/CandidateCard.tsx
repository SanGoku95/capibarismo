import { motion } from 'framer-motion';
import { useGameUIStore } from '@/store/useGameUIStore';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: {
    id: string;
    nombre: string;
    ideologia?: string;
    fullBody?: string;
  };
  side: 'left' | 'right';
  onSelect: () => void;
  disabled?: boolean;
}

export function CandidateCard({ candidate, side, onSelect, disabled }: CandidateCardProps) {
  const { openCandidateInfo, retroEffects, reducedMotion } = useGameUIStore();
  
  const sideColors = {
    left: 'from-blue-600/20 to-blue-800/20 border-blue-500',
    right: 'from-red-600/20 to-red-800/20 border-red-500',
  };
  
  const handleImageClick = () => {
    if (!disabled) {
      onSelect();
    }
  };
  
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCandidateInfo(candidate.id);
  };
  
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? {} : { opacity: 0, scale: 0.8 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      className={cn(
        'flex flex-col items-center gap-4 p-4 rounded-lg border-2 bg-gradient-to-b',
        sideColors[side],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Full body image */}
      <div 
        className={cn(
          'relative cursor-pointer group',
          disabled && 'pointer-events-none'
        )}
        onClick={handleImageClick}
      >
        <motion.img
          src={candidate.fullBody}
          alt={`${candidate.nombre} full body`}
          className={cn(
            'w-48 h-64 sm:w-64 sm:h-80 md:w-80 md:h-96 object-contain',
            'transition-transform group-hover:scale-105',
            retroEffects && 'drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'
          )}
          loading="lazy"
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
        />
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
            initial={false}
          >
            <span className="text-white text-xl font-bold uppercase tracking-wider">
              Elegir
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Candidate info */}
      <div className="text-center space-y-2 w-full">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
          {candidate.nombre}
        </h3>
        {candidate.ideologia && (
          <p className="text-sm sm:text-base text-white/80">
            {candidate.ideologia}
          </p>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Button
            onClick={onSelect}
            disabled={disabled}
            className={cn(
              'w-full sm:w-auto',
              side === 'left' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            )}
          >
            Elegir
          </Button>
          <Button
            variant="outline"
            onClick={handleInfoClick}
            className="w-full sm:w-auto"
          >
            <Info className="w-4 h-4 mr-2" />
            Ver perfil
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
