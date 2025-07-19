import { motion } from 'framer-motion';
import { candidates } from '@/data/candidates';
import { useCompareStore } from '@/store/useCompareStore';
import { cn } from '@/lib/utils';

export function CandidatePicker() {
  const { leftCandidate, rightCandidate, selectCandidate } = useCompareStore();

  const isSelected = (candidateId: string) => {
    return leftCandidate?.id === candidateId || rightCandidate?.id === candidateId;
  };

  const getSelectedSide = (candidateId: string) => {
    if (leftCandidate?.id === candidateId) return 'left';
    if (rightCandidate?.id === candidateId) return 'right';
    return null;
  };

  return (
    <div className="w-full bg-card border-t border-border">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Candidatos 2026</h2>
          <div className="text-sm text-muted-foreground">
            {candidates.length} candidatos
          </div>
        </div>
        
        {/* Mobile: Horizontal scroll */}
        <div className="lg:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {candidates.map((candidate) => {
              const selected = isSelected(candidate.id);
              const side = getSelectedSide(candidate.id);
              
              return (
                <motion.button
                  key={candidate.id}
                  onClick={() => selectCandidate(candidate)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex-shrink-0 p-2 rounded-2xl border-2 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    selected
                      ? side === 'left'
                        ? "border-team-left bg-team-left/10"
                        : "border-team-right bg-team-right/10"
                      : "border-border hover:border-primary"
                  )}
                  aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
                  tabIndex={0}
                >
                  <div className="text-center">
                    <img
                      src={candidate.headshot}
                      alt={`Retrato de ${candidate.nombre}`}
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                    <div className="mt-1 text-xs font-medium max-w-[64px] truncate">
                      {candidate.nombre.split(' ')[0]}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-10 gap-3">
          {candidates.map((candidate) => {
            const selected = isSelected(candidate.id);
            const side = getSelectedSide(candidate.id);
            
            return (
              <motion.button
                key={candidate.id}
                onClick={() => selectCandidate(candidate)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-3 rounded-2xl border-2 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  selected
                    ? side === 'left'
                      ? "border-team-left bg-team-left/10"
                      : "border-team-right bg-team-right/10"
                    : "border-border hover:border-primary"
                )}
                aria-label={`Seleccionar a ${candidate.nombre} para comparar`}
                tabIndex={0}
              >
                <div className="text-center">
                  <img
                    src={candidate.headshot}
                    alt={`Retrato de ${candidate.nombre}`}
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                  />
                  <div className="mt-2 text-xs font-medium">
                    {candidate.nombre.split(' ')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {candidate.nombre.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}