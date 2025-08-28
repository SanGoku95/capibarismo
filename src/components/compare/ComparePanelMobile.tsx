import { motion } from 'framer-motion';
import { memo } from 'react';
import { Candidate } from '@/data/candidates';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidatePicker } from './CandidatePicker';
import { SocialIcon } from '../common/SocialIcon';
import { PLAYER_INDICATORS, UI_CLASSES, type CandidateSide } from '@/lib/constants';

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

const ComparisonSection = memo(function ComparisonSection({ title, sectionId, leftCandidate, rightCandidate, leftContent, rightContent }: ComparisonSectionProps) {
  const hasLeftCandidate = leftCandidate !== null;
  const hasRightCandidate = rightCandidate !== null;
  const leftConfig = PLAYER_INDICATORS.left;
  const rightConfig = PLAYER_INDICATORS.right;
  
  return (
    <div className="fighting-game-section p-4 mb-4">
      <h3 className="section-title text-base font-bold mb-4 text-center">
        {title}
      </h3>
      <div className={UI_CLASSES.GRID_TWO_COLS}>
        <div className={cn(
          "p-3 md:p-4 rounded-lg",
          UI_CLASSES.BREAK_WORDS,
          hasLeftCandidate ? `${leftConfig.panelColor} text-white` : "bg-muted/20 border border-muted text-muted-foreground italic"
        )}>
          {leftContent}
        </div>
        <div className={cn(
          "p-3 md:p-4 rounded-lg", 
          UI_CLASSES.BREAK_WORDS,
          hasRightCandidate ? `${rightConfig.panelColor} text-white` : "bg-muted/20 border border-muted text-muted-foreground italic"
        )}>
          {rightContent}
        </div>
      </div>
    </div>
  );
});

export function CandidateComparisonGrid({ leftCandidate, rightCandidate }: CandidateComparisonGridProps) {
  const hasSelection = leftCandidate || rightCandidate;

  return (
    <div className="fighting-game-bg-compare flex flex-col h-screen overflow-hidden">
      {/* Scrollable content */}
      <main className="flex-grow overflow-y-auto px-4 md:px-6 pb-40 lg:pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Character Images at Top */}
          <div className="py-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Character */}
              <div className="flex flex-col items-center">
                {leftCandidate ? (
                  <>
                    <img
                      src={leftCandidate.fullBody}
                      alt={`${leftCandidate.nombre} full body`}
                      className="w-24 h-40 md:w-32 md:h-48 object-cover rounded shadow-lg mb-2"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
                      }}
                    />
                    <Link to={`/candidate/${leftCandidate.id}`} className="font-bold text-sm md:text-base text-white text-center hover:underline">{leftCandidate.nombre}</Link>
                    <div className="text-xs md:text-sm text-team-left font-medium text-center">{leftCandidate.ideologia}</div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-40 md:w-32 md:h-48 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
                      <span className="text-sm text-muted-foreground font-bold">P1</span>
                    </div>
                    <span className="text-xs text-gray-400">Selecciona Candidato</span>
                  </div>
                )}
              </div>
              
              {/* Right Character */}
              <div className="flex flex-col items-center">
                {rightCandidate ? (
                  <>
                    <img
                      src={rightCandidate.fullBody}
                      alt={`${rightCandidate.nombre} full body`}
                      className="w-24 h-40 md:w-32 md:h-48 object-cover rounded shadow-lg mb-2 scale-x-[-1]"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
                      }}
                    />
                    <Link to={`/candidate/${rightCandidate.id}`} className="font-bold text-sm md:text-base text-white text-center hover:underline">{rightCandidate.nombre}</Link>
                    <div className="text-xs md:text-sm text-team-right font-medium text-center">{rightCandidate.ideologia}</div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-40 md:w-32 md:h-48 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
                      <span className="text-sm text-muted-foreground font-bold">P2</span>
                    </div>
                    <span className="text-xs text-gray-400">Selecciona Candidato</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comparison Sections */}
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
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
                      ? leftCandidate.creenciasClave.slice(0, 3).map(c => <Link key={c.id} to={`/candidate/${leftCandidate?.id}#creencia-${c.id}`} className="text-sm text-muted-foreground hover:underline">{c.nombre}</Link>)
                      : <span className="text-sm text-muted-foreground">No especificadas</span>}
                  </div>
                }
                rightContent={
                  <div className="flex flex-wrap gap-2">
                    {rightCandidate
                      ? rightCandidate.creenciasClave.slice(0, 3).map(c => <Link key={c.id} to={`/candidate/${rightCandidate?.id}#creencia-${c.id}`} className="text-sm text-muted-foreground hover:underline">{c.nombre}</Link>)
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
                  leftCandidate ? (
                    <Link to={`/candidate/${leftCandidate.id}#presencia-digital`} className="font-sans text-sm text-muted-foreground hover:underline">
                    {leftCandidate.presenciaDigital.plataformas.length > 0
                      ? `Activo en: ${leftCandidate.presenciaDigital.plataformas.map(p => p.nombre).join(', ')}`
                      : "Sin presencia digital registrada"}
                    </Link>
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
                }
                rightContent={
                  rightCandidate ? (
                    <Link to={`/candidate/${rightCandidate.id}#presencia-digital`} className="font-sans text-sm text-muted-foreground hover:underline">
                    {rightCandidate.presenciaDigital.plataformas.length > 0
                      ? `Activo en: ${rightCandidate.presenciaDigital.plataformas.map(p => p.nombre).join(', ')}`
                      : "Sin presencia digital registrada"}
                    </Link>
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
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
                      <div><span className="font-semibold text-foreground">Alianzas:</span> {leftCandidate.mapaDePoder.alianzas.slice(0, 1).map(a => a.nombre).join(', ')}...</div>
                      <div><span className="font-semibold text-foreground">Seguidores:</span> {leftCandidate.mapaDePoder.seguidores}</div>
                    </Link>
                  ) : <span className="font-sans">Sin datos</span>
                }
                rightContent={
                  rightCandidate ? (
                    <Link to={`/candidate/${rightCandidate.id}#mapa-de-poder`} className="font-sans text-sm space-y-1 text-muted-foreground hover:underline">
                      <div><span className="font-semibold text-foreground">Alianzas:</span> {rightCandidate.mapaDePoder.alianzas.slice(0, 1).map(a => a.nombre).join(', ')}...</div>
                      <div><span className="font-semibold text-foreground">Seguidores:</span> {rightCandidate.mapaDePoder.seguidores}</div>
                    </Link>
                  ) : <span className="font-sans">Sin datos</span>
                }
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Candidate Picker (Footer) */}
      <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-20">
        <CandidatePicker />
      </div>
    </div>
  );
}