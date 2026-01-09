import { motion } from 'framer-motion';
import type { CandidateBase } from '@/data/types';
import { useEffect, useMemo, useState } from 'react';

interface CandidateFullBodyProps {
  candidate: CandidateBase | null;
  side: 'left' | 'right';
}

function useCanPlayWebmVp9() {
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    // Run only in the browser; avoid touching DOM during render.
    try {
      const v = document.createElement('video');
      setCanPlay(v.canPlayType('video/webm; codecs="vp9"') !== '');
    } catch {
      setCanPlay(false);
    }
  }, []);

  return canPlay;
}

type OptimizedAssets = {
  poster: string;
  webm: string;
  animWebp: string;
};

function deriveOptimizedAssets(poster: string): OptimizedAssets | null {
  // expects: /.../NAME_poster_h432_q80.webp
  const m = poster.match(/^(.*\/)([^/]+?)_poster_(h\d+)_q\d+\.webp$/);
  if (!m) return null;

  const [, dir, base, h] = m;

  return {
    poster,
    webm: `${dir}${base}_vp9_alpha_${h}_fps15_crf35.webm`,
    animWebp: `${dir}${base}_anim_${h}_fps15_q60.webp`,
  };
}

const safeSrc = (url: string) => encodeURI(url);

export function CandidateFullBodyMedia({
  candidate,
  side,
  className,
}: {
  candidate: CandidateBase;
  side: 'left' | 'right';
  className?: string; // container sizing/rounding/shadow/margins
}) {
  const canWebmVp9 = useCanPlayWebmVp9();

  const assets = useMemo(() => deriveOptimizedAssets(candidate.fullBody), [candidate.fullBody]);
  const mirror = side === 'right';
  const mediaClass = `w-full h-full object-cover${mirror ? ' scale-x-[-1]' : ''}`;

  const [videoFailed, setVideoFailed] = useState(false);
  const [animFailed, setAnimFailed] = useState(false);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
    setAnimFailed(false);
    setMotionReady(false);
  }, [candidate.id]);

  // Fallback: if naming convention doesn't match, render the provided fullBody as-is.
  if (!assets) {
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

  const showVideo = canWebmVp9 && !videoFailed;
  const showAnim = !showVideo && !animFailed;

  return (
    <div className={`relative ${className ?? ''}`} aria-label={`${candidate.nombre} en posición de combate`}>
      {/* Poster: only a placeholder; fade out once motion is ready */}
      <img
        src={safeSrc(assets.poster)}
        alt={`${candidate.nombre} full body`}
        className={mediaClass}
        style={{
          display: 'block',
          opacity: motionReady ? 0 : 1,
          transition: 'opacity 150ms ease',
        }}
      />

      {showVideo ? (
        <video
          key={`${candidate.id}-webm`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 ${mediaClass}`}
          aria-hidden="true"
          onLoadedData={() => setMotionReady(true)}
          onCanPlay={() => setMotionReady(true)}
          onError={() => {
            setVideoFailed(true);
            setMotionReady(false); // keep poster until fallback loads
          }}
        >
          <source src={safeSrc(assets.webm)} type='video/webm; codecs="vp9"' />
        </video>
      ) : showAnim ? (
        <img
          key={`${candidate.id}-anim`}
          src={safeSrc(assets.animWebp)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 ${mediaClass}`}
          onLoad={() => setMotionReady(true)}
          onError={() => {
            setAnimFailed(true);
            setMotionReady(false);
          }}
        />
      ) : null}
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
