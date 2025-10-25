import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from "react";
import { getCandidateProfile } from '@/data';
import { trayectorias } from '@/data/domains/trayectorias';
import NotFound from './NotFound';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Star, Briefcase, Radio, Power, Rss, Link as LinkIcon, AlertTriangle, GraduationCap, Building2, Landmark, Flag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FaTiktok, FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaRegWindowRestore } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
// + imports para tooltip/popover
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePersonSEO } from '@/lib/useSEO';
import type { CandidateProfile as CandidateProfileType } from '@/data/types';


const socialIcons: { [key: string]: React.ReactElement } = {
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
  web: <FaRegWindowRestore />,
};

// NEW: helpers for controversy badges
const severityProps = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return { label: 'Severidad: Muy alta', className: 'bg-red-600/90 text-white' };
    case 'alta':     return { label: 'Severidad: Alta',     className: 'bg-orange-600/90 text-white' };
    case 'media':    return { label: 'Severidad: Media',    className: 'bg-amber-300/90 text-foreground' };
    default:         return { label: 'Severidad: —',        className: 'bg-muted text-foreground' };
  }
};
const legalProps = (legal?: string) => {
  switch (legal) {
    case 'denuncia_en_medios':  return { label: 'Legal: Denuncia en medios',  className: 'bg-sky-600/90 text-white' };
    case 'en_curso':            return { label: 'Legal: En curso',            className: 'bg-amber-500/90 text-black' };
    case 'sancion':             return { label: 'Legal: Sanción',             className: 'bg-rose-600/90 text-white' };
    case 'cerrado_sin_sancion': return { label: 'Legal: Cerrado sin sanción', className: 'bg-emerald-600/90 text-white' };
    case 'condena':             return { label: 'Legal: Condena',             className: 'bg-red-700/90 text-white' };
    default:                    return { label: 'Legal: —',                   className: 'bg-muted text-foreground' };
  }
};

// NEW: helpers para explicación
const severityHelp = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return 'Controversia de muy alto impacto público o institucional.';
    case 'alta':     return 'Controversia de impacto significativo o con medidas relevantes.';
    case 'media':    return 'Controversia relevante en seguimiento.';
    default:         return 'Sin clasificación específica.';
  }
};
const legalHelp = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':  return 'Se dijo en prensa/redes; sin trámite oficial.';
    case 'en_curso':            return 'Trámite oficial abierto (investigación o juicio).';
    case 'sancion':             return 'Hubo sanción institucional (no es condena penal).';
    case 'cerrado_sin_sancion': return 'Archivado o absuelto; sin sanción.';
    case 'condena':             return 'Sentencia penal firme de culpabilidad.';
    default:                    return 'Sin datos suficientes para clasificar.';
  }
};

// NEW: Badge con hover/click explicativo
const ExplainBadge = ({ label, className, description }: { label: string; className?: string; description: React.ReactNode }) => (
  <Popover>
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Badge className={className} role="button" tabIndex={0}>
              {label}
            </Badge>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm z-50">{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <PopoverContent className="max-w-xs text-sm z-50">{description}</PopoverContent>
  </Popover>
);

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = id ? getCandidateProfile(id) : null;
  type CandidateView = CandidateProfileType['base'] & Pick<CandidateProfileType, 'proyectoPolitico' | 'creenciasClave' | 'presenciaDigital' | 'mapaDePoder' | 'controversias'>;
  const candidate = useMemo<CandidateView | null>(() => (
    profile?.base
      ? {
          ...profile.base,
          proyectoPolitico: profile.proyectoPolitico,
          creenciasClave: profile.creenciasClave,
          presenciaDigital: profile.presenciaDigital,
          mapaDePoder: profile.mapaDePoder,
          controversias: profile.controversias,
        }
      : null
  ), [profile]);

  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const structuredTrayectoria = candidate ? trayectorias[candidate.id] : undefined;

  useEffect(() => {
    if (!candidate) return;

    const hash = location.hash.substring(1);
    if (hash) {
      let valueToOpen = hash;
      let elementToScrollToId = hash;

      // Trayectoria subsections: scroll directly to the section id
      if (hash.startsWith('tray-')) {
        const sectionEl = document.getElementById(hash);
        if (sectionEl) {
          setTimeout(() => {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
        return; // don't alter accordion state for trayectoria
      }

      if (hash.startsWith('creencia-')) {
        valueToOpen = hash.split('creencia-')[1];
        elementToScrollToId = 'creencias-clave';
      } else if (structuredTrayectoria) {
        const trayectoriaSectionIds = [
          `${structuredTrayectoria.id}-educacion`,
          `${structuredTrayectoria.id}-sector-privado`,
          `${structuredTrayectoria.id}-sector-publico`,
          `${structuredTrayectoria.id}-politica`,
        ];
        if (trayectoriaSectionIds.includes(hash)) {
          valueToOpen = hash;
          elementToScrollToId = 'trayectoria';
        } else if (hash === 'trayectoria' && trayectoriaSectionIds.length > 0) {
          valueToOpen = trayectoriaSectionIds[0];
          elementToScrollToId = 'trayectoria';
        }
      } else if (hash.startsWith('controversia-')) {
        valueToOpen = hash.split('controversia-')[1];
        elementToScrollToId = 'controversias';
      } else if (hash === 'controversias' && candidate.controversias && candidate.controversias.length > 0) {
        valueToOpen = candidate.controversias[0].id;
      }
      
      setOpenAccordionItems(prev => [...new Set([...prev, valueToOpen])]);

      const element = document.getElementById(elementToScrollToId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, candidate, structuredTrayectoria]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // SEO: Add Person structured data for candidate
  // Note: We need to call hooks before any conditional returns
  const knowsAbout = profile?.creenciasClave.map(c => c.nombre) || [];
  const affiliation = profile?.mapaDePoder?.alianzas?.[0]?.nombre;
  
  usePersonSEO(
    candidate?.nombre || 'Candidato',
    candidate ? `${candidate.nombre} - ${candidate.ideologia}. ${candidate.proyectoPolitico?.resumen ?? ''}`.trim() || 'Perfil de candidato' : 'Perfil de candidato',
    'Candidato Presidencial de Perú 2026',
    candidate?.headshot ? `https://capibarismo.com${candidate.headshot}` : undefined,
    affiliation,
    knowsAbout

  );

  if (!candidate) {
    return <NotFound />;
  }

  // NEW: sort controversies by rank
  const controversiesSorted = (candidate.controversias || [])
    .slice()
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold">{candidate.nombre}</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="fighting-game-card">
                <CardContent className="p-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg blur-xl opacity-20 bg-primary"></div>
                    <img
                      src={candidate.fullBody}
                      alt={`Imagen de cuerpo entero de ${candidate.nombre}`}
                      className="relative z-10 w-full max-w-[280px] lg:max-w-full rounded-lg shadow-2xl mx-auto object-cover aspect-[2/3] border-2 border-primary/30"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(var(--primary), 0.3))',
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold mt-4 text-center tracking-wide">{candidate.nombre}</h2>
                  <p className="text-center text-muted-foreground font-medium">{candidate.ideologia}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Trayectoria FIRST */}
            <Card className="fighting-game-card scroll-mt-24" id="trayectoria">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase size={20} /> Trayectoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const t = trayectorias[candidate.id];
                  if (!t) {
                    return <p className="text-sm text-muted-foreground">No hay datos estructurados de trayectoria.</p>;
                  }
                  return (
                    <div className="space-y-6">
                      <section id="tray-educacion" className="scroll-mt-28">
                        <h4 className="font-semibold text-lg mb-1 flex items-center gap-2"><GraduationCap size={18} className="opacity-80" /> Educación</h4>
                        <p className="text-muted-foreground"><span className="font-medium">Formación:</span> {t.educacion.formacion}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Instituciones:</span> {t.educacion.instituciones}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Credencial/Hito:</span> {t.educacion.credencial_hito}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Enfoque:</span> {t.educacion.enfoque}</p>
                      </section>

                      <section id="tray-privado" className="scroll-mt-28">
                        <h4 className="font-semibold text-lg mb-1 flex items-center gap-2"><Building2 size={18} className="opacity-80" /> Sector Privado</h4>
                        <p className="text-muted-foreground"><span className="font-medium">Actividad:</span> {t.sector_privado.actividad}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Escala/Impacto:</span> {t.sector_privado.escala_impacto}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Estrategia/Ámbito:</span> {t.sector_privado.estrategia_ambito}</p>
                      </section>

                      <section id="tray-publico" className="scroll-mt-28">
                        <h4 className="font-semibold text-lg mb-1 flex items-center gap-2"><Landmark size={18} className="opacity-80" /> Sector Público</h4>
                        <p className="text-muted-foreground"><span className="font-medium">Cargos/Roles:</span> {t.sector_publico.cargos_roles ?? '—'}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Periodo:</span> {t.sector_publico.periodo ?? '—'}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Logros/Controversias:</span> {t.sector_publico.logros_controversias ?? '—'}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Territorio/Ámbito:</span> {t.sector_publico.territorio_ambito ?? '—'}</p>
                      </section>

                      <section id="tray-politica" className="scroll-mt-28">
                        <h4 className="font-semibold text-lg mb-1 flex items-center gap-2"><Flag size={18} className="opacity-80" /> Política</h4>
                        <p className="text-muted-foreground"><span className="font-medium">Rol/Acción:</span> {t.politica.rol_accion}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Competición:</span> {t.politica.competicion}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Resultados/Posicionamiento:</span> {t.politica.resultados_posicionamiento}</p>
                        <p className="text-muted-foreground"><span className="font-medium">Línea:</span> {t.politica.linea}</p>
                      </section>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Proyecto Político después de Trayectoria */}
            {candidate.proyectoPolitico && (
            <Card className="fighting-game-card scroll-mt-24" id="proyecto-politico">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield size={20} /> Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold mb-2">{candidate.proyectoPolitico.titulo}</h3>
                <p className="leading-relaxed text-muted-foreground">{candidate.proyectoPolitico.resumen}</p>
                {candidate.proyectoPolitico.detalles && (
                  <Accordion 
                    type="multiple" 
                    className="w-full mt-4"
                    value={openAccordionItems}
                    onValueChange={setOpenAccordionItems}
                  >
                    {candidate.proyectoPolitico.detalles.map((detalle) => (
                      <AccordionItem value={detalle.subtitulo} key={detalle.subtitulo} className="border-b-muted-foreground/20">
                        <AccordionTrigger>{detalle.subtitulo}</AccordionTrigger>
                        <AccordionContent>
                          {detalle.texto}
                          {detalle.fuente && (
                            <a href={detalle.fuente} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 mt-2">
                              <LinkIcon size={12} />
                              Fuente
                            </a>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
            )}
            <Card className="fighting-game-card scroll-mt-24" id="creencias-clave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star size={20} /> Creencias Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion 
                  type="multiple" 
                  className="w-full"
                  value={openAccordionItems}
                  onValueChange={setOpenAccordionItems}
                >
                  {candidate.creenciasClave.map((creencia) => (
                    <AccordionItem value={creencia.id} key={creencia.id} id={`creencia-${creencia.id}`} className="border-b-muted-foreground/20">
                      <AccordionTrigger>{creencia.nombre}</AccordionTrigger>
                      <AccordionContent>
                        <p>{creencia.resumen}</p>
                        {creencia.detalle && <p className="mt-2 text-sm text-muted-foreground">{creencia.detalle}</p>}
                        {creencia.fuente ? (
                          <a
                            href={creencia.fuente}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 mt-2"
                          >
                            <LinkIcon size={12} />
                            Fuente
                          </a>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {candidate.presenciaDigital && (
            <Card className="fighting-game-card scroll-mt-24" id="presencia-digital">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><Rss size={20} /> Presencia en Medios Digitales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              {candidate.presenciaDigital.plataformas.map((plataforma) => (
                <div key={plataforma.nombre} className="flex items-start gap-4">
                <div className="text-2xl text-muted-foreground mt-1">
                  {socialIcons[plataforma.nombre] || <Radio />}
                </div>
                <div>
                  <a
                    href={plataforma.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                  <h4 className="font-semibold capitalize flex items-center gap-1.5">
                    {plataforma.nombre}
                    <LinkIcon size={14} className="inline-block text-primary/80" />
                  </h4>
                  </a>
                  <p className="leading-relaxed text-muted-foreground mt-1">{plataforma.estrategia}</p>
                </div>
                </div>
              ))}
              </CardContent>
            </Card>
            )}

            {candidate.mapaDePoder && (
            <Card className="fighting-game-card scroll-mt-24" id="mapa-de-poder">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Power size={20} /> Mapa de Poder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Alianzas Clave</h4>
                  <div className="space-y-3">
                    {candidate.mapaDePoder.alianzas.map(item => (
                      <div key={item.nombre}>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Principales Opositores</h4>
                  <div className="space-y-3">
                    {candidate.mapaDePoder.opositores.map(item => (
                      <div key={item.nombre}>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>
                 <Separator />
              </CardContent>
            </Card>
            )}

            {/* NEW: Controversias */}
            <Card className="fighting-game-card scroll-mt-24" id="controversias">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle size={20} /> Controversias</CardTitle>
              </CardHeader>
              <CardContent>
                {controversiesSorted && controversiesSorted.length > 0 ? (
                  <Accordion
                    type="multiple"
                    className="w-full"
                    value={openAccordionItems}
                    onValueChange={setOpenAccordionItems}
                  >
                    {controversiesSorted.map((c) => {
                      const sev = severityProps(c.severidad);
                      const leg = legalProps(c.legal);
                      return (
                        <AccordionItem value={c.id} key={c.id} id={`controversia-${c.id}`} className="border-b-muted-foreground/20">
                          <AccordionTrigger>{c.titulo}</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {/* replaced badges with ExplainBadge */}
                              <ExplainBadge
                                className={sev.className}
                                label={sev.label}
                                description={
                                  <div><span className="font-semibold">Severidad:</span> {severityHelp(c.severidad)}</div>
                                }
                              />
                              <ExplainBadge
                                className={leg.className}
                                label={leg.label}
                                description={
                                  <div><span className="font-semibold">Estado legal:</span> {legalHelp(c.legal)}</div>
                                }
                              />
                            </div>
                            <p className="text-base text-muted-foreground">{c.descripcion}</p>
                            {c.fuente && (
                              <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 mt-2">
                                <LinkIcon size={12} />
                                Fuente
                              </a>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay controversias registradas para este candidato.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
