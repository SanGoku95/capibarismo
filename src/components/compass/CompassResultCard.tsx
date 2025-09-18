import { Candidate } from "@/data/candidates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bookmark, Share2 } from "lucide-react";
import { useSavedStore } from "@/store/useSavedStore";
import { useMemo } from "react";

interface MatchResult {
  candidate: Candidate;
  score: number;
}

interface CompassResultCardProps {
  matches: MatchResult[];
  onCompare: (leftId: string, rightId: string) => void;
  onShare: (leftId: string, rightId: string) => void | Promise<void>;
  onFollow: (candidateId: string) => void;
}

const formatScore = (value: number) => `${Math.round(value * 100)}%`;

export function CompassResultCard({ matches, onCompare, onShare, onFollow }: CompassResultCardProps) {
  const topThree = matches.slice(0, 3);
  const topTwoIds = topThree.slice(0, 2).map((entry) => entry.candidate.id);

  const savedCandidates = useSavedStore((state) => state.savedCandidates);

  const isTopCandidateSaved = useMemo(() => {
    if (topThree.length === 0) return false;
    return savedCandidates.includes(topThree[0].candidate.id);
  }, [savedCandidates, topThree]);

  if (topThree.length === 0) return null;

  return (
    <Card className="border-primary/60 border-2 fighting-game-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-display text-accent">Tus mejores matches</CardTitle>
        <p className="text-xs text-muted-foreground">
          Resultado basado en tus temas prioritarios. Puedes volver a la brújula cuando quieras para actualizarlo.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {topThree.map((entry, index) => (
            <div
              key={entry.candidate.id}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-accent">#{index + 1}</span>
                <img
                  src={entry.candidate.headshot}
                  alt={entry.candidate.nombre}
                  className="h-10 w-10 rounded-full object-cover border border-accent/50"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">{entry.candidate.nombre}</div>
                  <div className="text-xs text-muted-foreground">{entry.candidate.ideologia}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-accent">{formatScore(entry.score)}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              if (topTwoIds.length === 2) {
                onCompare(topTwoIds[0], topTwoIds[1]);
              }
            }}
          >
            Comparar top 2 ahora
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (topTwoIds.length === 2) {
                onShare(topTwoIds[0], topTwoIds[1]);
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" /> Compartir resultado
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center text-xs">
          <Button
            variant={isTopCandidateSaved ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onFollow(topThree[0].candidate.id)}
            className="flex items-center gap-2"
          >
            <Bookmark className="h-3.5 w-3.5" />
            {isTopCandidateSaved ? "Siguiendo" : `Seguir a ${topThree[0].candidate.nombre.split(" ")[0]}`}
          </Button>
          <Link
            to="#newsletter"
            className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            Recibe actualizaciones semanales
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

