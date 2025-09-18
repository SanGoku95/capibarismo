import { MatchupDefinition } from "@/data/matchups";
import { Button } from "@/components/ui/button";
import { Sparkles, Shuffle } from "lucide-react";

interface MatchupEmptyStateProps {
  matchups: MatchupDefinition[];
  onSelect: (leftId: string, rightId: string) => void;
  onRandom: () => void;
}

export function MatchupEmptyState({ matchups, onSelect, onRandom }: MatchupEmptyStateProps) {
  return (
    <div className="container mx-auto px-4 py-12 text-center space-y-6">
      <div className="space-y-2">
        <Sparkles className="mx-auto h-8 w-8 text-accent" />
        <h2 className="text-xl font-display text-accent">Comienza un enfrentamiento</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Te sugerimos duelos populares para que descubras diferencias clave al instante. También puedes lanzar un enfrentamiento
          aleatorio.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {matchups.slice(0, 3).map((matchup) => (
          <button
            key={matchup.id}
            type="button"
            onClick={() => onSelect(matchup.candidates[0], matchup.candidates[1])}
            className="rounded-xl border border-border bg-background/80 px-4 py-4 text-left shadow-sm hover:border-primary/50 transition"
          >
            <div className="text-sm font-semibold text-foreground">{matchup.label}</div>
            <div className="text-xs text-muted-foreground mt-2">{matchup.rationale}</div>
          </button>
        ))}
      </div>
      <Button onClick={onRandom} className="inline-flex items-center gap-2">
        <Shuffle className="h-4 w-4" /> Random matchup
      </Button>
    </div>
  );
}

