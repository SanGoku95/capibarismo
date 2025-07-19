import { motion } from 'framer-motion';
import { Candidate } from '@/data/candidates';
import { TagPill } from './TagPill';
import { MiniTimelineChart } from './MiniTimelineChart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CandidateComparisonGridProps {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
}

interface ComparisonSectionProps {
  title: string;
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  highlight?: boolean;
}

function ComparisonSection({ title, leftCandidate, rightCandidate, leftContent, rightContent, highlight = false }: ComparisonSectionProps) {
  const hasLeftCandidate = leftCandidate !== null;
  const hasRightCandidate = rightCandidate !== null;
  
  return (
    <div className={cn(
      "space-y-3 pb-6 border-b border-border/50",
      highlight && "bg-accent/10 p-4 rounded-lg"
    )}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className={cn(
          "p-3 rounded-lg border",
          hasLeftCandidate ? "bg-team-left/5 border-team-left/20" : "bg-muted/20 border-muted text-muted-foreground italic"
        )}>
          {leftContent}
        </div>
        <div className={cn(
          "p-3 rounded-lg border", 
          hasRightCandidate ? "bg-team-right/5 border-team-right/20" : "bg-muted/20 border-muted text-muted-foreground italic"
        )}>
          {rightContent}
        </div>
      </div>
    </div>
  );
}

export function CandidateComparisonGrid({ leftCandidate, rightCandidate }: CandidateComparisonGridProps) {
  return (
    <div className="space-y-4">
      {/* Sticky Headers */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
        <Card className="fighting-game-card">
          <CardHeader className="pb-3">
            <div className="grid grid-cols-[60px_1fr_1fr] gap-2">
              <div className="flex items-center justify-center">
                <span className="text-xs font-bold text-primary">VS</span>
              </div>
              
              {/* Left Candidate Header */}
              <div className="flex items-center gap-2">
                {leftCandidate ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-team-left flex items-center justify-center text-white font-bold text-xs">
                      1
                    </div>
                    <img
                      src={leftCandidate.headshot}
                      alt={leftCandidate.nombre}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{leftCandidate.nombre}</div>
                      <Badge className="text-xs bg-team-left text-team-left-foreground">
                        {leftCandidate.ideologia}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-team-left flex items-center justify-center text-white font-bold text-xs mb-1">
                      1
                    </div>
                    <span className="text-xs">Candidato 1</span>
                  </div>
                )}
              </div>
              
              {/* Right Candidate Header */}
              <div className="flex items-center gap-2">
                {rightCandidate ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-team-right flex items-center justify-center text-white font-bold text-xs">
                      2
                    </div>
                    <img
                      src={rightCandidate.headshot}
                      alt={rightCandidate.nombre}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{rightCandidate.nombre}</div>
                      <Badge className="text-xs bg-team-right text-team-right-foreground">
                        {rightCandidate.ideologia}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-team-right flex items-center justify-center text-white font-bold text-xs mb-1">
                      2
                    </div>
                    <span className="text-xs">Candidato 2</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Comparison Sections */}
      <Card className="fighting-game-card">
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ComparisonSection
              title="Propuesta Principal"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={leftCandidate?.summary || "Selecciona un candidato"}
              rightContent={rightCandidate?.summary || "Selecciona un candidato"}
              highlight={leftCandidate && rightCandidate && leftCandidate.summary !== rightCandidate.summary}
            />
            
            <ComparisonSection
              title="Ocupación"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={leftCandidate?.profession || "No especificada"}
              rightContent={rightCandidate?.profession || "No especificada"}
              highlight={leftCandidate && rightCandidate && leftCandidate.profession !== rightCandidate.profession}
            />
            
            <ComparisonSection
              title="Ideología"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={leftCandidate?.ideologia || "No especificada"}
              rightContent={rightCandidate?.ideologia || "No especificada"}
              highlight={leftCandidate && rightCandidate && leftCandidate.ideologia !== rightCandidate.ideologia}
            />
            
            <ComparisonSection
              title="Principales Creencias"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                leftCandidate ? (
                  <div className="flex flex-wrap gap-1">
                    {leftCandidate.keyBeliefs.slice(0, 4).map((belief, index) => (
                      <TagPill key={index} variant="belief" className="text-xs">
                        {belief}
                      </TagPill>
                    ))}
                  </div>
                ) : "No especificadas"
              }
              rightContent={
                rightCandidate ? (
                  <div className="flex flex-wrap gap-1">
                    {rightCandidate.keyBeliefs.slice(0, 4).map((belief, index) => (
                      <TagPill key={index} variant="belief" className="text-xs">
                        {belief}
                      </TagPill>
                    ))}
                  </div>
                ) : "No especificadas"
              }
            />
            
            <ComparisonSection
              title="Contenido Reciente"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                leftCandidate ? (
                  <div className="space-y-2">
                    {leftCandidate.clips.slice(0, 3).map((clip, index) => (
                      <div key={index} className="text-sm border-l-2 border-team-left/30 pl-2">
                        {clip.title}
                      </div>
                    ))}
                  </div>
                ) : "Sin contenido"
              }
              rightContent={
                rightCandidate ? (
                  <div className="space-y-2">
                    {rightCandidate.clips.slice(0, 3).map((clip, index) => (
                      <div key={index} className="text-sm border-l-2 border-team-right/30 pl-2">
                        {clip.title}
                      </div>
                    ))}
                  </div>
                ) : "Sin contenido"
              }
            />
            
            <ComparisonSection
              title="Experiencia Política"
              leftCandidate={leftCandidate}
              rightCandidate={rightCandidate}
              leftContent={
                leftCandidate ? (
                  <div className="space-y-2">
                    {leftCandidate.powerMap.slice(0, 3).map((position, index) => (
                      <div key={index} className="border-l-2 border-team-left/30 pl-2">
                        <div className="font-medium text-sm">{position.role}</div>
                        <div className="text-xs text-muted-foreground">
                          {position.from} - {position.to}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : "Sin experiencia registrada"
              }
              rightContent={
                rightCandidate ? (
                  <div className="space-y-2">
                    {rightCandidate.powerMap.slice(0, 3).map((position, index) => (
                      <div key={index} className="border-l-2 border-team-right/30 pl-2">
                        <div className="font-medium text-sm">{position.role}</div>
                        <div className="text-xs text-muted-foreground">
                          {position.from} - {position.to}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : "Sin experiencia registrada"
              }
            />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}