import { motion } from 'framer-motion';

interface RoundIntroPageProps {
  roundIndex: 0 | 1 | 2;
  onStart: () => void;
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

export function RoundIntroPage({ roundIndex, onStart }: RoundIntroPageProps) {
  const content = ROUND_CONTENT[roundIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #0a061e 0%, #1a0f3a 50%, #0f0a1e 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Arcade border glow */}
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-yellow-400 via-purple-500 to-pink-500 opacity-70" />
          <div className="relative rounded-2xl bg-[#0f0a1e] p-8 flex flex-col items-center gap-6 text-center">

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center text-4xl"
            >
              {content.icon}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-yellow-400 text-base sm:text-lg font-bold uppercase tracking-widest leading-tight"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              {content.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm sm:text-base leading-relaxed"
            >
              {content.subtitle}
            </motion.p>

            {/* Round label + detail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="text-white text-lg sm:text-xl font-bold"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                {content.roundLabel}
              </span>
              <span className="text-white/50 text-sm">{content.detail}</span>
            </motion.div>

            {/* Civic message box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full rounded-xl border border-purple-500/40 bg-purple-900/30 px-5 py-4 text-left"
            >
              <p className="text-purple-200 text-xs sm:text-sm font-bold mb-2">
                {content.civicBox.heading}
              </p>
              <p className="text-white/60 text-xs leading-relaxed">
                {content.civicBox.body}
              </p>
            </motion.div>

            {/* Start button - optimized for mobile touch */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={onStart}
              className="w-full py-5 sm:py-4 rounded-xl font-bold uppercase tracking-widest text-white text-sm
                bg-gradient-to-r from-purple-600 to-pink-600
                active:from-purple-700 active:to-pink-700
                border-2 border-white/20 active:border-white/60
                shadow-[0_6px_0_rgb(0,0,0,0.5)] active:shadow-[0_2px_0_rgb(0,0,0,0.5)]
                active:translate-y-[4px]
                transition-all duration-150
                flex items-center justify-center gap-3
                touch-manipulation
                select-none"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              🎮 {content.buttonLabel}
            </motion.button>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
