import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Info, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useGameUIStore } from '@/store/useGameUIStore';
import { CandidateFullBodyMedia } from '@/components/candidate/CandidateFullBody';
import type { CandidateBase } from '@/data/types';

interface QualifierCardProps {
  candidate: CandidateBase;
  onAccept: () => void;
  onReject: () => void;
  index: number;
  total: number;
  swipeDirection: 'accept' | 'reject' | null;
}

export function QualifierCard({ candidate, onAccept, onReject, index, total, swipeDirection }: QualifierCardProps) {
  const { openCandidateInfo, reducedMotion } = useGameUIStore();

  const safeSrc = (url: string) => encodeURI(url);

  const handleInfoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    openCandidateInfo(candidate.id);
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      },
    },
    exit: (direction: 'accept' | 'reject' | null) => ({
      x: direction === 'accept' ? 400 : -400,
      opacity: 0,
      rotate: direction === 'accept' ? 20 : -20,
      transition: {
        duration: 0.15,
        ease: 'easeIn' as const,
      },
    }),
  };

  return (
    <motion.div
      custom={swipeDirection}
      variants={reducedMotion ? undefined : cardVariants}
      initial={reducedMotion ? undefined : "hidden"}
      animate="visible"
      exit={reducedMotion ? undefined : "exit"}
      className="w-full max-w-6xl mx-auto px-2"
    >
      {/* Header with progress and info */}
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider pixel-font">
          {index + 1} / {total}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto py-1.5 px-3 bg-black/40 hover:bg-accent hover:text-black border border-white/20 hover:border-accent rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 group backdrop-blur-sm"
          onClick={handleInfoClick}
        >
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-accent group-hover:text-black transition-colors" />
          <span className="text-white/90 group-hover:text-black">INFO</span>
        </Button>
      </div>

      {/* Main content: buttons on sides, card in center */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
        {/* LEFT BUTTON - NO VA */}
        <Button
          onClick={onReject}
          size="lg"
          className="h-24 sm:h-32 md:h-40 w-20 sm:w-28 md:w-32 bg-destructive hover:bg-destructive/80 text-white font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider pixel-font border-4 border-destructive/60 shadow-lg hover:shadow-destructive/50 transition-all duration-200 hover:scale-110 flex flex-col gap-2 shrink-0"
        >
          <ThumbsDown className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="whitespace-nowrap">NO VA</span>
        </Button>

        {/* CENTER CARD */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border-4 border-primary/50 bg-gradient-to-b from-card/90 to-card shadow-2xl backdrop-blur-sm max-w-sm">
          {/* Candidate Image */}
          <div className="w-full flex justify-center">
            {candidate.fullBody ? (
              <CandidateFullBodyMedia
                candidate={candidate}
                side="left"
                className="w-40 h-52 sm:w-48 sm:h-64 md:w-56 md:h-72 rounded-lg overflow-hidden shadow-2xl border-4 border-white/10"
              />
            ) : candidate.headshot ? (
              <img
                src={safeSrc(candidate.headshot)}
                alt={candidate.nombre}
                className="w-40 h-52 sm:w-48 sm:h-64 md:w-56 md:h-72 object-contain rounded-lg overflow-hidden shadow-2xl border-4 border-white/10"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="w-40 h-52 sm:w-48 sm:h-64 md:w-56 md:h-72 flex items-center justify-center bg-white/5 text-white/60 text-sm border-4 border-white/10 rounded-lg">
                Sin foto
              </div>
            )}
          </div>

          {/* Candidate Info */}
          <div className="text-center w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 px-2 line-clamp-2 pixel-font">
              {candidate.nombre}
            </h2>
            {candidate.ideologia && (
              <p className="text-white/80 text-xs sm:text-sm mb-3 px-2 line-clamp-2">
                {candidate.ideologia}
              </p>
            )}
            
            {/* Party Icon */}
            {candidate.partyIcon && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={safeSrc(candidate.partyIcon)}
                  alt={candidate.partido || 'Partido político'}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg bg-white/10 p-2 border-2 border-white/20"
                  loading="lazy"
                />
                {candidate.partido && (
                  <p className="text-white/60 text-[10px] sm:text-xs text-center px-2 line-clamp-2">
                    {candidate.partido}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT BUTTON - VA */}
        <Button
          onClick={onAccept}
          size="lg"
          className="h-24 sm:h-32 md:h-40 w-20 sm:w-28 md:w-32 bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider pixel-font border-4 border-green-700 shadow-lg hover:shadow-green-500/50 transition-all duration-200 hover:scale-110 flex flex-col gap-2 shrink-0"
        >
          <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="whitespace-nowrap">VA</span>
        </Button>
      </div>

      {/* Hint */}
      <p className="text-white/50 text-xs text-center mt-4">
        Selecciona los candidatos que pasarán a la batalla
      </p>
    </motion.div>
  );
}
