import { useState, useEffect, useCallback } from 'react';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset when new group loads
  useEffect(() => {
    setSelectedId(null);
  }, [candidateIds.join('-')]);

  const handleSelect = useCallback((candidateId: string) => {
    if (selectedId || disabled) return;
    setSelectedId(candidateId);
    setTimeout(() => onSelect(candidateId), reducedMotion ? 100 : 800);
  }, [selectedId, disabled, onSelect, reducedMotion]);

  const candidates = candidateIds
    .map((id) => findCandidateBase(id))
    .filter((c): c is CandidateBase => c !== undefined);

  const title = 'ELIGE A TU FAVORITO';

  const subtitle = groupIndex !== undefined && totalGroups
    ? `Grupo ${groupIndex + 1} de ${totalGroups}`
    : undefined;

  return (
    <div className="relative w-full min-h-full flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 pb-6 sm:pb-8">
      {/* Title */}
      <div className="text-center mb-6 sm:mb-6">
        <h2
          className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-accent mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/60 text-[11px] sm:text-xs">
            {subtitle}
          </p>
        )}
      </div>

      {/* Candidates - optimized grid for mobile */}
      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={candidateIds.join('-')}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8"
          >
            {candidates.map((candidate) => (
              <div key={candidate.id} className="w-full">
                <CandidateCard
                  candidate={candidate}
                  side="left"
                  onSelect={() => handleSelect(candidate.id)}
                  disabled={disabled || !!selectedId}
                  voteState={
                    selectedId === candidate.id ? 'winner'
                    : selectedId !== null ? 'loser'
                    : undefined
                  }
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
