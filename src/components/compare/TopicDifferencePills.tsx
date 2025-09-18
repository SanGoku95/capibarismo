import { onboardingIssues, candidateIssuePositions } from "@/data/issues";
import { Candidate } from "@/data/candidates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

interface TopicDifferencePillsProps {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
}

type PillState = "agree" | "conflict" | "unknown" | "contrast";

const STATE_LABELS: Record<PillState, string> = {
  agree: "Coinciden",
  conflict: "En conflicto",
  unknown: "Sin datos",
  contrast: "Contrastan",
};

const STATE_CLASS: Record<PillState, string> = {
  agree: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
  conflict: "bg-red-500/20 text-red-200 border border-red-400/40",
  unknown: "bg-muted text-muted-foreground border border-border",
  contrast: "bg-amber-500/20 text-amber-100 border border-amber-300/40",
};

export function TopicDifferencePills({ leftCandidate, rightCandidate }: TopicDifferencePillsProps) {
  if (!leftCandidate || !rightCandidate) return null;

  const entries = onboardingIssues.map((issue) => {
    const left = candidateIssuePositions[leftCandidate.id]?.[issue.id];
    const right = candidateIssuePositions[rightCandidate.id]?.[issue.id];
    if (left === undefined || right === undefined) {
      return { issue, state: "unknown" as PillState };
    }
    const diff = Math.abs(left - right);
    if (diff < 0.3) {
      return { issue, state: "agree" as PillState };
    }
    if (diff > 0.75) {
      return { issue, state: "conflict" as PillState };
    }
    return { issue, state: "contrast" as PillState };
  });

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Diferencias por tema</h3>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-6 w-6 inline-flex items-center justify-center rounded-full border border-border text-xs"
              aria-label="Cómo se calculan las diferencias"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="max-w-xs text-xs">
            Calculamos estas etiquetas según las posiciones declaradas por cada candidatura en nuestro set de datos. Si no hay
            información verificable lo marcamos como "Sin datos".
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map(({ issue, state }) => (
          <div key={issue.id} className={`px-3 py-1 rounded-full text-[11px] font-semibold ${STATE_CLASS[state]}`}>
            <span>{issue.label}</span>
            <span className="ml-2 uppercase tracking-wide">{STATE_LABELS[state]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

