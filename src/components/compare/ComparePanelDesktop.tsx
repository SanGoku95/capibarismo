import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
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
import { Shield, Briefcase, Power, Radio, Sparkles, AlertTriangle } from 'lucide-react';
import { PLAYER_INDICATORS, type CandidateSide } from '@/lib/constants';

interface CandidateFactSheetProps {
  candidate: Candidate | null;
  side: CandidateSide;
  openSection: string | null; // Shared state for open accordion section
  setOpenSection: (section: string | null) => void; // Setter for shared state
}

export function CandidateFactSheet({ candidate, side, openSection, setOpenSection }: CandidateFactSheetProps) {
  const config = PLAYER_INDICATORS[side];
  
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
            <CandidateAvatar
              src={candidate.headshot}
              alt={`Retrato de ${candidate.nombre}`}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openSection}
            onValueChange={(value) => setOpenSection(value)}
          >
            <AccordionItem value="proyecto-politico">
              <AccordionTrigger className="text-base font-semibold">
                <Shield size={16} className="mr-2" /> Proyecto Político
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <Link to={`/candidate/${candidate.id}#proyecto-politico`} className="font-bold text-foreground hover:underline">{candidate.proyectoPolitico.titulo}</Link>
                  <p className="text-base font-sans text-muted-foreground leading-relaxed mt-1 line-clamp-4">
                    {candidate.proyectoPolitico.resumen}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creencias-clave">
              <AccordionTrigger className="text-base font-semibold">
                <Sparkles size={16} className="mr-2" /> Creencias Clave
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {candidate.creenciasClave.map((creencia) => (
                    <Link key={creencia.id} to={`/candidate/${candidate.id}#creencia-${creencia.id}`}>
                      <TagPill variant="belief">
                        {creencia.nombre}
                      </TagPill>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="trayectoria">
              <AccordionTrigger className="text-base font-semibold">
                <Briefcase size={16} className="mr-2" /> Trayectoria
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-2">
                  {candidate.trayectoria.slice(0, 3).map((position) => (
                    <Link to={`/candidate/${candidate.id}#${position.id}`} key={position.id} className="block p-2 rounded-md hover:bg-muted/50">
                      <div className="text-base font-sans">
                        <span className="font-medium">{position.rol}</span>
                        <span className="text-muted-foreground ml-1 text-sm">
                          ({position.periodo})
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Controversias antes de Mapa de Poder */}
            <AccordionItem value="controversias">
              <AccordionTrigger className="text-base font-semibold">
                <AlertTriangle size={16} className="mr-2" /> Controversias
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-2">
                  {candidate.controversias && candidate.controversias.length > 0 ? (
                    candidate.controversias.slice(0, 3).map((c) => (
                      <div key={c.id} className="block p-2 rounded-md hover:bg-muted/50">
                        <Link
                          to={`/candidate/${candidate.id}#controversia-${c.id}`}
                          className="text-base font-sans font-medium hover:underline"
                        >
                          {c.titulo}
                        </Link>
                        <div className="text-sm text-muted-foreground">{c.descripcion}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <a href={c.fuente} target="_blank" rel="noopener noreferrer" className="underline">
                            Fuente
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin controversias registradas.</p>
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
                  {candidate.mapaDePoder?.alianzas?.length
                    ? candidate.mapaDePoder.alianzas.slice(0, 3).map((alianza) => (
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

            {/* MOVED: Presencia Digital ahora al final */}
            <AccordionItem value="presencia-digital">
              <AccordionTrigger className="text-base font-semibold">
                <Radio size={16} className="mr-2" /> Presencia Digital
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {candidate.presenciaDigital.plataformas.map((platform) => (
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
