import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { CandidateFullBodyMedia } from '@/components/candidate/CandidateFullBody';
import { cn } from '@/lib/utils';
import type { CandidateBase } from '@/data/types';

interface CandidateCardProps {
  candidate: CandidateBase;
  side: 'left' | 'right';
  onSelect: () => void;
  disabled?: boolean;
  voteState?: 'winner' | 'loser';
  allCandidateIds?: string[]; // All candidates in the current match for comparison
}

export function CandidateCard({ candidate, side, onSelect, disabled, voteState, allCandidateIds }: CandidateCardProps) {
  const { openCandidateInfo, reducedMotion } = useGameUIStore();
  const isDisabled = Boolean(disabled);

  const safeSrc = (url: string) => encodeURI(url);

  const handleInfoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    openCandidateInfo(candidate.id, allCandidateIds);
  };

  const handleSelect = () => {
    if (!isDisabled) {
      onSelect();
    }
  };

  const loserFilter = voteState === 'loser'
    ? 'grayscale(100%) contrast(120%) brightness(50%)'
    : undefined;

  return (
    <motion.div
      animate={
        reducedMotion
          ? {}
          : voteState === 'winner'
            ? { scale: 1.05, filter: ['brightness(1.5)', 'brightness(1)'] }
            : voteState === 'loser'
              ? { scale: 0.95 }
              : {}
      }
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative flex flex-col items-center gap-1 sm:gap-4 p-1.5 sm:p-4 rounded-lg border border-white/20 sm:border-2 bg-black/40 transition-all duration-300 h-full',
        voteState === 'winner' && 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(255,200,0,0.5)]',
        voteState === 'loser' && 'border-red-500/40',
      )}
      style={{
        opacity: isDisabled && !voteState ? 0.6 : 1,
        filter: loserFilter,
      }}
    >
      {/* Image - use same media component as compare */}
      <div className="cursor-pointer w-full flex justify-center" onClick={handleSelect}>
        {candidate.fullBody ? (
          <CandidateFullBodyMedia
            candidate={candidate}
            side={side}
            className="w-16 h-20 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 rounded overflow-hidden shadow-lg"
          />
        ) : candidate.headshot ? (
          <img
            src={safeSrc(candidate.headshot)}
            alt={candidate.nombre}
            className="w-16 h-20 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 object-contain rounded overflow-hidden shadow-lg"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-16 h-20 sm:w-32 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-64 flex items-center justify-center bg-white/5 text-white/60 text-xs sm:text-sm border border-white/10">
            Sin foto
          </div>
        )}
      </div>

      {/* Name and button - compact on mobile */}
      <div className="text-center w-full flex-1 flex flex-col">
        <div className="min-h-[24px] sm:min-h-[2.75rem] flex items-start justify-center">
          <h3 className="text-[10px] sm:text-base md:text-lg lg:text-xl font-bold text-white px-0.5 sm:px-1 line-clamp-2 leading-tight">
            {candidate.nombre}
          </h3>
        </div>
        <div className="hidden sm:block min-h-[1.75rem]">
          {candidate.ideologia && (
            <p className="text-white/80 text-xs md:text-sm mb-1 sm:mb-2 px-1 line-clamp-1">
              {candidate.ideologia}
            </p>
          )}
        </div>

        {/* Party Icon - debajo del nombre y subtítulo */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2 min-h-[2.25rem] sm:min-h-[4.5rem]">
          {candidate.partyIcon && (
            <>
              <img
                src={safeSrc(candidate.partyIcon)}
                alt={candidate.partido || 'Partido político'}
                className="w-8 h-8 sm:w-16 sm:h-16 object-contain rounded-lg bg-white/10 p-1 sm:p-2 border border-white/20"
                loading="lazy"
              />
              {candidate.partido && (
                <p className="text-white/60 text-[7px] sm:text-[10px] text-center px-1 sm:px-2 line-clamp-1 sm:line-clamp-2">
                  {candidate.partido}
                </p>
              )}
            </>
          )}
        </div>

        {/* Hide buttons during vote animation */}
        {!voteState && (
          <div className="mt-auto">
            {/* Info button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full h-6 sm:h-9 bg-yellow-400 hover:bg-yellow-500 text-black border sm:border-2 border-yellow-500 hover:border-yellow-600 font-bold text-[8px] sm:text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 mb-0.5 sm:mb-2 px-1 sm:px-3"
              onClick={handleInfoClick}
            >
              <Info className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">MÁS INFO</span>
              <span className="sm:hidden">INFO</span>
            </Button>

            <Button
              onClick={handleSelect}
              disabled={isDisabled}
              className={cn(
                'w-full text-[8px] sm:text-sm h-6 sm:h-10 uppercase tracking-wider font-bold hover-shake animate-glow-pulse px-1 sm:px-3',
              )}
              size="sm"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.4rem, 1.5vw, 0.65rem)' }}
            >
              ¡VOTAR!
            </Button>
          </div>
        )}
      </div>

      {/* ELIMINADO overlay for loser */}
      {voteState === 'loser' && (
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg z-10"
        >
          <X className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" strokeWidth={3} />
          <span
            className="text-red-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            ELIMINADO
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
