import { useEffect, useMemo, useState } from "react";
import { CompassIssue, compassIssues } from "@/data/issues";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = 0 | 1;

interface CompassOnboardingProps {
  open: boolean;
  onClose: () => void;
  onComplete: (payload: { issues: string[]; lean: number | null }) => void;
}

const MAX_ISSUES = 3;

const estimatedTotalTime = compassIssues
  .slice(0, MAX_ISSUES)
  .reduce((acc, issue) => acc + (issue.estimatedTime ?? 2), 0);

export function CompassOnboarding({ open, onClose, onComplete }: CompassOnboardingProps) {
  const [step, setStep] = useState<Step>(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [lean, setLean] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setSelectedIssues([]);
      setLean(null);
    }
  }, [open]);

  const availableIssues = useMemo<CompassIssue[]>(() => compassIssues.slice(0, 6), []);

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) => {
      if (prev.includes(issueId)) {
        return prev.filter((id) => id !== issueId);
      }
      if (prev.length >= MAX_ISSUES) {
        const [, ...rest] = [...prev, issueId];
        return rest;
      }
      return [...prev, issueId];
    });
  };

  const proceedToLean = () => {
    setStep(1);
  };

  const handleFinish = () => {
    onComplete({ issues: selectedIssues, lean });
    onClose();
  };

  const handleSkip = () => {
    onComplete({ issues: [], lean: null });
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 text-xs uppercase tracking-wide text-muted-foreground">
          <span>Brújula política</span>
          <span>≈ {estimatedTotalTime}s</span>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mt-2 mb-6">
            <div className="text-sm font-semibold text-accent">Paso {step + 1} de 2</div>
            <button
              onClick={handleSkip}
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-accent"
            >
              Saltar
            </button>
          </div>

          <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${((step + 1) / 2) * 100}%` }}
            ></div>
          </div>

          {step === 0 ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-display text-accent mb-2">Elige hasta 3 temas</h2>
                <p className="text-sm text-muted-foreground">
                  Tu brújula empezará con los temas que más te importan.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableIssues.map((issue) => {
                  const isSelected = selectedIssues.includes(issue.id);
                  return (
                    <button
                      key={issue.id}
                      onClick={() => toggleIssue(issue.id)}
                      className={cn(
                        "px-3 py-2 rounded-full border text-left min-w-[45%] text-sm transition-all",
                        isSelected
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground hover:border-accent/70"
                      )}
                    >
                      <div className="font-semibold text-foreground text-sm">{issue.topicLabel}</div>
                      <div className="text-xs text-muted-foreground leading-tight">{issue.description}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {selectedIssues.length === 0
                    ? "Selecciona al menos uno"
                    : `${selectedIssues.length} / ${MAX_ISSUES} temas elegidos`}
                </span>
                <Button size="sm" disabled={selectedIssues.length === 0} onClick={proceedToLean}>
                  Continuar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display text-accent mb-2">¿Hacia qué lado te inclinas?</h2>
                <p className="text-sm text-muted-foreground">
                  Opcional: ayúdanos a calibrar tu brújula entre Estado fuerte y mercado libre.
                </p>
              </div>
              <div className="py-6">
                <div className="relative">
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    step={10}
                    value={lean ?? 0}
                    onChange={(event) => setLean(Number(event.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase">
                    <span>Estado fuerte</span>
                    <span>Centro</span>
                    <span>Mercado libre</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Volver
                </Button>
                <Button onClick={handleFinish}>Ver resultados</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
