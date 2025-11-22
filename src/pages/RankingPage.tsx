import { usePersonalRanking, getSessionId } from '@/hooks/useGameAPI';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trophy, TrendingUp, Info, Medal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function RankingPage() {
  const [searchParams] = useSearchParams();
  // Support viewing specific session rankings via URL (from CompletionModal), 
  // or default to current user's session from storage
  const sessionId = searchParams.get('sessionId') || getSessionId();
  
  const { data: rankings, isLoading, error } = usePersonalRanking(sessionId);
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-muted-foreground">#{rank}</span>;
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
          <div className="mt-6">
            <Button asChild size="lg" className="gap-2">
              <Link to="/jugar">
                <TrendingUp className="w-5 h-5" />
                {rankings && rankings.length > 0 ? 'Seguir jugando' : 'Jugar ahora'}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Rankings table */}
        <div className="bg-background/90 rounded-lg border shadow-lg overflow-hidden">
          {isLoading && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando rankings...</p>
            </div>
          )}
          
          {error && (
            <div className="p-12 text-center">
              <p className="text-destructive mb-4">Error al cargar rankings</p>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          )}
          
          {rankings && rankings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No hay datos de ranking aún</p>
              <Button asChild>
                <Link to="/jugar">Sé el primero en jugar</Link>
              </Button>
            </div>
          )}
          
          {rankings && rankings.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Rank</TableHead>
                    <TableHead>Candidato</TableHead>
                    <TableHead className="text-right">Puntaje</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Rating Elo</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Partidas</TableHead>
                    <TableHead className="text-right hidden lg:table-cell">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((entry) => (
                    <TableRow key={entry.candidateId}>
                      <TableCell className="font-medium">
                        {getRankBadge(entry.rank)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {entry.imageFullBodyUrl && (
                            <img
                              src={entry.imageFullBodyUrl}
                              alt={entry.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{entry.name}</div>
                            {entry.ideologia && (
                              <div className="text-xs text-muted-foreground">{entry.ideologia}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={entry.rank <= 3 ? 'default' : 'secondary'}>
                          {entry.score}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        {entry.rating}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {entry.games}
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <span className={cn(
                          entry.winRate >= 60 ? 'text-green-600' : 
                          entry.winRate >= 40 ? 'text-yellow-600' : 
                          'text-red-600'
                        )}>
                          {entry.winRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Explainer */}
        <div className="mt-8 max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="explainer">
              <AccordionTrigger className="text-white">
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
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li> Normalizado para facilitar la comparación.</li>
                  <li> El valor interno usado para ordenar (inicia en 1200).</li>
                  <li> Qué tan confiable es el rating. Mejora con más comparaciones.</li>
                </ul>
                <p className="text-xs text-white/60">
                  Nota: Este es un ranking de preferencia personal basado en tus decisiones de esta sesión.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
