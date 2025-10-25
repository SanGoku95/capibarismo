import { motion } from 'framer-motion';
import type { CandidateBase } from '@/data/types';
import { getCandidateProfile } from '@/data';
import { TagPill } from '../common/TagPill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { SocialIcon } from '../common/SocialIcon';
import { CandidateAvatar } from '../candidate/CandidateAvatar';
import { PlayerIndicator } from '../common/PlayerIndicator';
import { type SocialPlatformType } from '@/lib/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Briefcase, Power, Radio, Sparkles, AlertTriangle, GraduationCap, Building2, Landmark, Flag } from 'lucide-react';
import { PLAYER_INDICATORS, type CandidateSide } from '@/lib/constants';
import { trayectorias } from '@/data/domains/trayectorias';

// + imports para tooltip/popover
import { type ReactNode, useId, useRef, useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CandidateFactSheetProps {
  candidate: CandidateBase | null;
  side: CandidateSide;
  openSection: string | null; // Shared state for open accordion section
  setOpenSection: (section: string | null) => void; // Setter for shared state
}

export function CandidateFactSheet({ candidate, side, openSection, setOpenSection }: CandidateFactSheetProps) {
  const config = PLAYER_INDICATORS[side];
  const profile = candidate ? getCandidateProfile(candidate.id) : null;
  
  if (!candidate) {
    return (
      <Card className={cn("h-full border-l-4 fighting-game-card", config.borderColor)}>
        <CardContent className="flex items-center justify-center h-full p-8">
          <div className="text-center text-muted-foreground">
            <PlayerIndicator side={side} size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Candidato {config.number}
            </h3>
            <p className="text-sm">Selecciona un candidato para comparar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("h-full border-l-4 fighting-game-card", config.borderColor)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <PlayerIndicator side={side} size="sm" variant="badge" className="shadow-md border-2 border-white/30" />
                <CardTitle className="text-lg md:text-xl font-bold">
                  <Link to={`/candidate/${candidate.id}`} className="hover:underline">
                    {candidate.nombre}
                  </Link>
                </CardTitle>
              </div>
              <Badge className={`text-xs md:text-sm ${config.badgeColor}`}>
                {candidate.ideologia}
              </Badge>
            </div>
            {candidate.headshot ? (
              <CandidateAvatar
                src={candidate.headshot}
                alt={`Retrato de ${candidate.nombre}`}
              />
            ) : null}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openSection ?? undefined}
            onValueChange={(value) => setOpenSection(value ?? null)}
          >

             {/* Trayectoria FIRST */}
            <AccordionItem value="trayectoria">
              <AccordionTrigger className="text-base font-semibold">
                <Briefcase size={16} className="mr-2" /> Trayectoria
              </AccordionTrigger>
              <AccordionContent>
                {(() => {
                  const t = trayectorias[candidate.id];
                  if (!t) {
                    return (
                      <div className="text-sm text-muted-foreground">Sin datos estructurados. Ver perfil para más detalles.</div>
                    );
                  }
                  return (
                    <div className="pt-2 text-sm">
                      <div className="flex flex-col divide-y divide-border/40 rounded-md overflow-hidden">
                        <Link to={`/candidate/${candidate.id}#tray-educacion`} className="p-2 hover:bg-muted/50 focus:bg-muted/60 focus:outline-none">
                          <div className="flex items-center gap-2 font-semibold">
                            <GraduationCap size={14} className="opacity-80" />
                            Educación
                          </div>
                          <div className="text-muted-foreground mt-0.5">{t.educacion.formacion}</div>
                        </Link>

                        <Link to={`/candidate/${candidate.id}#tray-privado`} className="p-2 hover:bg-muted/50 focus:bg-muted/60 focus:outline-none">
                          <div className="flex items-center gap-2 font-semibold">
                            <Building2 size={14} className="opacity-80" />
                            Sector Privado
                          </div>
                          <div className="text-muted-foreground mt-0.5">{t.sector_privado.actividad}</div>
                        </Link>

                        <Link to={`/candidate/${candidate.id}#tray-publico`} className="p-2 hover:bg-muted/50 focus:bg-muted/60 focus:outline-none">
                          <div className="flex items-center gap-2 font-semibold">
                            <Landmark size={14} className="opacity-80" />
                            Sector Público
                          </div>
                          <div className="text-muted-foreground mt-0.5">{t.sector_publico.cargos_roles ?? '—'}</div>
                        </Link>

                        <Link to={`/candidate/${candidate.id}#tray-politica`} className="p-2 hover:bg-muted/50 focus:bg-muted/60 focus:outline-none">
                          <div className="flex items-center gap-2 font-semibold">
                            <Flag size={14} className="opacity-80" />
                            Política
                          </div>
                          <div className="text-muted-foreground mt-0.5">{t.politica.rol_accion}</div>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creencias-clave">
              <AccordionTrigger className="text-base font-semibold">
                <Sparkles size={16} className="mr-2" /> Creencias
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(profile?.creenciasClave ?? []).map((creencia) => (
                    <Link key={creencia.id} to={`/candidate/${candidate.id}#creencia-${creencia.id}`}>
                      <TagPill variant="belief">
                        {creencia.nombre}
                      </TagPill>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="controversias">
              <AccordionTrigger className="text-base font-semibold">
                <AlertTriangle size={16} className="mr-2" /> Controversias
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-2">
                  {(() => { const profile = getCandidateProfile(candidate.id); const controversies = profile?.controversias ?? []; return controversies.length > 0; })() ? (
                    <>
                      {(getCandidateProfile(candidate.id)?.controversias ?? [])
                        .slice()
                        .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                        .slice(0, 3)
                        .map((c) => {
                          const s = sevProps(c.severidad);
                          const l = legProps(c.legal);
                          return (
                            <div key={c.id} className="block p-2 rounded-md hover:bg-muted/50">
                              <Link to={`/candidate/${candidate.id}#controversia-${c.id}`} className="text-base font-sans font-medium hover:underline">
                                {c.titulo}
                              </Link>
                              <div className="flex flex-wrap gap-2 my-1">
                                <InfoBadge
                                  className={s.className}
                                  label={s.label}
                                  description={
                                    <div><span className="font-semibold">Severidad:</span> {sevHelp(c.severidad)}</div>
                                  }
                                />
                                <InfoBadge
                                  className={l.className}
                                  label={l.label}
                                  description={
                                    <div><span className="font-semibold">Estado legal:</span> {legHelp(c.legal)}</div>
                                  }
                                />
                              </div>
                              <div className="text-sm text-muted-foreground">{c.descripcion}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="underline">Fuente</a>
                              </div>
                            </div>
                          );
                        })}
                      <Link
                        to={`/candidate/${candidate.id}#controversias`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary mt-2"
                      >
                        Ver más
                      </Link>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin controversias registradas.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="proyecto-politico">
              <AccordionTrigger className="text-base font-semibold">
                <Shield size={16} className="mr-2" /> Agenda
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  {profile?.proyectoPolitico ? (
                    <>
                      <Link to={`/candidate/${candidate.id}#proyecto-politico`} className="font-bold text-foreground hover:underline">{profile.proyectoPolitico.titulo}</Link>
                      <p className="text-base font-sans text-muted-foreground leading-relaxed mt-1 line-clamp-4">
                        {profile.proyectoPolitico.resumen}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin agenda registrada.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mapa-de-poder">
              <AccordionTrigger className="text-base font-semibold">
                <Power size={16} className="mr-2" /> Mapa de Poder
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-2">
                  {profile?.mapaDePoder?.alianzas?.length
                    ? profile.mapaDePoder.alianzas.slice(0, 3).map((alianza) => (
                        <Link
                          to={`/candidate/${candidate.id}#mapa-de-poder`}
                          key={alianza.nombre}
                          className="block p-2 rounded-md hover:bg-muted/50"
                        >
                          <div className="text-base font-sans font-medium">{alianza.nombre}</div>
                        </Link>
                      ))
                    : (
                      <p className="text-sm text-muted-foreground italic">
                        Sin alianzas registradas.
                      </p>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="presencia-digital">
              <AccordionTrigger className="text-base font-semibold">
                <Radio size={16} className="mr-2" /> Redes
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {(profile?.presenciaDigital?.plataformas ?? []).map((platform) => (
                    <a
                      key={platform.nombre}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver perfil de ${candidate.nombre} en ${platform.nombre}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-muted-foreground">
                        <SocialIcon platform={platform.nombre as SocialPlatformType} />
                      </div>
                      <div>
                        <div className="font-medium capitalize text-base font-sans">{platform.nombre}</div>
                        <div className="text-sm text-muted-foreground">{platform.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// NEW: local helpers
const sevProps = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return { label: 'Muy alta', className: 'bg-red-600/90 text-white' };
    case 'alta':     return { label: 'Alta',     className: 'bg-orange-600/90 text-white' };
    case 'media':    return { label: 'Media',    className: 'bg-amber-300/90 text-foreground' };
    default:         return { label: '—',        className: 'bg-muted text-foreground' };
  }
};
const legProps = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':   return { label: 'Denuncia en Medios',         className: 'bg-sky-600/90 text-white' };
    case 'en_curso': return { label: 'En Curso', className: 'bg-amber-500/90 text-black' };
    case 'sancion':  return { label: 'Sanción',     className: 'bg-rose-600/90 text-white'};
    case 'cerrado_sin_sancion':  return { label: 'Cerrado sin sanción',     className: 'bg-emerald-600/90 text-white' };
    case 'condena':              return { label: 'Condena',             className:'bg-red-700/90 text-white' };
    default:                     return { label: '—', className:'bg-muted text-foreground'};
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

// NEW: Badge con explicación (hover y click) — Popover controlado con timer
function InfoBadge({
  label,
  className,
  description,
}: { label: string; className?: string; description: ReactNode }) {
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
    "inline-flex items-center gap-1 rounded-full border border-white/12 bg-card/80 px-2.5 py-1 text-[11px] font-medium lowercase tracking-wide text-foreground/80 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 ease-out backdrop-blur-md",
    "hover:border-primary/70 hover:text-primary-foreground hover:bg-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary/70 focus-visible:ring-offset-background",
    open && "border-primary/80 bg-primary/85 text-primary-foreground shadow-[0_0_28px_rgba(244,63,94,0.45)]",
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
          <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition-colors group-hover:bg-white/80" />
          <span className="leading-none">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={contentId}
        side="top"
        align="start"
        sideOffset={12}
        className="max-w-xs rounded-2xl border border-white/12 bg-card/95 p-4 text-sm leading-relaxed text-foreground/85 shadow-[0_22px_42px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-10 rounded-full bg-gradient-to-r from-primary/70 via-accent/60 to-secondary/65" />
          <div>{description}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
