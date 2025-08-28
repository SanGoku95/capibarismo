import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';

interface CandidateFullBodyProps {
  candidate: Candidate | null;
  side: 'left' | 'right';
}

export function CandidateFullBody({ candidate, side }: CandidateFullBodyProps) {
  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-muted-foreground text-lg font-bold">
          {side === 'left' ? '' : ''}
        </span>
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
      <img
        src={candidate.fullBody}
        alt={`${candidate.nombre} ready to fight`}
        className={`mx-auto w-72 h-96 object-cover ${
          side === 'left' 
            ? 'shadow-team-left/50' 
            : 'shadow-team-right/50 scale-x-[-1]'
        }`}
        style={{
          filter: 'drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3))'
        }}
        aria-label={`${candidate.nombre} en posición de combate`}
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
