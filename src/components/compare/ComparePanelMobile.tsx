import { motion } from 'framer-motion';
import { memo, useEffect, useId, useRef, useState } from 'react';
import type { CandidateBase } from '@/data/types';
import { trayectorias } from '@/data/domains/trayectorias';
import { GraduationCap, Building2, Landmark, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidatePicker } from './CandidatePicker';
import { PLAYER_INDICATORS, UI_CLASSES } from '@/lib/constants';
import { getCandidateProfile } from '@/data';

// + imports para popover
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
                                {/* removed rank chip */}
                                <ExplainChip
                                  className={cn(sevChip(c.severidad).className, 'min-h-[22px]')}
                                  label={sevChip(c.severidad).label}
                                  description={<div><span className="font-semibold lowercase">severidad:</span> {sevHelp(c.severidad)}</div>}
                                />
                                <ExplainChip
                                  className={cn(legChip(c.legal).className, 'min-h-[22px]')}
                                  label={legChip(c.legal).label}
                                  description={<div><span className="font-semibold lowercase">estado legal:</span> {legHelp(c.legal)}</div>}
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
                                {/* removed rank chip */}
                                <ExplainChip
                                  className={cn(sevChip(c.severidad).className, 'min-h-[22px]')}
                                  label={sevChip(c.severidad).label}
                                  description={<div><span className="font-semibold lowercase">severidad:</span> {sevHelp(c.severidad)}</div>}
                                />
                                <ExplainChip
                                  className={cn(legChip(c.legal).className, 'min-h-[22px]')}
                                  label={legChip(c.legal).label}
                                  description={<div><span className="font-semibold lowercase">estado legal:</span> {legHelp(c.legal)}</div>}
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

// UI chips for Controversias (mobile-friendly)
const sevChip = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return { label: 'muy alta', className: 'bg-red-600/90 text-white' };
    case 'alta':     return { label: 'alta',     className: 'bg-orange-600/90 text-white' };
    case 'media':    return { label: 'media',    className: 'bg-amber-300/90 text-foreground' };
    default:         return { label: '—',        className: 'bg-muted text-foreground' };
  }
};
const legChip = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':   return { label: 'Denuncia en Medios',               className: 'bg-sky-600/90 text-white' };
    case 'en_curso':             return { label: 'En curso',            className: 'bg-amber-500/90 text-black' };
    case 'sancion':              return { label: 'Sanción',             className: 'bg-rose-600/90 text-white' };
    case 'cerrado_sin_sancion':  return { label: 'Cerrado sin sanción', className: 'bg-emerald-600/90 text-white' };
    case 'condena':              return { label: 'Condena',             className: 'bg-red-700/90 text-white' };
    default:                     return { label: '—',                   className: 'bg-muted text-foreground' };
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
const ExplainChip = ({ className = '', label, description }: { className?: string; label: string; description: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const contentId = useId();

  const clearTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      setOpen(true);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      closeTimer.current = window.setTimeout(() => setOpen(false), 120);
    }
  };

  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    clearTimer();
    setOpen(prev => !prev);
  };

  useEffect(() => () => clearTimer(), []);

  const triggerClasses = cn(
    "inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[10px] font-medium lowercase tracking-wide text-white/80 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out backdrop-blur-md",
    "hover:border-primary/70 hover:text-primary-foreground hover:bg-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary/70 focus-visible:ring-offset-background",
    open && "border-primary/80 bg-primary/85 text-primary-foreground shadow-[0_0_24px_rgba(244,63,94,0.35)]",
    className,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={triggerClasses}
          aria-describedby={contentId}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <span className="h-1 w-1 rounded-full bg-white/40 transition-colors" />
          <span className="leading-none">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={contentId}
        side="top"
        align="center"
        sideOffset={10}
        className="max-w-xs rounded-2xl border border-white/12 bg-card/95 p-3 text-xs leading-relaxed text-foreground/85 shadow-[0_18px_36px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div className="flex items-start gap-2">
          <span className="mt-1 h-1 w-8 rounded-full bg-gradient-to-r from-primary/70 via-accent/60 to-secondary/65" />
          <div>{description}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};