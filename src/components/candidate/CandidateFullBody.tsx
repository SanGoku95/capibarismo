import { motion } from 'framer-motion';
import type { CandidateBase } from '@/data/types';

interface CandidateFullBodyProps {
  candidate: CandidateBase | null;
  side: 'left' | 'right';
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
