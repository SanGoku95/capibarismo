import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface RoundIntroModalProps {
  roundIndex: 0 | 1 | 2;
  onDismiss: () => void;
}

const ROUND_CONTENT = [
  {
    icon: '⚔️',
    title: 'ARENA POLÍTICA',
    subtitle: '36 candidatos se enfrentan en un torneo de eliminación.',
    roundLabel: 'Ronda 1',
    detail: 'Elige 1 de cada grupo de 3 (12 grupos)',
    civicBox: {
      heading: 'Vota con criterio, no por rechazo',
      body: 'Tu voto es tu voz. Infórmate, compara y elige al candidato que mejor represente tus valores.',
    },
    buttonLabel: '¡EMPEZAR!',
  },
  {
    icon: '⚡',
    title: 'RONDA 2',
    subtitle: '12 candidatos continúan la batalla.',
    roundLabel: 'Ronda 2',
    detail: 'Elige 1 de cada grupo de 3 (4 grupos)',
    civicBox: {
      heading: '¡Vas bien! Sigue votando con criterio',
      body: 'Quedan 4 decisiones. Elige al candidato que mejor represente tus valores.',
    },
    buttonLabel: '¡CONTINUAR!',
  },
  {
    icon: '🏆',
    title: '¡SEMIFINAL!',
    subtitle: '4 finalistas listos para el duelo.',
    roundLabel: 'Semifinal + Gran Final',
    detail: '2 duelos 1vs1 · Luego la Gran Final',
    civicBox: {
      heading: 'El final está cerca',
      body: 'Tras la Semifinal, los 2 ganadores se enfrentan en la Gran Final. Tu candidato #1 está a 3 decisiones.',
    },
    buttonLabel: '¡A LUCHAR!',
  },
] as const;

const TOTAL_SECONDS = 10;

export function RoundIntroModal({ roundIndex, onDismiss }: RoundIntroModalProps) {
  const [countdown, setCountdown] = useState(TOTAL_SECONDS);
  const content = ROUND_CONTENT[roundIndex];

  const stableOnDismiss = useCallback(() => onDismiss(), [onDismiss]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          stableOnDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stableOnDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(10, 6, 30, 0.92)', backdropFilter: 'blur(4px)' }}
    >
      <div className="relative w-full max-w-sm">
        {/* Arcade border glow */}
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-yellow-400 via-purple-500 to-pink-500 opacity-70" />
        <div className="relative rounded-2xl bg-[#0f0a1e] p-6 flex flex-col items-center gap-4 text-center">

          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center text-2xl">
            {content.icon}
          </div>

          {/* Title */}
          <h2
            className="text-yellow-400 text-sm sm:text-base font-bold uppercase tracking-widest leading-tight"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            {content.title}
          </h2>

          {/* Subtitle */}
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
            {content.subtitle}
          </p>

          {/* Round label + detail */}
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-white text-base sm:text-lg font-bold"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              {content.roundLabel}
            </span>
            <span className="text-white/50 text-xs sm:text-sm">{content.detail}</span>
          </div>

          {/* Civic message box */}
          <div className="w-full rounded-xl border border-purple-500/40 bg-purple-900/30 px-4 py-3 text-left">
            <p className="text-purple-200 text-[11px] sm:text-xs font-bold mb-1">
              {content.civicBox.heading}
            </p>
            <p className="text-white/60 text-[10px] sm:text-[11px] leading-relaxed">
              {content.civicBox.body}
            </p>
          </div>

          {/* Start button */}
          <button
            onClick={stableOnDismiss}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-white text-xs sm:text-sm
              bg-gradient-to-r from-purple-600 to-pink-600
              hover:from-purple-500 hover:to-pink-500
              border-2 border-white/20 hover:border-white/50
              shadow-[0_4px_0_rgb(0,0,0,0.5)] hover:shadow-[0_2px_0_rgb(0,0,0,0.5)]
              hover:translate-y-[2px] transition-all
              flex items-center justify-center gap-2"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.5rem, 2vw, 0.7rem)' }}
          >
            🎮 {content.buttonLabel}
          </button>

          {/* Countdown */}
          <motion.span
            key={countdown}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-white/30 text-[10px] tabular-nums"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Auto en {countdown}s
          </motion.span>

        </div>
      </div>
    </motion.div>
  );
}
