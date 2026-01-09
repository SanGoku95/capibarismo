import { motion } from 'framer-motion';
import { memo } from 'react';
import type { CandidateBase } from '@/data/types';
import { trayectorias } from '@/data/domains/trayectorias';
import { GraduationCap, Building2, Landmark, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidatePicker } from './CandidatePicker';
import { PLAYER_INDICATORS, UI_CLASSES } from '@/lib/constants';
import { getCandidateProfile } from '@/data';
import { InfoBadge } from './InfoBadge';
import { severityProps, legalProps, severityHelp, legalHelp } from './controversy-utils';
import { CandidateFullBodyMedia } from '@/components/candidate/CandidateFullBody';

interface CandidateComparisonGridProps {
  leftCandidate: CandidateBase | null;
  rightCandidate: CandidateBase | null;
}

interface ComparisonSectionProps {
  title: string;
  sectionId: string;
  leftCandidate: CandidateBase | null;
  rightCandidate: CandidateBase | null;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const ComparisonSection = memo(function ComparisonSection({ title, sectionId, leftCandidate, rightCandidate, leftContent, rightContent }: ComparisonSectionProps) {
  const hasLeftCandidate = leftCandidate !== null;
  const hasRightCandidate = rightCandidate !== null;
  const leftConfig = PLAYER_INDICATORS.left;
  const rightConfig = PLAYER_INDICATORS.right;
  
  return (
    <div id={sectionId} className="fighting-game-section p-4 mb-4">
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
  const leftProfile = leftCandidate ? getCandidateProfile(leftCandidate.id) : null;
  const rightProfile = rightCandidate ? getCandidateProfile(rightCandidate.id) : null;

  return (
    <div className="fighting-game-bg-compare flex flex-col h-screen overflow-hidden">
      {/* Scrollable content */}
      <main className="flex-grow overflow-y-auto px-4 md:px-6 pb-24" style={{ scrollBehavior: 'smooth' }}>
        <div className="max-w-6xl mx-auto">
          {/* Character Images at Top */}
          <div className="py-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Character */}
              <div className="flex flex-col items-center avatar-container">
                {leftCandidate ? (
                  <>
                    <CandidateFullBodyMedia
                      candidate={leftCandidate}
                      side="left"
                      className="w-32 h-48 md:w-40 md:h-56 rounded shadow-lg mb-4 overflow-hidden"
                    />
                    <Link
                      to={`/candidate/${leftCandidate.id}`}
                      className="font-bold text-sm md:text-base text-white text-center hover:underline"
                    >
                      {leftCandidate.nombre}
                    </Link>
                    <div className="text-xs md:text-sm text-team-left font-medium text-center">
                      {leftCandidate.ideologia}
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-32 h-48 md:w-40 md:h-56 bg-team-left/10 rounded border-2 border-dashed border-team-left/40 flex flex-col items-center justify-center mb-4 gap-2">
                      <div className="w-16 h-16 rounded-full bg-team-left flex items-center justify-center text-white text-2xl font-bold">
                        1
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold">Candidato 1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Elige abajo</span>
                  </motion.div>
                )}
              </div>

              {/* Right Character */}
              <div className="flex flex-col items-center avatar-container">
                {rightCandidate ? (
                  <>
                    <CandidateFullBodyMedia
                      candidate={rightCandidate}
                      side="right"
                      className="w-32 h-48 md:w-40 md:h-56 rounded shadow-lg mb-4 overflow-hidden"
                    />
                    <Link
                      to={`/candidate/${rightCandidate.id}`}
                      className="font-bold text-sm md:text-base text-white text-center hover:underline"
                    >
                      {rightCandidate.nombre}
                    </Link>
                    <div className="text-xs md:text-sm text-team-right font-medium text-center">
                      {rightCandidate.ideologia}
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-32 h-48 md:w-40 md:h-56 bg-team-right/10 rounded border-2 border-dashed border-team-right/40 flex flex-col items-center justify-center mb-4 gap-2">
                      <div className="w-16 h-16 rounded-full bg-team-right flex items-center justify-center text-white text-2xl font-bold">
                        2
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold">Candidato 2</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Elige abajo</span>
                  </motion.div>
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
                title="Trayectoria"
                sectionId="trayectoria"
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                leftContent={
                  leftCandidate ? (
                    (() => {
                      const t = trayectorias[leftCandidate.id];
                      if (!t) return <span className="font-sans text-sm text-muted-foreground">Sin datos</span>;
                      return (
                        <div className="text-sm space-y-1">
                          <Link to={`/candidate/${leftCandidate.id}#tray-educacion`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><GraduationCap size={14} /> Educación</div>
                            <div className="text-muted-foreground mt-0.5">{t.educacion.formacion}</div>
                          </Link>
                          <Link to={`/candidate/${leftCandidate.id}#tray-privado`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><Building2 size={14} /> Sector Privado</div>
                            <div className="text-muted-foreground mt-0.5">{t.sector_privado.actividad}</div>
                          </Link>
                          <Link to={`/candidate/${leftCandidate.id}#tray-publico`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><Landmark size={14} /> Sector Público</div>
                            <div className="text-muted-foreground mt-0.5">{t.sector_publico.cargos_roles ?? '—'}</div>
                          </Link>
                          <Link to={`/candidate/${leftCandidate.id}#tray-politica`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><Flag size={14} /> Política</div>
                            <div className="text-muted-foreground mt-0.5">{t.politica.rol_accion}</div>
                          </Link>
                        </div>
                      );
                    })()
                  ) : <span className="font-sans">Sin análisis</span>
                }
                rightContent={
                  rightCandidate ? (
                    (() => {
                      const t = trayectorias[rightCandidate.id];
                      if (!t) return <span className="font-sans text-sm text-muted-foreground">Sin datos</span>;
                      return (
                        <div className="text-sm space-y-1">
                          <Link to={`/candidate/${rightCandidate.id}#tray-educacion`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><GraduationCap size={14} /> Educación</div>
                            <div className="text-muted-foreground mt-0.5">{t.educacion.formacion}</div>
                          </Link>
                          <Link to={`/candidate/${rightCandidate.id}#tray-privado`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><Building2 size={14} /> Sector Privado</div>
                            <div className="text-muted-foreground mt-0.5">{t.sector_privado.actividad}</div>
                          </Link>
                          <Link to={`/candidate/${rightCandidate.id}#tray-publico`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><Landmark size={14} /> Sector Público</div>
                            <div className="text-muted-foreground mt-0.5">{t.sector_publico.cargos_roles ?? '—'}</div>
                          </Link>
                          <Link to={`/candidate/${rightCandidate.id}#tray-politica`} className="block p-2 -m-2 rounded hover:bg-white/5">
                            <div className="flex items-center gap-2 font-medium"><Flag size={14} /> Política</div>
                            <div className="text-muted-foreground mt-0.5">{t.politica.rol_accion}</div>
                          </Link>
                        </div>
                      );
                    })()
                  ) : <span className="font-sans">Sin análisis</span>
                }
              />
                            <ComparisonSection
                title="Creencias"
                sectionId="creencias-clave"
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                leftContent={
                  <div className="flex flex-wrap gap-2">
                    {(leftProfile?.creenciasClave?.length ?? 0) > 0
                      ? leftProfile!.creenciasClave.slice(0, 3).map((c) => (
                          <Link key={c.id} to={`/candidate/${leftCandidate?.id}#creencia-${c.id}`} className="text-sm text-muted-foreground hover:underline">{c.nombre}</Link>
                        ))
                      : <span className="text-sm text-muted-foreground">No especificadas</span>}
                  </div>
                }
                rightContent={
                  <div className="flex flex-wrap gap-2">
                    {(rightProfile?.creenciasClave?.length ?? 0) > 0
                      ? rightProfile!.creenciasClave.slice(0, 3).map((c) => (
                          <Link key={c.id} to={`/candidate/${rightCandidate?.id}#creencia-${c.id}`} className="text-sm text-muted-foreground hover:underline">{c.nombre}</Link>
                        ))
                      : <span className="text-sm text-muted-foreground">No especificadas</span>}
                  </div>
                }
              />

              {/* Controversias now comes before Mapa de Poder (unchanged position) */}
              <ComparisonSection
                title="Controversias"
                sectionId="controversias"
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                leftContent={
                  leftCandidate ? (
                    (leftProfile?.controversias?.length ?? 0) > 0 ? (
                      <div className="space-y-2">
                        {leftProfile!.controversias!
                          .slice()
                          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                          .slice(0, 2)
                          .map((c) => (
                            <div key={c.id} className="font-sans">
                              <Link to={`/candidate/${leftCandidate.id}#controversia-${c.id}`} className="text-sm text-foreground hover:underline">
                                {c.titulo}
                              </Link>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <InfoBadge
                                  className={cn(severityProps(c.severidad).className, 'min-h-[22px]')}
                                  label={severityProps(c.severidad).label}
                                  description={<div><span className="font-semibold lowercase">severidad:</span> {severityHelp(c.severidad)}</div>}
                                />
                                <InfoBadge
                                  className={cn(legalProps(c.legal).className, 'min-h-[22px]')}
                                  label={legalProps(c.legal).label}
                                  description={<div><span className="font-semibold lowercase">estado legal:</span> {legalHelp(c.legal)}</div>}
                                />
                              </div>
                              <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="block text-xs text-white/80 underline mt-1">Fuente</a>
                            </div>
                          ))}
                        <Link
                          to={`/candidate/${leftCandidate.id}#controversias`}
                          className="block text-xs font-semibold text-primary/80 hover:text-primary mt-2"
                        >
                          Ver más
                        </Link>
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-muted-foreground">Sin controversias registradas</span>
                    )
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
                }
                rightContent={
                  rightCandidate ? (
                    (rightProfile?.controversias?.length ?? 0) > 0 ? (
                      <div className="space-y-2">
                        {rightProfile!.controversias!
                          .slice()
                          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                          .slice(0, 2)
                          .map((c) => (
                            <div key={c.id} className="font-sans">
                              <Link to={`/candidate/${rightCandidate.id}#controversia-${c.id}`} className="text-sm text-foreground hover:underline">
                                {c.titulo}
                              </Link>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <InfoBadge
                                  className={cn(severityProps(c.severidad).className, 'min-h-[22px]')}
                                  label={severityProps(c.severidad).label}
                                  description={<div><span className="font-semibold lowercase">severidad:</span> {severityHelp(c.severidad)}</div>}
                                />
                                <InfoBadge
                                  className={cn(legalProps(c.legal).className, 'min-h-[22px]')}
                                  label={legalProps(c.legal).label}
                                  description={<div><span className="font-semibold lowercase">estado legal:</span> {legalHelp(c.legal)}</div>}
                                />
                              </div>
                              <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="block text-xs text-white/80 underline mt-1">Fuente</a>
                            </div>
                          ))}
                        <Link
                          to={`/candidate/${rightCandidate.id}#controversias`}
                          className="block text-xs font-semibold text-primary/80 hover:text-primary mt-2"
                        >
                          Ver más
                        </Link>
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-muted-foreground">Sin controversias registradas</span>
                    )
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
                }
              />

              <ComparisonSection
                title="Agenda"
                sectionId="proyecto-politico"
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                leftContent={
                  <Link to={`/candidate/${leftCandidate?.id}#proyecto-politico`} className="text-base font-sans leading-relaxed block hover:bg-white/5 p-2 -m-2 rounded-md">
                    <div className="font-bold text-foreground">{leftProfile?.proyectoPolitico?.titulo ?? '—'}</div>
                    <div className="text-sm text-muted-foreground line-clamp-3 mt-1">{leftProfile?.proyectoPolitico?.resumen || "Selecciona un candidato"}</div>
                  </Link>
                }
                rightContent={
                  <Link to={`/candidate/${rightCandidate?.id}#proyecto-politico`} className="text-base font-sans leading-relaxed block hover:bg-white/5 p-2 -m-2 rounded-md">
                    <div className="font-bold text-foreground">{rightProfile?.proyectoPolitico?.titulo ?? '—'}</div>
                    <div className="text-sm text-muted-foreground line-clamp-3 mt-1">{rightProfile?.proyectoPolitico?.resumen || "Selecciona un candidato"}</div>
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
                    <div className="space-y-3">
                      {(leftProfile?.mapaDePoder?.alianzas ?? []).slice(0, 3).map((alianza) => (
                        <Link
                          key={alianza.nombre}
                          to={`/candidate/${leftCandidate.id}#mapa-de-poder`}
                          className="block border-l-2 border-team-left/50 pl-3 font-sans hover:bg-white/5 rounded-r-md"
                        >
                          <div className="font-medium text-base text-foreground">{alianza.nombre}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="font-sans">Sin datos</span>
                  )
                }
                rightContent={
                  rightCandidate ? (
                    <div className="space-y-3">
                      {(rightProfile?.mapaDePoder?.alianzas ?? []).slice(0, 3).map((alianza) => (
                        <Link
                          key={alianza.nombre}
                          to={`/candidate/${rightCandidate.id}#mapa-de-poder`}
                          className="block border-l-2 border-team-right/50 pl-3 font-sans hover:bg-white/5 rounded-r-md"
                        >
                          <div className="font-medium text-base text-foreground">{alianza.nombre}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="font-sans">Sin datos</span>
                  )
                }
              />

              <ComparisonSection
                title="Redes"
                sectionId="presencia-digital"
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                leftContent={
                  leftCandidate ? (
                    <Link to={`/candidate/${leftCandidate.id}#presencia-digital`} className="font-sans text-sm text-muted-foreground hover:underline">
                      {(leftProfile?.presenciaDigital?.plataformas?.length ?? 0) > 0
                        ? `Activo en: ${(leftProfile!.presenciaDigital!.plataformas).map(p => p.nombre).join(', ')}`
                        : "Sin presencia digital registrada"}
                    </Link>
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
                }
                rightContent={
                  rightCandidate ? (
                    <Link to={`/candidate/${rightCandidate.id}#presencia-digital`} className="font-sans text-sm text-muted-foreground hover:underline">
                      {(rightProfile?.presenciaDigital?.plataformas?.length ?? 0) > 0
                        ? `Activo en: ${(rightProfile!.presenciaDigital!.plataformas).map(p => p.nombre).join(', ')}`
                        : "Sin presencia digital registrada"}
                    </Link>
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
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