import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
import { TagPill } from './TagPill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Briefcase, Power, Radio } from 'lucide-react';

interface CandidateFactSheetProps {
  candidate: Candidate | null;
  side: 'left' | 'right';
}

export function CandidateFactSheet({ candidate, side }: CandidateFactSheetProps) {
  const borderColor = side === 'left' ? 'border-l-team-left' : 'border-l-team-right';
  const badgeColor = side === 'left' ? 'bg-team-left text-team-left-foreground' : 'bg-team-right text-team-right-foreground';
  
  if (!candidate) {
    return (
      <Card className={`h-full ${borderColor} border-l-4 fighting-game-card`}>
        <CardContent className="flex items-center justify-center h-full p-8">
          <div className="text-center text-muted-foreground">
            <div className={cn(
              "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl",
              side === 'left' ? 'bg-team-left' : 'bg-team-right'
            )}>
              {side === 'left' ? '1' : '2'}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Candidato {side === 'left' ? '1' : '2'}
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
      <Card className={`h-full ${borderColor} border-l-4 fighting-game-card`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs",
                  side === 'left' ? 'bg-team-left' : 'bg-team-right'
                )}>
                  {side === 'left' ? '1' : '2'}
                </div>
                <CardTitle className="text-lg md:text-xl font-bold">
                  <Link to={`/candidate/${candidate.id}`} className="hover:underline">
                    {candidate.nombre}
                  </Link>
                </CardTitle>
              </div>
              <Badge className={`text-xs md:text-sm ${badgeColor}`}>
                {candidate.ideologia}
              </Badge>
            </div>
            <img
              src={candidate.headshot}
              alt={`Retrato de ${candidate.nombre}`}
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
            <Accordion type="single" collapsible className="w-full">
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
            
            {/* Creencias Clave */}
            <div id="creencias-clave-compare" className="py-4">
              <h4 className="text-base font-semibold mb-2">Creencias Clave</h4>
              <div className="flex flex-wrap gap-2">
              {candidate.creenciasClave.map((creencia) => (
                <Link key={creencia.id} to={`/candidate/${candidate.id}#creencia-${creencia.id}`}>
                  <TagPill variant="belief">
                    {creencia.nombre}
                  </TagPill>
                </Link>
              ))}
              </div>
            </div>
            
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

            <AccordionItem value="presencia-digital">
              <AccordionTrigger className="text-base font-semibold">
                <Radio size={16} className="mr-2" /> Presencia Digital
              </AccordionTrigger>
              <AccordionContent>
                <Link to={`/candidate/${candidate.id}#presencia-digital`} className="text-base font-sans text-muted-foreground leading-relaxed pt-2 hover:underline line-clamp-4">
                  {Object.entries(candidate.presenciaDigital).map(([key, value]) => value).join(' ')}
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mapa-de-poder">
              <AccordionTrigger className="text-base font-semibold">
                <Power size={16} className="mr-2" /> Mapa de Poder
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2 text-base font-sans">
                  <Link to={`/candidate/${candidate.id}#mapa-de-poder`} className="block p-2 rounded-md hover:bg-muted/50">
                    <span className="font-medium">Alianzas:</span>
                    <span className="text-muted-foreground ml-1">{candidate.mapaDePoder.alianzas.map(a => a.nombre).join(', ')}</span>
                  </Link>
                   <Link to={`/candidate/${candidate.id}#mapa-de-poder`} className="block p-2 rounded-md hover:bg-muted/50">
                    <span className="font-medium">Seguidores:</span>
                    <span className="text-muted-foreground ml-1">{candidate.mapaDePoder.seguidores}</span>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
