import { motion, AnimatePresence } from 'framer-motion';
import { CandidateCard } from './CandidateCard';
import { useGameUIStore } from '@/store/useGameUIStore';
import { cn } from '@/lib/utils';
import { Heart, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
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
    };
    b: {
      id: string;
      nombre: string;
      ideologia?: string;
      fullBody?: string;
    };
  };
  onVote: (winner: 'A' | 'B') => void;
  isSubmitting?: boolean;
}

export function VSScreen({ pair, onVote, isSubmitting }: VSScreenProps) {
  const { reducedMotion } = useGameUIStore();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const posthog = usePostHog();
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      {/* VS Logo in center - adjusted for mobile */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <motion.div
          initial={reducedMotion ? {} : { scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: reducedMotion ? 'tween' : 'spring',
            duration: reducedMotion ? 0 : 0.5,
            delay: reducedMotion ? 0 : 0.2,
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
      
      {/* Candidates - side by side on all screens */}
      <div className="w-full max-w-7xl grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 lg:gap-16 items-center">
        <AnimatePresence mode="wait">
          <CandidateCard
            key={pair.a.id}
            candidate={pair.a}
            side="left"
            onSelect={() => onVote('A')}
            disabled={isSubmitting}
          />
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <CandidateCard
            key={pair.b.id}
            candidate={pair.b}
            side="right"
            onSelect={() => onVote('B')}
            disabled={isSubmitting}
          />
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
