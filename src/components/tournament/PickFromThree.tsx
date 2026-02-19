import { motion, AnimatePresence } from 'framer-motion';
import { CandidateCard } from '@/components/game/CandidateCard';
import { useGameUIStore } from '@/store/useGameUIStore';
import { findCandidateBase } from '@/data';
import type { CandidateBase } from '@/data/types';

interface PickFromThreeProps {
  candidateIds: string[];
  onSelect: (winnerId: string) => void;
  groupIndex?: number;
  totalGroups?: number;
  disabled?: boolean;
}

export function PickFromThree({
  candidateIds,
  onSelect,
  groupIndex,
  totalGroups,
  disabled,
}: PickFromThreeProps) {
  const { reducedMotion } = useGameUIStore();

  const candidates = candidateIds
    .map((id) => findCandidateBase(id))
    .filter((c): c is CandidateBase => c !== undefined);

  const title = 'ELIGE A TU FAVORITO';

  const subtitle = groupIndex !== undefined && totalGroups
    ? `Grupo ${groupIndex + 1} de ${totalGroups}`
    : undefined;

  return (
    <div className="relative w-full min-h-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      {/* Title */}
      <div className="text-center mb-4 sm:mb-6">
        <h2
          className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-accent"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/60 text-[10px] sm:text-xs mt-1 sm:mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Candidates */}
      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={candidateIds.join('-')}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
            className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-8"
          >
            {candidates.map((candidate, i) => (
              <div
                key={candidate.id}
                className={i === 2 ? 'col-span-2 sm:col-span-1 flex justify-center' : ''}
              >
                <div className={i === 2 ? 'w-1/2 sm:w-full' : 'w-full'}>
                  <CandidateCard
                    candidate={candidate}
                    side="left"
                    onSelect={() => onSelect(candidate.id)}
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
