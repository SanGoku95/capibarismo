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

import { InfoBadge } from './InfoBadge';
import { severityProps, legalProps, severityHelp, legalHelp } from './controversy-utils';

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
                    return null;
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
                  {(() => {
                    const controversies = profile?.controversias ?? [];
                    return controversies.length > 0 ? (
                      <>
                        {controversies
                          .slice()
                          .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                          .slice(0, 3)
                          .map((c) => {
                            const s = severityProps(c.severidad);
                            const l = legalProps(c.legal);
                            return (
                              <div key={c.id} className="block p-2 rounded-md hover:bg-muted/50">
                                <Link to={`/candidate/${candidate.id}#controversia-${c.id}`} className="text-base font-sans font-medium hover:underline">
                                  {c.titulo}
                                </Link>
                                <div className="flex flex-wrap gap-2 my-1">
                                  <InfoBadge
                                    className={s.className}
                                    label={s.label}
                                    description={<div><span className="font-semibold">Severidad:</span> {severityHelp(c.severidad)}</div>}
                                  />
                                  <InfoBadge
                                    className={l.className}
                                    label={l.label}
                                    description={<div><span className="font-semibold">Estado legal:</span> {legalHelp(c.legal)}</div>}
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
                    ) : null;
                  })()}
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
                  ) : null}
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
                    : null}
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
