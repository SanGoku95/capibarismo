import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameUIStore } from '@/store/useGameUIStore';
import { findCandidateBase } from '@/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PodiumResult } from '@/lib/tournamentTypes';

interface PodiumScreenProps {
  podium: PodiumResult;
  onPlayAgain: () => void;
}

const PODIUM_CONFIG = [
  { key: 'first' as const,  label: 'CAMPEÓN', rank: '1', color: 'text-yellow-400', borderColor: 'border-yellow-400/60', glow: 'shadow-[0_0_20px_rgba(255,200,0,0.4)]', size: 'w-20 h-20 sm:w-24 sm:h-24' },
  { key: 'second' as const, label: 'SUBCAMPEÓN', rank: '2', color: 'text-gray-300', borderColor: 'border-gray-300/60', glow: 'shadow-[0_0_12px_rgba(192,192,192,0.3)]', size: 'w-16 h-16 sm:w-20 sm:h-20' },
  { key: 'third' as const,  label: 'TERCER LUGAR', rank: '3', color: 'text-amber-600', borderColor: 'border-amber-600/60', glow: 'shadow-[0_0_12px_rgba(180,130,50,0.3)]', size: 'w-16 h-16 sm:w-20 sm:h-20' },
] as const;

export function PodiumScreen({ podium, onPlayAgain }: PodiumScreenProps) {
  const { reducedMotion } = useGameUIStore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  // Canvas confetti celebration
  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const fireConfetti = async () => {
      const confetti = (await import('canvas-confetti')).default;
      if (cancelled) return;

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        if (cancelled) return;
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, 300);
    };
    fireConfetti();

    return () => { cancelled = true; };
  }, [reducedMotion]);

  const buildShareText = () => {
    const first = findCandidateBase(podium.first);
    const second = findCandidateBase(podium.second);
    const third = findCandidateBase(podium.third);
    return [
      'Mi Ranking Final - Capibarismo',
      `1. ${first?.nombre ?? podium.first}`,
      `2. ${second?.nombre ?? podium.second}`,
      `3. ${third?.nombre ?? podium.third}`,
    ].join('\n');
  };

  const handleShare = async () => {
    setSharing(true);
    const shareText = buildShareText();
    const shareUrl = 'https://capibarismo.com';

    try {
      // Try screenshot + file share (iOS 15+, Android, Windows 11)
      if (captureRef.current) {
        try {
          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(captureRef.current, {
            backgroundColor: '#0f172a',
            scale: 2,
            useCORS: true,
            allowTaint: false,
          });

          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );

          if (blob) {
            const file = new File([blob], 'mi-torneo-capibarismo.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
              await navigator.share({ text: shareText, url: shareUrl, files: [file] });
              return;
            }

            // Desktop: download image (only when native share is unavailable)
            if (!navigator.share) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'mi-torneo-capibarismo.png';
              a.click();
              URL.revokeObjectURL(url);
              return;
            }
          }
        } catch {
          // html2canvas failed — fall through to text share
        }
      }

      // Text + URL share — works reliably on all mobile browsers
      if (navigator.share) {
        await navigator.share({ text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      }
    } catch {
      // User cancelled or not supported
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen fighting-game-bg flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Capturable area for screenshot */}
      <div ref={captureRef} className="bg-slate-950 rounded-xl p-6 sm:p-8 max-w-sm w-full">
        {/* GAME OVER title */}
        <motion.h1
          initial={reducedMotion ? {} : { scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-wider mb-8 sm:mb-10 text-center animate-color-cycle"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          TU RANKING FINAL
        </motion.h1>

        {/* Podium entries */}
        <div className="w-full space-y-6 sm:space-y-8 mb-4">
          {PODIUM_CONFIG.map((config, index) => {
            const candidateId = podium[config.key];
            const candidate = findCandidateBase(candidateId);

            return (
              <motion.div
                key={config.key}
                initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.3 + index * 0.2 }}
                className="flex items-center gap-4"
              >
                <span
                  className={cn('text-lg sm:text-xl font-bold', config.color)}
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  {config.rank}
                </span>

                <div className={cn(
                  'rounded-full overflow-hidden border-3 flex-shrink-0',
                  config.borderColor,
                  config.glow,
                  config.size,
                )}>
                  {candidate?.headshot ? (
                    <img
                      src={encodeURI(candidate.headshot)}
                      alt={candidate.nombre}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/40">?</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm sm:text-base leading-tight">
                    {candidate?.nombre ?? candidateId}
                  </p>
                  <p className={cn('text-[10px] sm:text-xs font-bold uppercase tracking-wider', config.color)}
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  >
                    {config.label}
                  </p>
                  {candidate?.partido && (
                    <p className="text-white/50 text-[10px] sm:text-xs mt-0.5 truncate">
                      {candidate.partido}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Watermark for screenshot */}
        <p className="text-center text-white/30 text-[9px] mt-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          capibarismo.com
        </p>
      </div>

      {/* CTAs - outside capture area */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 1.2 }}
        className="w-full max-w-xs space-y-3 mt-6"
      >
        <Button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 text-sm border-2 border-white/20 hover:border-white/50 shadow-[0_4px_0_rgb(0,0,0,0.5)] hover:shadow-[0_2px_0_rgb(0,0,0,0.5)] hover:translate-y-[2px] transition-all uppercase tracking-wider"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.5rem, 2vw, 0.7rem)' }}
        >
          JUGAR DE NUEVO
        </Button>
        <Button
          onClick={handleShare}
          disabled={sharing}
          variant="outline"
          className="w-full border-white/20 hover:bg-white/10 text-white py-3 text-xs uppercase tracking-wider"
        >
          {sharing ? 'CAPTURANDO...' : 'COMPARTIR'}
        </Button>
      </motion.div>
    </div>
  );
}
