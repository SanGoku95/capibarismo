import { Candidate } from "@/data/candidates";
import { candidateIssuePositions, compassIssues } from "@/data/issues";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const getTagLabel = (left?: number, right?: number) => {
  if (left === undefined || right === undefined) {
    return { label: "Sin datos", intent: "muted" as const };
  }
  if (left === right) {
    return { label: "Coinciden", intent: "success" as const };
  }
  if (left * right === -1) {
    return { label: "En conflicto", intent: "destructive" as const };
  }
  return { label: "Matices", intent: "warning" as const };
};

const getBadgeClasses = (intent: "success" | "destructive" | "warning" | "muted") => {
  switch (intent) {
    case "success":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/50";
    case "destructive":
      return "bg-rose-500/15 text-rose-200 border-rose-400/50";
    case "warning":
      return "bg-amber-500/15 text-amber-200 border-amber-400/50";
    default:
      return "bg-muted text-muted-foreground";
  }
};

interface TopicDifferencesProps {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
}

export function TopicDifferences({ leftCandidate, rightCandidate }: TopicDifferencesProps) {
  if (!leftCandidate && !rightCandidate) return null;

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-background/80 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-display uppercase tracking-wide text-accent">Coincidencias por tema</h2>
        <span className="text-[10px] uppercase text-muted-foreground">Toca cada tag para ver fuentes</span>
      </div>
      <div className="space-y-2">
        {compassIssues.map((issue) => {
          const leftValue = leftCandidate ? candidateIssuePositions[leftCandidate.id]?.[issue.id] : undefined;
          const rightValue = rightCandidate ? candidateIssuePositions[rightCandidate.id]?.[issue.id] : undefined;
          const tag = getTagLabel(leftValue, rightValue);
          const leftLabel = typeof leftValue === "number" ? issue.options.find((option) => option.value === leftValue)?.label : "Sin postura";
          const rightLabel = typeof rightValue === "number" ? issue.options.find((option) => option.value === rightValue)?.label : "Sin postura";

          return (
            <div key={issue.id} className="rounded-xl border border-border/40 bg-background/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">{issue.topicLabel}</div>
                  <div className="text-[11px] text-muted-foreground">{issue.prompt}</div>
                </div>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Badge className={getBadgeClasses(tag.intent)}>{tag.label}</Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-xs">
                    <div className="space-y-1">
                      <div>
                        <strong>{leftCandidate?.nombre.split(" ")[0] ?? ""}:</strong> {leftLabel}
                      </div>
                      <div>
                        <strong>{rightCandidate?.nombre.split(" ")[0] ?? ""}:</strong> {rightLabel}
                      </div>
                      {issue.source && <p className="text-[10px] text-muted-foreground/80">Fuente: {issue.source}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
