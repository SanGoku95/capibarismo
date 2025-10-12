import { motion } from 'framer-motion';
import { memo, type ReactNode } from 'react';
import { Candidate } from '@/data/candidates';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidatePicker } from './CandidatePicker';
import { PLAYER_INDICATORS, UI_CLASSES, type CandidateSide } from '@/lib/constants';

// + imports para tooltip/popover
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
      <main
        className="flex-grow overflow-y-auto px-4 md:px-6 pb-24" // Add padding to prevent footer overlap
        style={{
          scrollBehavior: 'smooth', // Enable smooth scrolling
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Character Images at Top */}
          <div className="py-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Character */}
              <div className="flex flex-col items-center avatar-container">
                {leftCandidate ? (
                  <>
                    <img
                      src={leftCandidate.fullBody}
                      alt={`${leftCandidate.nombre} full body`}
                      className="w-32 h-48 md:w-40 md:h-56 object-cover rounded shadow-lg mb-4"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
                      }}
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
                    <img
                      src={rightCandidate.fullBody}
                      alt={`${rightCandidate.nombre} full body`}
                      className="w-32 h-48 md:w-40 md:h-56 object-cover rounded shadow-lg mb-4 scale-x-[-1]"
                      style={{
                        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
                      }}
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

              {/* Controversias now comes before Mapa de Poder (unchanged position) */}
              <ComparisonSection
                title="Controversias"
                sectionId="controversias"
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                leftContent={
                  leftCandidate ? (
                    leftCandidate.controversias && leftCandidate.controversias.length > 0 ? (
                      <div className="space-y-2">
                        {leftCandidate.controversias
                          .slice()
                          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                          .slice(0, 2)
                          .map((c) => (
                            <div key={c.id} className="font-sans">
                              <Link to={`/candidate/${leftCandidate.id}#controversia-${c.id}`} className="text-sm text-foreground hover:underline">
                                {c.titulo}
                              </Link>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {/* removed rank chip */}
                                <ExplainChip
                                  className={sevChip(c.severidad)}
                                  label={c.severidad === 'muy-alta' ? 'Muy alta' : c.severidad ? c.severidad[0].toUpperCase()+c.severidad.slice(1) : '—'}
                                  description={<div><span className="font-semibold">Severidad:</span> {sevHelp(c.severidad)}</div>}
                                />
                                <ExplainChip
                                  className={legChip(c.legal)}
                                  label={c.legal ? c.legal[0].toUpperCase()+c.legal.slice(1) : '—'}
                                  description={<div><span className="font-semibold">Estado legal:</span> {legHelp(c.legal)}</div>}
                                />
                              </div>
                              <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="block text-xs text-white/80 underline mt-1">Fuente</a>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-muted-foreground">Sin controversias registradas</span>
                    )
                  ) : <span className="font-sans text-sm text-muted-foreground">Sin análisis</span>
                }
                rightContent={
                  rightCandidate ? (
                    rightCandidate.controversias && rightCandidate.controversias.length > 0 ? (
                      <div className="space-y-2">
                        {rightCandidate.controversias
                          .slice()
                          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                          .slice(0, 2)
                          .map((c) => (
                            <div key={c.id} className="font-sans">
                              <Link to={`/candidate/${rightCandidate.id}#controversia-${c.id}`} className="text-sm text-foreground hover:underline">
                                {c.titulo}
                              </Link>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {/* removed rank chip */}
                                <ExplainChip
                                  className={sevChip(c.severidad)}
                                  label={c.severidad === 'muy-alta' ? 'Muy alta' : c.severidad ? c.severidad[0].toUpperCase()+c.severidad.slice(1) : '—'}
                                  description={<div><span className="font-semibold">Severidad:</span> {sevHelp(c.severidad)}</div>}
                                />
                                <ExplainChip
                                  className={legChip(c.legal)}
                                  label={c.legal ? c.legal[0].toUpperCase()+c.legal.slice(1) : '—'}
                                  description={<div><span className="font-semibold">Estado legal:</span> {legHelp(c.legal)}</div>}
                                />
                              </div>
                              <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="block text-xs text-white/80 underline mt-1">Fuente</a>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-muted-foreground">Sin controversias registradas</span>
                    )
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
                    <div className="space-y-3">
                      {leftCandidate.mapaDePoder.alianzas.slice(0, 3).map((alianza) => (
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
                      {rightCandidate.mapaDePoder.alianzas.slice(0, 3).map((alianza) => (
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

// UI chips for Controversias (mobile-friendly)
const sevChip = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return 'bg-red-600/90 text-white';
    case 'alta':     return 'bg-orange-600/90 text-white';
    case 'media':    return 'bg-amber-300/90 text-foreground';
    default:         return 'bg-muted text-foreground';
  }
};
const legChip = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':   return 'bg-sky-600/90 text-white';
    case 'en_curso':             return 'bg-amber-500/90 text-black';
    case 'sancion':              return 'bg-rose-600/90 text-white';
    case 'cerrado_sin_sancion':  return 'bg-emerald-600/90 text-white';
    case 'condena':              return 'bg-red-700/90 text-white';
    default:                     return 'bg-muted text-foreground';
  }
};

// NEW: ayudas de texto
const sevHelp = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return 'Controversia de muy alto impacto público o institucional.';
    case 'alta':     return 'Controversia de impacto significativo o con medidas relevantes.';
    case 'media':    return 'Controversia relevante en seguimiento.';
    default:         return 'Sin clasificación específica.';
  }
};
const legHelp = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':  return 'Se dijo en prensa/redes; sin trámite oficial.';
    case 'en_curso':            return 'Trámite oficial abierto (investigación o juicio).';
    case 'sancion':             return 'Hubo sanción institucional (no es condena penal).';
    case 'cerrado_sin_sancion': return 'Archivado o absuelto; sin sanción.';
    case 'condena':             return 'Sentencia penal firme de culpabilidad.';
    default:                    return 'Sin datos suficientes para clasificar.';
  }
};

// NEW: Chip con explicación (hover/click)
const ExplainChip = ({ className = '', label, description }: { className?: string; label: string; description: React.ReactNode }) => (
  <Popover>
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <span role="button" tabIndex={0} className={cn('px-1.5 py-0.5 text-[10px] rounded-md border border-white/10', className)}>
              {label}
            </span>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs z-50">{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <PopoverContent className="max-w-xs text-xs z-50">{description}</PopoverContent>
  </Popover>
);