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

interface ComparisonRowProps {
  label: string;
  leftValue: React.ReactNode;
  rightValue: React.ReactNode;
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  highlight?: boolean;
}

function ComparisonRow({ label, leftValue, rightValue, leftCandidate, rightCandidate, highlight = false }: ComparisonRowProps) {
  const hasLeftCandidate = leftCandidate !== null;
  const hasRightCandidate = rightCandidate !== null;
  
  return (
    <div className={cn(
      "grid grid-cols-[60px_1fr_1fr] gap-2 py-3 border-b border-border/50",
      highlight && "bg-accent/20"
    )}>
      <div className="text-lg text-center sticky left-0 bg-background/80 backdrop-blur-sm pr-2 flex items-center justify-center">
        {label}
      </div>
      <div className={cn(
        "text-sm px-2 py-1 rounded",
        hasLeftCandidate ? "bg-team-left/10 border-l-2 border-team-left/30" : "text-muted-foreground italic"
      )}>
        {leftValue}
      </div>
      <div className={cn(
        "text-sm px-2 py-1 rounded",
        hasRightCandidate ? "bg-team-right/10 border-l-2 border-team-right/30" : "text-muted-foreground italic"
      )}>
        {rightValue}
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

      {/* Scrollable Comparison Grid */}
      <Card className="fighting-game-card">
        <CardContent className="p-0">
          <div className="max-w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ComparisonRow
                label="💡"
                leftValue={leftCandidate?.summary || "Selecciona un candidato"}
                rightValue={rightCandidate?.summary || "Selecciona un candidato"}
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                highlight={leftCandidate && rightCandidate && leftCandidate.summary !== rightCandidate.summary}
              />
              
              <ComparisonRow
                label="👔"
                leftValue={leftCandidate?.profession || "—"}
                rightValue={rightCandidate?.profession || "—"}
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
                highlight={leftCandidate && rightCandidate && leftCandidate.profession !== rightCandidate.profession}
              />
              
              <ComparisonRow
                label="🎯"
                leftValue={
                  leftCandidate ? (
                    <div className="flex flex-wrap gap-1">
                      {leftCandidate.keyBeliefs.slice(0, 3).map((belief, index) => (
                        <TagPill key={index} variant="belief" className="text-xs">
                          {belief}
                        </TagPill>
                      ))}
                    </div>
                  ) : "—"
                }
                rightValue={
                  rightCandidate ? (
                    <div className="flex flex-wrap gap-1">
                      {rightCandidate.keyBeliefs.slice(0, 3).map((belief, index) => (
                        <TagPill key={index} variant="belief" className="text-xs">
                          {belief}
                        </TagPill>
                      ))}
                    </div>
                  ) : "—"
                }
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
              />
              
              <ComparisonRow
                label="📺"
                leftValue={
                  leftCandidate ? (
                    <div className="space-y-1">
                      {leftCandidate.clips.slice(0, 2).map((clip, index) => (
                        <div key={index} className="text-xs text-muted-foreground truncate">
                          • {clip.title}
                        </div>
                      ))}
                    </div>
                  ) : "—"
                }
                rightValue={
                  rightCandidate ? (
                    <div className="space-y-1">
                      {rightCandidate.clips.slice(0, 2).map((clip, index) => (
                        <div key={index} className="text-xs text-muted-foreground truncate">
                          • {clip.title}
                        </div>
                      ))}
                    </div>
                  ) : "—"
                }
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
              />
              
              <ComparisonRow
                label="📈"
                leftValue={
                  leftCandidate ? (
                    <div className="space-y-1">
                      {leftCandidate.powerMap.slice(0, 2).map((position, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-medium truncate">{position.role}</div>
                          <div className="text-muted-foreground">
                            {position.from}-{position.to}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : "—"
                }
                rightValue={
                  rightCandidate ? (
                    <div className="space-y-1">
                      {rightCandidate.powerMap.slice(0, 2).map((position, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-medium truncate">{position.role}</div>
                          <div className="text-muted-foreground">
                            {position.from}-{position.to}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : "—"
                }
                leftCandidate={leftCandidate}
                rightCandidate={rightCandidate}
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}