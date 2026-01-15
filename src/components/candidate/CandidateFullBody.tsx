import { motion } from 'framer-motion';
import type { CandidateBase } from '@/data/types';
import { useOptimizedMedia, MediaType } from '@/hooks/useOptimizedMedia';

interface CandidateFullBodyProps {
  candidate: CandidateBase | null;
  side: 'left' | 'right';
}

const safeSrc = (url: string) => encodeURI(url);

export function CandidateFullBodyMedia({
  candidate,
  side,
  className,
}: {
  candidate: CandidateBase;
  side: 'left' | 'right';
  className?: string;
}) {
  const {
    assets,
    mediaType,
    isMotionReady,
    handleAnimError,
    handleMotionReady,
  } = useOptimizedMedia(candidate.fullBody, candidate.id);

  const mirror = side === 'right';
  const mediaClass = `w-full h-full object-contain${mirror ? ' scale-x-[-1]' : ''}`;

  // Fallback: if naming convention doesn't match, render the provided fullBody as-is.
  if (!assets) {
    if (!candidate.fullBody) {
      // Render nothing or a placeholder if there's no image URL
      return null; 
    }
    return (
      <div className={`relative ${className ?? ''}`}>
        <img
          src={safeSrc(candidate.fullBody)}
          alt={`${candidate.nombre} full body`}
          className={mediaClass}
        />
      </div>
    );
  }

  // Shared transition style for smooth crossfade
  const transitionStyle = { transition: 'opacity 150ms ease' };

  return (
    <div className={`relative ${className ?? ''}`} aria-label={`${candidate.nombre} en posición de combate`}>
      {/* Poster: fades out when animated image is ready */}
      <img
        src={safeSrc(assets.poster)}
        alt={`${candidate.nombre} full body`}
        className={mediaClass}
        style={{
          display: 'block',
          opacity: isMotionReady ? 0 : 1,
          ...transitionStyle,
        }}
      />
      
      {/* Animated WebP - works on iPhone iOS 14.5+, Android, and all desktop browsers */}
      {mediaType === MediaType.Anim && (
        <img
          key={`${candidate.id}-anim`}
          src={safeSrc(assets.animWebp)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 ${mediaClass}`}
          style={{
            opacity: isMotionReady ? 1 : 0,
            ...transitionStyle,
          }}
          onLoad={handleMotionReady}
          onError={handleAnimError}
        />
      )}
    </div>
  );
}

export function CandidateFullBody({ candidate, side }: CandidateFullBodyProps) {
  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl font-bold ${
            side === 'left' ? 'bg-team-left/20 text-team-left' : 'bg-team-right/20 text-team-right'
          }`}>
            {side === 'left' ? '1' : '2'}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-foreground">
              Candidato {side === 'left' ? '1' : '2'}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Selecciona un candidato abajo para comenzar la comparación
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, scale: 0.8, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: side === 'left' ? -50 : 50 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      className="flex flex-col items-center justify-center h-full"
    >
      <CandidateFullBodyMedia
        candidate={candidate}
        side={side}
        className={`w-72 h-96 mx-auto ${
          side === 'left' ? 'shadow-team-left/50' : 'shadow-team-right/50'
        }`}
      />

      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-6 text-xl font-black text-center tracking-wider uppercase"
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        {candidate.nombre}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        className="text-sm text-muted-foreground font-medium tracking-wide"
      >
        {candidate.ideologia}
      </motion.p>
      
      {/* Party Icon */}
      {candidate.partyIcon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <img
            src={safeSrc(candidate.partyIcon)}
            alt={candidate.partido || 'Partido político'}
            className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
            loading="lazy"
          />
          {candidate.partido && (
            <p className="text-xs text-white/60 text-center">
              {candidate.partido}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
