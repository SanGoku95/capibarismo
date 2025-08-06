import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidatePicker } from './CandidatePicker';

interface CandidateComparisonGridProps {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
}

interface ComparisonSectionProps {
  title: string;
  sectionId: string;
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

function ComparisonSection({ title, sectionId, leftCandidate, rightCandidate, leftContent, rightContent }: ComparisonSectionProps) {
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
              title="Proyecto Político"
              sectionId="proyecto-politico"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                <Link to={`/candidate/${leftCandidate?.id}#proyecto-politico`} className="text-base font-sans leading-relaxed block hover:bg-white/5 p-2 -m-2 rounded-md">
                  <div className="font-bold text-foreground">{leftCandidate?.proyectoPolitico.titulo}</div>
                  <div className="text-sm text-muted-foreground line-clamp-3 mt-1">{leftCandidate?.proyectoPolitico.resumen || "Selecciona un candidato"}</div>
                </Link>
              }
              rightContent={
                <Link to={`/candidate/${rightCandidate?.id}#proyecto-politico`} className="text-base font-sans leading-relaxed block hover:bg-white/5 p-2 -m-2 rounded-md">
                  <div className="font-bold text-foreground">{rightCandidate?.proyectoPolitico.titulo}</div>
                  <div className="text-sm text-muted-foreground line-clamp-3 mt-1">{rightCandidate?.proyectoPolitico.resumen || "Selecciona un candidato"}</div>
                </Link>
              }
            />
            
            <ComparisonSection
              title="Creencias Clave"
              sectionId="creencias-clave"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                <div className="flex flex-wrap gap-2">
                  {leftCandidate
                    ? leftCandidate.creenciasClave.slice(0, 3).map(b => <Link key={b} to={`/candidate/${leftCandidate?.id}#creencia-${b.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-muted-foreground hover:underline">{b}</Link>)
                    : <span className="text-sm text-muted-foreground">No especificadas</span>}
                </div>
              }
              rightContent={
                <div className="flex flex-wrap gap-2">
                  {rightCandidate
                    ? rightCandidate.creenciasClave.slice(0, 3).map(b => <Link key={b} to={`/candidate/${rightCandidate?.id}#creencia-${b.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-muted-foreground hover:underline">{b}</Link>)
                    : <span className="text-sm text-muted-foreground">No especificadas</span>}
                </div>
              }
            />

            <ComparisonSection
              title="Bio / Trayectoria"
              sectionId="trayectoria"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                leftCandidate ? (
                  <div className="space-y-3">
                    {leftCandidate.trayectoria.slice(0, 2).map((position) => (
                      <Link to={`/candidate/${leftCandidate?.id}#${position.id}`} key={position.id} className="block border-l-2 border-team-left/50 pl-3 font-sans hover:bg-white/5 rounded-r-md">
                        <div className="font-medium text-base text-foreground">{position.rol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.periodo}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : <span className="font-sans">Sin experiencia registrada</span>
              }
              rightContent={
                rightCandidate ? (
                  <div className="space-y-3">
                    {rightCandidate.trayectoria.slice(0, 2).map((position) => (
                      <Link to={`/candidate/${rightCandidate?.id}#${position.id}`} key={position.id} className="block border-l-2 border-team-right/50 pl-3 font-sans hover:bg-white/5 rounded-r-md">
                        <div className="font-medium text-base text-foreground">{position.rol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.periodo}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : <span className="font-sans">Sin experiencia registrada</span>
              }
            />

            <ComparisonSection
              title="Presencia en Medios"
              sectionId="presencia-digital"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                <Link to={`/candidate/${leftCandidate?.id}#presencia-digital`} className="font-sans text-sm text-muted-foreground line-clamp-3 hover:underline">
                  {leftCandidate ? Object.entries(leftCandidate.presenciaDigital).map(([key, value]) => value).join(' ') : "Sin análisis"}
                </Link>
              }
              rightContent={
                <Link to={`/candidate/${rightCandidate?.id}#presencia-digital`} className="font-sans text-sm text-muted-foreground line-clamp-3 hover:underline">
                  {rightCandidate ? Object.entries(rightCandidate.presenciaDigital).map(([key, value]) => value).join(' ') : "Sin análisis"}
                </Link>
              }
            />
            
            <ComparisonSection
              title="Mapa de Poder"
              sectionId="mapa-de-poder"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                leftCandidate ? (
                  <Link to={`/candidate/${leftCandidate.id}#mapa-de-poder`} className="font-sans text-sm space-y-1 text-muted-foreground hover:underline">
                    <div><span className="font-semibold text-foreground">Alianzas:</span> {leftCandidate.mapaDePoder.alianzas.slice(0, 1).join(', ')}...</div>
                    <div><span className="font-semibold text-foreground">Seguidores:</span> {leftCandidate.mapaDePoder.seguidores}</div>
                  </Link>
                ) : <span className="font-sans">Sin datos</span>
              }
              rightContent={
                rightCandidate ? (
                  <Link to={`/candidate/${rightCandidate.id}#mapa-de-poder`} className="font-sans text-sm space-y-1 text-muted-foreground hover:underline">
                    <div><span className="font-semibold text-foreground">Alianzas:</span> {rightCandidate.mapaDePoder.alianzas.slice(0, 1).join(', ')}...</div>
                    <div><span className="font-semibold text-foreground">Seguidores:</span> {rightCandidate.mapaDePoder.seguidores}</div>
                  </Link>
                ) : <span className="font-sans">Sin datos</span>
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