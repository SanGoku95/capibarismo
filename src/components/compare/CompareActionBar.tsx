import { useMemo, useState } from "react";
import { candidates } from "@/data/candidates";
import { trendingMatchups } from "@/data/issues";
import { useCompareStore } from "@/store/useCompareStore";
import { useUserPreferences } from "@/store/useUserPreferences";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { buildCompareUrl } from "@/lib/compass";
import { Pin, Shuffle, Share2, BookmarkPlus, ArrowRight } from "lucide-react";

const randomCandidate = (excludeIds: string[] = []) => {
  const pool = candidates.filter((candidate) => !excludeIds.includes(candidate.id));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};

export function CompareActionBar() {
  const {
    leftCandidate,
    rightCandidate,
    pinnedLeft,
    pinnedRight,
    togglePin,
    setPair,
  } = useCompareStore();
  const { saveMatchup, recordMatchupView, savedMatchups, incrementHighIntent } = useUserPreferences();
  const [nextIndex, setNextIndex] = useState(0);

  const canShare = leftCandidate && rightCandidate;
  const canSave = leftCandidate && rightCandidate;

  const matchupQueue = useMemo(() => {
    if (savedMatchups.length > 0) {
      const queue = savedMatchups
        .map((matchup) => {
          const left = candidates.find((candidate) => candidate.id === matchup.a);
          const right = candidates.find((candidate) => candidate.id === matchup.b);
          if (!left || !right) return null;
          return { a: matchup.a, b: matchup.b, headline: `${left.nombre.split(" ")[0]} vs ${right.nombre.split(" ")[0]}` };
        })
        .filter(Boolean) as { a: string; b: string; headline: string }[];
      if (queue.length > 0) return queue;
    }
    return trendingMatchups;
  }, [savedMatchups]);

  const cycleMatchup = () => {
    if (matchupQueue.length === 0) return;
    const item = matchupQueue[nextIndex % matchupQueue.length];
    const left = candidates.find((candidate) => candidate.id === item.a);
    const right = candidates.find((candidate) => candidate.id === item.b);
    if (left && right) {
      setPair(left, right);
      recordMatchupView(left.id, right.id);
      toast({ title: "Matchup cargado", description: `${left.nombre.split(" ")[0]} vs ${right.nombre.split(" ")[0]}` });
    }
    setNextIndex((prev) => prev + 1);
  };

  const randomiseMatchup = () => {
    const currentIds = [leftCandidate?.id, rightCandidate?.id].filter(Boolean) as string[];
    let newLeft = leftCandidate;
    let newRight = rightCandidate;
    if (!pinnedLeft) {
      newLeft = randomCandidate([pinnedRight && rightCandidate ? rightCandidate.id : "", ...currentIds].filter(Boolean));
    }
    if (!pinnedRight) {
      const exclude = [newLeft?.id, pinnedLeft && leftCandidate ? leftCandidate.id : ""]
        .filter(Boolean) as string[];
      newRight = randomCandidate(exclude);
    }
    if (!newLeft || !newRight || newLeft.id === newRight.id) {
      const fallbackLeft = randomCandidate();
      const fallbackRight = randomCandidate(fallbackLeft ? [fallbackLeft.id] : []);
      if (fallbackLeft && fallbackRight) {
        setPair(fallbackLeft, fallbackRight);
        recordMatchupView(fallbackLeft.id, fallbackRight.id);
      }
      return;
    }
    setPair(newLeft, newRight);
    recordMatchupView(newLeft.id, newRight.id);
  };

  const share = async () => {
    if (!leftCandidate || !rightCandidate) return;
    const url = buildCompareUrl(leftCandidate.id, rightCandidate.id);
    const text = `Comparación: ${leftCandidate.nombre} vs ${rightCandidate.nombre}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Comparador presidencial", text, url });
        incrementHighIntent();
        return;
      } catch (error) {
        console.error("Share failed", error);
      }
    }
    try {
      if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast({ title: "Copiado", description: "Enlace listo para enviar" });
        incrementHighIntent();
      }
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const handleSave = () => {
    if (!leftCandidate || !rightCandidate) return;
    saveMatchup(leftCandidate.id, rightCandidate.id);
    toast({
      title: "Matchup guardado",
      description: `${leftCandidate.nombre.split(" ")[0]} vs ${rightCandidate.nombre.split(" ")[0]} listo en tu pestaña Guardados`,
    });
  };

  return (
    <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-3 py-2 backdrop-blur">
      <Button
        variant={pinnedLeft ? "secondary" : "outline"}
        size="sm"
        onClick={() => togglePin("left")}
        disabled={!leftCandidate}
        className="flex-1"
      >
        <Pin className="mr-2 h-4 w-4" /> {pinnedLeft ? "P1 fijo" : "Fijar P1"}
      </Button>
      <Button
        variant={pinnedRight ? "secondary" : "outline"}
        size="sm"
        onClick={() => togglePin("right")}
        disabled={!rightCandidate}
        className="flex-1"
      >
        <Pin className="mr-2 h-4 w-4" /> {pinnedRight ? "P2 fijo" : "Fijar P2"}
      </Button>
      <Button variant="outline" size="sm" onClick={randomiseMatchup} className="flex-1">
        <Shuffle className="mr-2 h-4 w-4" /> Random
      </Button>
      <Button variant="outline" size="sm" onClick={cycleMatchup} className="flex-1">
        <ArrowRight className="mr-2 h-4 w-4" /> Próximo duelo
      </Button>
      <Button variant="outline" size="sm" onClick={share} disabled={!canShare} className="flex-1">
        <Share2 className="mr-2 h-4 w-4" /> Compartir
      </Button>
      <Button variant="secondary" size="sm" onClick={handleSave} disabled={!canSave} className="flex-1">
        <BookmarkPlus className="mr-2 h-4 w-4" /> Guardar
      </Button>
    </div>
  );
}
