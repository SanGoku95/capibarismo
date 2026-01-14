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
    handleVideoError,
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
      {/* Poster: always rendered, fades out when motion is ready */}
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

      {/* HEVC video for Safari/iOS - fades in when ready */}
      {mediaType === MediaType.Hevc && (
        <video
          key={`${candidate.id}-hevc`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 ${mediaClass}`}
          style={{
            opacity: isMotionReady ? 1 : 0,
            ...transitionStyle,
          }}
          aria-hidden="true"
          onLoadedData={handleMotionReady}
          onError={handleVideoError}
        >
          {/* .mov container - use QuickTime type for Safari compatibility */}
          <source src={safeSrc(assets.hevc)} type='video/quicktime; codecs="hvc1"' />
          <source src={safeSrc(assets.hevc)} type='video/mp4; codecs="hvc1"' />
        </video>
      )}

      {/* VP9 WebM for Chrome/Android - fades in when ready */}
      {mediaType === MediaType.Video && (
        <video
          key={`${candidate.id}-webm`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 ${mediaClass}`}
          style={{
            opacity: isMotionReady ? 1 : 0,
            ...transitionStyle,
          }}
          aria-hidden="true"
          onLoadedData={handleMotionReady}
          onError={handleVideoError}
        >
          {/* Some browsers prefer vp09 codec string */}
          <source src={safeSrc(assets.webm)} type='video/webm; codecs="vp09.00.10.08"' />
          <source src={safeSrc(assets.webm)} type='video/webm; codecs="vp9"' />
        </video>
      )}
      
      {/* Animated WebP fallback - fades in when ready */}
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
    </motion.div>
  );
}
