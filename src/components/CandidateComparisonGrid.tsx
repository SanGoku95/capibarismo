import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
import { TagPill } from './TagPill';
import { cn } from '@/lib/utils';

interface CandidateComparisonGridProps {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
}

interface ComparisonSectionProps {
  title: string;
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

function ComparisonSection({ title, leftCandidate, rightCandidate, leftContent, rightContent }: ComparisonSectionProps) {
  const hasLeftCandidate = leftCandidate !== null;
  const hasRightCandidate = rightCandidate !== null;
  
  return (
    <div className="fighting-game-section p-4 mb-4">
      <h3 className="section-title text-base font-bold mb-4 text-center">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className={cn(
          "p-4 rounded-lg",
          hasLeftCandidate ? "candidate-panel-left text-white" : "bg-muted/20 border border-muted text-muted-foreground italic"
        )}>
          {leftContent}
        </div>
        <div className={cn(
          "p-4 rounded-lg", 
          hasRightCandidate ? "candidate-panel-right text-white" : "bg-muted/20 border border-muted text-muted-foreground italic"
        )}>
          {rightContent}
        </div>
      </div>
    </div>
  );
}

export function CandidateComparisonGrid({ leftCandidate, rightCandidate }: CandidateComparisonGridProps) {
  return (
    <div className="fighting-game-bg min-h-screen">
      {/* Fighting Game Header */}
      <div className="sticky top-0 z-10 fighting-game-header backdrop-blur-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-4 px-6">
          {/* Left Candidate */}
          <div className="flex items-center gap-3 justify-end">
            {leftCandidate ? (
              <>
                <div className="text-right min-w-0">
                  <div className="font-bold text-lg text-white truncate">{leftCandidate.nombre}</div>
                  <div className="text-sm text-team-left font-medium">{leftCandidate.ideologia}</div>
                </div>
                <img
                  src={leftCandidate.headshot}
                  alt={leftCandidate.nombre}
                  className="w-12 h-12 rounded-full object-cover border-2 border-team-left shadow-lg"
                />
              </>
            ) : (
              <span className="text-sm text-gray-400">Selecciona Candidato</span>
            )}
          </div>
          
          {/* VS Center */}
          <div className="fighting-game-vs rounded-full w-16 h-16 flex items-center justify-center relative">
            <span className="text-lg font-black">VS</span>
          </div>
          
          {/* Right Candidate */}
          <div className="flex items-center gap-3">
            {rightCandidate ? (
              <>
                <img
                  src={rightCandidate.headshot}
                  alt={rightCandidate.nombre}
                  className="w-12 h-12 rounded-full object-cover border-2 border-team-right shadow-lg"
                />
                <div className="min-w-0">
                  <div className="font-bold text-lg text-white truncate">{rightCandidate.nombre}</div>
                  <div className="text-sm text-team-right font-medium">{rightCandidate.ideologia}</div>
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400">Selecciona Candidato</span>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Sections */}
      <div className="px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <ComparisonSection
            title="Propuesta Principal"
            leftCandidate={leftCandidate}
            rightCandidate={rightCandidate}
            leftContent={
              <div className="text-sm leading-relaxed">
                {leftCandidate?.summary || "Selecciona un candidato"}
              </div>
            }
            rightContent={
              <div className="text-sm leading-relaxed">
                {rightCandidate?.summary || "Selecciona un candidato"}
              </div>
            }
          />
          
          <ComparisonSection
            title="Ocupación"
            leftCandidate={leftCandidate}
            rightCandidate={rightCandidate}
            leftContent={
              <div className="text-sm font-medium">
                {leftCandidate?.profession || "No especificada"}
              </div>
            }
            rightContent={
              <div className="text-sm font-medium">
                {rightCandidate?.profession || "No especificada"}
              </div>
            }
          />
          
          <ComparisonSection
            title="Ideología"
            leftCandidate={leftCandidate}
            rightCandidate={rightCandidate}
            leftContent={
              <div className="text-sm font-medium">
                {leftCandidate?.ideologia || "No especificada"}
              </div>
            }
            rightContent={
              <div className="text-sm font-medium">
                {rightCandidate?.ideologia || "No especificada"}
              </div>
            }
          />
          
          <ComparisonSection
            title="Principales Creencias"
            leftCandidate={leftCandidate}
            rightCandidate={rightCandidate}
            leftContent={
              leftCandidate ? (
                <div className="flex flex-wrap gap-2">
                  {leftCandidate.keyBeliefs.slice(0, 4).map((belief, index) => (
                    <TagPill key={index} variant="belief" className="text-xs">
                      {belief}
                    </TagPill>
                  ))}
                </div>
              ) : "No especificadas"
            }
            rightContent={
              rightCandidate ? (
                <div className="flex flex-wrap gap-2">
                  {rightCandidate.keyBeliefs.slice(0, 4).map((belief, index) => (
                    <TagPill key={index} variant="belief" className="text-xs">
                      {belief}
                    </TagPill>
                  ))}
                </div>
              ) : "No especificadas"
            }
          />
          
          <ComparisonSection
            title="Contenido Reciente"
            leftCandidate={leftCandidate}
            rightCandidate={rightCandidate}
            leftContent={
              leftCandidate ? (
                <div className="space-y-3">
                  {leftCandidate.clips.slice(0, 3).map((clip, index) => (
                    <div key={index} className="text-sm border-l-2 border-team-left/50 pl-3 text-gray-300">
                      {clip.title}
                    </div>
                  ))}
                </div>
              ) : "Sin contenido"
            }
            rightContent={
              rightCandidate ? (
                <div className="space-y-3">
                  {rightCandidate.clips.slice(0, 3).map((clip, index) => (
                    <div key={index} className="text-sm border-l-2 border-team-right/50 pl-3 text-gray-300">
                      {clip.title}
                    </div>
                  ))}
                </div>
              ) : "Sin contenido"
            }
          />
          
          <ComparisonSection
            title="Experiencia Política"
            leftCandidate={leftCandidate}
            rightCandidate={rightCandidate}
            leftContent={
              leftCandidate ? (
                <div className="space-y-3">
                  {leftCandidate.powerMap.slice(0, 3).map((position, index) => (
                    <div key={index} className="border-l-2 border-team-left/50 pl-3">
                      <div className="font-medium text-sm text-white">{position.role}</div>
                      <div className="text-xs text-gray-400">
                        {position.from} - {position.to}
                      </div>
                    </div>
                  ))}
                </div>
              ) : "Sin experiencia registrada"
            }
            rightContent={
              rightCandidate ? (
                <div className="space-y-3">
                  {rightCandidate.powerMap.slice(0, 3).map((position, index) => (
                    <div key={index} className="border-l-2 border-team-right/50 pl-3">
                      <div className="font-medium text-sm text-white">{position.role}</div>
                      <div className="text-xs text-gray-400">
                        {position.from} - {position.to}
                      </div>
                    </div>
                  ))}
                </div>
              ) : "Sin experiencia registrada"
            }
          />
        </motion.div>
      </div>
    </div>
  );
}