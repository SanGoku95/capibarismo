import { motion, AnimatePresence } from 'framer-motion';
import { CandidateCard } from './CandidateCard';
import { useGameUIStore } from '@/store/useGameUIStore';
import { cn } from '@/lib/utils';

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
  const { retroEffects, reducedMotion } = useGameUIStore();
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
      {/* VS Logo in center */}
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
            'text-4xl sm:text-6xl md:text-7xl font-bold',
            'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-red-500',
            retroEffects && 'drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]'
          )}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            WebkitTextStroke: '2px white',
          }}
        >
          VS
        </motion.div>
      </div>
      
      {/* Candidates */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
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
      
      {/* Scanline effect (optional) */}
      {retroEffects && (
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 2px, transparent 4px)',
            opacity: 0.3,
          }}
        />
      )}
    </div>
  );
}
