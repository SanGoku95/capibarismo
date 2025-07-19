
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
        <div className="text-center p-8">
          <div className="w-36 h-36 mx-auto bg-muted rounded-2xl flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              {side === 'left' ? 'Candidato 1' : 'Candidato 2'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center h-full"
    >
      <div className="text-center">
        {/* Desktop only - full body image */}
        <img
          src={candidate.fullBody}
          alt={`Imagen completa de ${candidate.nombre}`}
          className="mx-auto w-36 object-contain rounded-2xl shadow-lg"
          aria-label={`Imagen de cuerpo entero de ${candidate.nombre}`}
        />
        <h3 className="mt-2 text-sm font-semibold text-center">
          {candidate.nombre}
        </h3>
      </div>
    </motion.div>
  );
}
