import { Candidate } from "@/data/candidates";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Pin, Shuffle, ArrowRightLeft, Share2 } from "lucide-react";

interface CompareActionBarProps {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  pinnedSide: 'left' | 'right' | null;
  onTogglePin: (side: 'left' | 'right') => void;
  onRandom: () => void;
  onShare: () => void;
  onSave: () => void;
  onNextMatchup: () => void;
}

export function CompareActionBar({
  leftCandidate,
  rightCandidate,
  pinnedSide,
  onTogglePin,
  onRandom,
  onShare,
  onSave,
  onNextMatchup,
}: CompareActionBarProps) {
  return (
    <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
          <span>Matchups</span>
          <Button variant="ghost" size="sm" onClick={onNextMatchup} className="inline-flex items-center gap-2">
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Siguiente duelo
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={pinnedSide === 'left' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTogglePin('left')}
            disabled={!leftCandidate}
            className="flex items-center gap-2"
          >
            <Pin className="h-3.5 w-3.5" /> {pinnedSide === 'left' ? 'Fijado P1' : 'Fijar P1'}
          </Button>
          <Button
            variant={pinnedSide === 'right' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTogglePin('right')}
            disabled={!rightCandidate}
            className="flex items-center gap-2"
          >
            <Pin className="h-3.5 w-3.5" /> {pinnedSide === 'right' ? 'Fijado P2' : 'Fijar P2'}
          </Button>
          <Button onClick={onRandom} size="sm" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" /> Random matchup
          </Button>
          <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Compartir
          </Button>
          <Button variant="outline" size="sm" onClick={onSave} className="flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4" /> Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

