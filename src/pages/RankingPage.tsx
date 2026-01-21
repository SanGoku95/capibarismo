import { usePersonalRanking, getSessionId, resetSession } from '@/hooks/useGameAPI';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Trophy, Info, Medal, AlertCircle, RotateCcw, Play, AlertTriangle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { base } from '@/data/domains/base';
import { useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/sessionService';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';

export function RankingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Support viewing specific session rankings via URL (from CompletionModal), 
  // or default to current user's session from storage
  const sessionId = searchParams.get('sessionId') || getSessionId();
  
  const { data: rankings, isLoading, error } = usePersonalRanking(sessionId);
  
  // Get vote count to determine if ranking is preliminary
  const voteCount = sessionService.getVoteCount(sessionId);
  const isPreliminary = voteCount >= PRELIMINARY_GOAL && voteCount < RECOMMENDED_GOAL;
  const progressPercent = isPreliminary
    ? Math.min(
        100,
        Math.round(
          ((voteCount - PRELIMINARY_GOAL) / (RECOMMENDED_GOAL - PRELIMINARY_GOAL)) * 100
        )
      )
    : 0;
  
  // Check if the user has actually played any games
  // The API returns all candidates with 0 games if no history exists, so length check isn't enough
  const hasPlayed = rankings && rankings.some(r => r.games > 0);
  
  const handleNewGame = () => {
    // Reset session and clear all cached data
    const newSessionId = resetSession();
    
    // Clear all queries related to the old session
    queryClient.clear();
    
    // Navigate to game page with new session
    navigate('/jugar');
  };

  const handleContinuePlaying = () => {
    navigate('/jugar');
  };
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-6 h-6 text-yellow-400 drop-shadow-md" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300 drop-shadow-md" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" />;
    return <span className="text-muted-foreground font-mono">#{rank}</span>;
  };
  
  return (
    <div className="min-h-screen fighting-game-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: 'hsl(var(--accent))',
                textShadow: '3px 3px 0px hsl(var(--background)), 5px 5px 0px hsl(var(--border))',
              }}
            >
              {isPreliminary ? 'Ranking Borrador' : 'Ranking Personal'}
            </h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
            Ranking basado en tus decisiones durante esta sesión.
            Los puntajes se calculan usando el sistema Elo para reflejar tus preferencias.
          </p>
          
          {/* CTA - only show Nueva Partida here, continue is in the banner */}
          {!isPreliminary && (
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <Button 
                onClick={handleNewGame} 
                size="lg" 
                className="gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                Nueva Partida
              </Button>
            </div>
          )}
        </div>

        {/* Preliminary ranking banner with CTA */}
        {isPreliminary && hasPlayed && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium">Ranking Borrador</p>
                <p className="text-white/70 text-sm">
                  {voteCount}/{RECOMMENDED_GOAL} comparaciones. 
                  Continúa para mejorar la precisión de tu ranking.
                </p>
              </div>
              <Button 
                onClick={handleContinuePlaying} 
                size="sm"
                className="flex-shrink-0 gap-2"
              >
                <Play className="w-4 h-4" />
                Seguir Comparando
              </Button>
            </div>
            <Progress value={progressPercent} className="mt-3 h-2" />
          </div>
        )}
        
        {/* Rankings table */}
        <div className="bg-background/90 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          {isLoading && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Calculando ranking...</p>
            </div>
          )}
          
          {error && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">Error al cargar rankings</p>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          )}
          
          {rankings && !hasPlayed && !isLoading && (
            <div className="p-16 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aún no hay datos</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Necesitas comparar candidatos para generar tu ranking personal.
                ¡Juega unas cuantas rondas para ver quién es tu favorito!
              </p>
              <Button onClick={handleNewGame} variant="secondary">
                Nueva Partida
              </Button>
            </div>
          )}
          
          {rankings && hasPlayed && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead>Candidato</TableHead>
                    <TableHead className="w-20 text-center">Ranking</TableHead>
                    <TableHead className="text-right">Partidas</TableHead>
                    <TableHead className="text-right">% Victorias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((entry) => {
                    const candidateData = base[entry.candidateId];
                    const imageUrl = candidateData?.fullBody;
                    
                    return (
                      <TableRow key={entry.candidateId} className="hover:bg-white/5 border-white/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {imageUrl && (
                              <div className="relative w-12 h-12 rounded overflow-hidden bg-white/10 border border-white/10">
                                <img
                                  src={imageUrl}
                                  alt={entry.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white">{entry.name}</div>
                              {entry.ideologia && (
                                <div className="text-xs text-white/60">{entry.ideologia}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <div className="flex justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-white/70 font-medium">
                          {entry.games}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "font-bold",
                            entry.winRate >= 60 ? 'text-green-400' : 
                            entry.winRate >= 40 ? 'text-yellow-400' : 
                            'text-red-400'
                          )}>
                            {entry.winRate}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Explainer */}
        <div className="mt-8 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="border-white/10">
            <AccordionItem value="explainer" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-primary hover:no-underline">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  ¿Cómo se calcula el ranking?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/80 space-y-3">
                <p>
                  El ranking se calcula usando el <strong>sistema Elo</strong>, 
                  adaptado para ordenar a los candidatos según tus preferencias personales.
                </p>
                <p>
                  Cada vez que eliges un candidato sobre otro, sus ratings se actualizan:
                  el ganador sube y el perdedor baja. Esto nos permite construir una lista
                  ordenada que refleja tus decisiones, incluso entre candidatos que no has comparado directamente.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/70">
                  <li><strong>Partidas:</strong> Número de enfrentamientos directos en los que participó el candidato.</li>
                  <li><strong>% Victorias:</strong> Porcentaje de victorias en enfrentamientos directos.</li>
                </ul>
                {isPreliminary && (
                  <p className="text-yellow-400/80 text-sm pt-2 border-t border-white/10 mt-2">
                    ⚠️ Este es un ranking borrador. Recomendamos completar {RECOMMENDED_GOAL} comparaciones para resultados más precisos.
                  </p>
                )}
                <p className="text-xs text-white/50 pt-2 border-t border-white/10 mt-2">
                  Nota: Este es un ranking de preferencia personal basado únicamente en tus decisiones de esta sesión.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
