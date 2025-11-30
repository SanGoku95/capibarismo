import { usePersonalRanking, getSessionId, resetSession } from '@/hooks/useGameAPI';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trophy, Info, Medal, AlertCircle, RotateCcw } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { base } from '@/data/domains/base';
import { useQueryClient } from '@tanstack/react-query';

export function RankingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Support viewing specific session rankings via URL (from CompletionModal), 
  // or default to current user's session from storage
  const sessionId = searchParams.get('sessionId') || getSessionId();
  
  const { data: rankings, isLoading, error } = usePersonalRanking(sessionId);
  
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
              Ranking Personal
            </h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
            Ranking basado en tus decisiones durante esta sesión.
            Los puntajes se calculan usando el sistema Elo para reflejar tus preferencias.
          </p>
          
          {/* CTA to play */}
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
        </div>
        
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
                    <TableHead className="w-20 text-center">Rank</TableHead>
                    <TableHead>Candidato</TableHead>
                    <TableHead className="text-right">Puntaje</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Rating Elo</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Partidas</TableHead>
                    <TableHead className="text-right hidden lg:table-cell">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((entry) => {
                    const candidateData = base[entry.candidateId];
                    const imageUrl = candidateData?.fullBody;
                    
                    return (
                      <TableRow key={entry.candidateId} className="hover:bg-white/5 border-white/5 transition-colors">
                        <TableCell className="font-medium text-center">
                          <div className="flex justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
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
                        <TableCell className="text-right">
                          <Badge 
                            variant={entry.rank <= 3 ? 'default' : 'secondary'}
                            className={cn(
                              "font-mono text-sm",
                              entry.rank === 1 && "bg-yellow-500 hover:bg-yellow-600 text-black",
                              entry.rank === 2 && "bg-gray-300 hover:bg-gray-400 text-black",
                              entry.rank === 3 && "bg-amber-600 hover:bg-amber-700"
                            )}
                          >
                            {entry.score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell font-mono text-white/70">
                          {entry.rating}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell text-white/70">
                          {entry.games}
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell">
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
                  <li><strong>Puntaje:</strong> Valor normalizado para facilitar la comparación.</li>
                  <li><strong>Rating Elo:</strong> El valor matemático interno (inicia en 1200).</li>
                  <li><strong>Win Rate:</strong> Porcentaje de victorias en enfrentamientos directos.</li>
                </ul>
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
