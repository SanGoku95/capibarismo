import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
import { TagPill } from './TagPill';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidatePicker } from './CandidatePicker';

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
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div className={cn(
          "p-3 md:p-4 rounded-lg break-words",
          hasLeftCandidate ? "candidate-panel-left text-white" : "bg-muted/20 border border-muted text-muted-foreground italic"
        )}>
          {leftContent}
        </div>
        <div className={cn(
          "p-3 md:p-4 rounded-lg break-words", 
          hasRightCandidate ? "candidate-panel-right text-white" : "bg-muted/20 border border-muted text-muted-foreground italic"
        )}>
          {rightContent}
        </div>
      </div>
    </div>
  );
}

export function CandidateComparisonGrid({ leftCandidate, rightCandidate }: CandidateComparisonGridProps) {
  const hasSelection = leftCandidate || rightCandidate;

  return (
    <div className="fighting-game-bg flex flex-col h-screen overflow-hidden">
      {/* Fighting Game Header */}
      <div className="flex-shrink-0 sticky top-0 z-10 fighting-game-header backdrop-blur-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 items-center py-2 px-2 md:py-4 md:px-6">
          {/* Left Candidate */}
          <div className="text-right min-w-0">
            {leftCandidate ? (
              <>
                <Link to={`/candidate/${leftCandidate.id}`} className="font-bold text-xs md:text-lg text-white truncate hover:underline">{leftCandidate.nombre}</Link>
                <div className="hidden md:block text-sm text-team-left font-medium truncate">{leftCandidate.ideologia}</div>
              </>
            ) : (
              <span className="text-xs md:text-sm text-gray-400">Selecciona Candidato</span>
            )}
          </div>
          
          {/* VS Center */}
          <div className="fighting-game-vs text-2xl md:text-4xl">
            VS
          </div>
          
          {/* Right Candidate */}
          <div className="text-left min-w-0">
            {rightCandidate ? (
              <>
                <Link to={`/candidate/${rightCandidate.id}`} className="font-bold text-xs md:text-lg text-white truncate hover:underline">{rightCandidate.nombre}</Link>
                <div className="hidden md:block text-sm text-team-right font-medium truncate">{rightCandidate.ideologia}</div>
              </>
            ) : (
              <span className="text-xs md:text-sm text-gray-400">Selecciona Candidato</span>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Sections (conditionally rendered and scrollable) */}
      <main className="flex-grow overflow-y-auto px-4 md:px-6 pb-40 lg:pb-6">
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <ComparisonSection
              title="Propuesta Principal"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                <div className="text-base font-sans leading-relaxed">
                  {leftCandidate?.summary || "Selecciona un candidato"}
                </div>
              }
              rightContent={
                <div className="text-base font-sans leading-relaxed">
                  {rightCandidate?.summary || "Selecciona un candidato"}
                </div>
              }
            />
            
            <ComparisonSection
              title="Ocupación"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                <div className="text-base font-sans font-medium">
                  {leftCandidate?.profession || "No especificada"}
                </div>
              }
              rightContent={
                <div className="text-base font-sans font-medium">
                  {rightCandidate?.profession || "No especificada"}
                </div>
              }
            />
            
            <ComparisonSection
              title="Ideología"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                <div className="text-base font-sans font-medium">
                  {leftCandidate?.ideologia || "No especificada"}
                </div>
              }
              rightContent={
                <div className="text-base font-sans font-medium">
                  {rightCandidate?.ideologia || "No especificada"}
                </div>
              }
            />
            
            <ComparisonSection
              title="Creencias Clave"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                leftCandidate ? (
                  <div className="flex flex-wrap gap-2">
                    {leftCandidate.keyBeliefs.slice(0, 4).map((belief, index) => (
                      <TagPill key={index} variant="belief" className="text-sm font-sans">
                        {belief}
                      </TagPill>
                    ))}
                  </div>
                ) : <span className="font-sans">No especificadas</span>
              }
              rightContent={
                rightCandidate ? (
                  <div className="flex flex-wrap gap-2">
                    {rightCandidate.keyBeliefs.slice(0, 4).map((belief, index) => (
                      <TagPill key={index} variant="belief" className="text-sm font-sans">
                        {belief}
                      </TagPill>
                    ))}
                  </div>
                ) : <span className="font-sans">No especificadas</span>
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
                      <div key={index} className="text-base font-sans border-l-2 border-team-left/50 pl-3 text-foreground/80">
                        {clip.title}
                      </div>
                    ))}
                  </div>
                ) : <span className="font-sans">Sin contenido</span>
              }
              rightContent={
                rightCandidate ? (
                  <div className="space-y-3">
                    {rightCandidate.clips.slice(0, 3).map((clip, index) => (
                      <div key={index} className="text-base font-sans border-l-2 border-team-right/50 pl-3 text-foreground/80">
                        {clip.title}
                      </div>
                    ))}
                  </div>
                ) : <span className="font-sans">Sin contenido</span>
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
                      <div key={index} className="border-l-2 border-team-left/50 pl-3 font-sans">
                        <div className="font-medium text-base text-foreground">{position.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.from} - {position.to}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <span className="font-sans">Sin experiencia registrada</span>
              }
              rightContent={
                rightCandidate ? (
                  <div className="space-y-3">
                    {rightCandidate.powerMap.slice(0, 3).map((position, index) => (
                      <div key={index} className="border-l-2 border-team-right/50 pl-3 font-sans">
                        <div className="font-medium text-base text-foreground">{position.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.from} - {position.to}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <span className="font-sans">Sin experiencia registrada</span>
              }
            />
          </motion.div>
        )}
      </main>

      {/* Candidate Picker (Footer) */}
      <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-20">
        <CandidatePicker />
      </div>
    </div>
  );
}