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
          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 mx-auto bg-muted rounded-2xl flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              {side === 'left' ? 'Izquierda' : 'Derecha'}
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
        {/* Show headshot on very small screens, full body on larger screens */}
        <img
          src={candidate.headshot}
          alt={`Retrato de ${candidate.nombre}`}
          className="block sm:hidden w-20 h-20 mx-auto rounded-full object-cover shadow-lg"
          aria-label={`Foto de perfil de ${candidate.nombre}`}
        />
        <img
          src={candidate.fullBody}
          alt={`Imagen completa de ${candidate.nombre}`}
          className="hidden sm:block mx-auto w-20 md:w-28 lg:w-36 object-contain rounded-2xl shadow-lg"
          aria-label={`Imagen de cuerpo entero de ${candidate.nombre}`}
        />
        <h3 className="mt-2 text-sm font-semibold text-center">
          {candidate.nombre}
        </h3>
      </div>
    </motion.div>
  );
}