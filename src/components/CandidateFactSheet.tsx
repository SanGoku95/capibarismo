import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
import { TagPill } from './TagPill';
import { MiniTimelineChart } from './MiniTimelineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        
        <CardContent className="space-y-6 pt-4">
          {/* Summary */}
          <div>
            <h4 className="text-base font-semibold mb-2">Propuesta</h4>
            <p className="text-base font-sans text-muted-foreground leading-relaxed">
              {candidate.summary}
            </p>
          </div>

          <Separator />

          {/* Profession */}
          <div>
            <h4 className="text-base font-semibold mb-2">Profesión</h4>
            <p className="text-base font-sans">{candidate.profession}</p>
          </div>

          {/* Key Beliefs */}
          <div>
            <h4 className="text-base font-semibold mb-2">Creencias</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.keyBeliefs.map((belief, index) => (
                <TagPill key={index} variant="belief">
                  {belief}
                </TagPill>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="media-activity">
              <AccordionTrigger className="text-base font-semibold">Likes</AccordionTrigger>
              <AccordionContent>
                <MiniTimelineChart data={candidate.timeline} side={side} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="recent-clips">
              <AccordionTrigger className="text-base font-semibold">Novedades</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {candidate.clips.slice(0, 3).map((clip, index) => (
                    <div key={index} className="text-base font-sans text-muted-foreground">
                      • {clip.title}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="power-map">
              <AccordionTrigger className="text-base font-semibold">Trayectoria</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {candidate.powerMap.slice(0, 3).map((position, index) => (
                    <div key={index} className="text-base font-sans">
                      <span className="font-medium">{position.role}</span>
                      <span className="text-muted-foreground ml-1">
                        ({position.from}-{position.to})
                      </span>
                    </div>
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
