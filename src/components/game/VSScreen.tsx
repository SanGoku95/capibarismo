import { motion, AnimatePresence } from 'framer-motion';
import { CandidateCard } from './CandidateCard';
import { useGameUIStore } from '@/store/useGameUIStore';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { DonationModal } from '../common/DonationModal';
import { usePostHog } from '@/lib/posthog';

interface VSScreenProps {
  pair: {
    pairId: string;
    a: {
      id: string;
      nombre: string;
      ideologia?: string;
      fullBody?: string;
      headshot?: string;
      partyIcon?: string;
      partido?: string;
    };
    b: {
      id: string;
      nombre: string;
      ideologia?: string;
      fullBody?: string;
      headshot?: string;
      partyIcon?: string;
      partido?: string;
    };
  };
  onVote: (winner: 'A' | 'B') => void;
  isSubmitting?: boolean;
  roundLabel?: string;
}

export function VSScreen({ pair, onVote, isSubmitting, roundLabel }: VSScreenProps) {
  const { reducedMotion } = useGameUIStore();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [voteResult, setVoteResult] = useState<{ winner: 'A' | 'B' } | null>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();

  // Reset vote result when pair changes
  useEffect(() => {
    setVoteResult(null);
  }, [pair.pairId]);

  // Fire confetti on vote
  useEffect(() => {
    if (!voteResult || reducedMotion) return;

    let cancelled = false;
    const fireConfetti = async () => {
      const confetti = (await import('canvas-confetti')).default;
      if (cancelled) return;
      const ref = voteResult.winner === 'A' ? leftCardRef : rightCardRef;
      const rect = ref.current?.getBoundingClientRect();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const originY = rect ? (rect.top + rect.height / 3) / window.innerHeight : 0.5;
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#facc15', '#f59e0b', '#ffffff'],
        disableForReducedMotion: true,
      });
    };
    fireConfetti();

    return () => { cancelled = true; };
  }, [voteResult, reducedMotion]);

  const handleVote = useCallback((side: 'A' | 'B') => {
    if (voteResult || isSubmitting) return;
    setVoteResult({ winner: side });

    setTimeout(() => {
      onVote(side);
    }, reducedMotion ? 100 : 800);
  }, [voteResult, isSubmitting, onVote, reducedMotion]);

  const springTransition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 300, damping: 25 };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      {/* Round label above VS */}
      {roundLabel && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <span
            className="text-[8px] sm:text-[10px] text-white/60 uppercase tracking-widest"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            {roundLabel}
          </span>
        </div>
      )}

      {/* VS Logo in center - continuous pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <motion.div
          initial={reducedMotion ? {} : { scale: 0, rotate: -180 }}
          animate={reducedMotion ? { scale: 1, rotate: 0 } : {
            scale: [1, 1.1, 1],
            rotate: 0,
          }}
          transition={reducedMotion ? { duration: 0 } : {
            scale: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
            rotate: { type: 'spring', duration: 0.3 },
          }}
          className={cn(
            'text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold',
            'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-red-500',
            'drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]'
          )}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            WebkitTextStroke: '1px white',
          }}
        >
          VS
        </motion.div>
      </div>

      {/* Candidates - slide in from sides */}
      <div className="relative w-full max-w-7xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pair.pairId}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.1 }}
            className="w-full grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 lg:gap-16 items-center"
          >
            {/* Left candidate - slides from left */}
            <motion.div
              ref={leftCardRef}
              initial={reducedMotion ? {} : { x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reducedMotion ? {} : { x: '-100%', opacity: 0 }}
              transition={springTransition}
            >
              <CandidateCard
                candidate={pair.a}
                side="left"
                onSelect={() => handleVote('A')}
                disabled={isSubmitting || !!voteResult}
                voteState={voteResult ? (voteResult.winner === 'A' ? 'winner' : 'loser') : undefined}
                allCandidateIds={[pair.a.id, pair.b.id]}
              />
            </motion.div>

            {/* Right candidate - slides from right */}
            <motion.div
              ref={rightCardRef}
              initial={reducedMotion ? {} : { x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reducedMotion ? {} : { x: '100%', opacity: 0 }}
              transition={springTransition}
            >
              <CandidateCard
                candidate={pair.b}
                side="right"
                onSelect={() => handleVote('B')}
                disabled={isSubmitting || !!voteResult}
                voteState={voteResult ? (voteResult.winner === 'B' ? 'winner' : 'loser') : undefined}
                allCandidateIds={[pair.a.id, pair.b.id]}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Yape support button - mobile only */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 sm:hidden w-full max-w-sm px-4"
      >
        <button
          onClick={() => {
            setShowDonationModal(true);
            posthog?.capture('donation_click', { source: 'vs_screen_mobile' });
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm px-3 py-2 text-xs text-white/70 transition-all duration-200 hover:bg-black/60 hover:text-white hover:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Apoya el proyecto con Yape"
        >
          <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
          <span>Apoya con Yape</span>
        </button>
      </motion.div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </div>
  );
}
