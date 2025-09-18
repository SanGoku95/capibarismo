import { useEffect, useMemo, useState } from "react";
import { onboardingIssues } from "@/data/issues";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/useOnboardingStore";

interface ActivationFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}

const TOTAL_STEPS = 3;

const ESTIMATED_TIMES = ["15s", "8s", "2s"];

const LEAN_LABELS = [
  { threshold: -60, label: "Más progresista" },
  { threshold: -20, label: "Tendencia progresista" },
  { threshold: 20, label: "Centro" },
  { threshold: 60, label: "Tendencia conservadora" },
  { threshold: 101, label: "Más conservador" },
];

export function ActivationFlow({ open, onClose, onComplete, title, subtitle }: ActivationFlowProps) {
  const [step, setStep] = useState(0);
  const [localIssues, setLocalIssues] = useState<string[]>([]);
  const [localLean, setLocalLean] = useState<number>(0);

  const { setSelectedIssues, setLean, completeOnboarding } = useOnboardingStore((state) => ({
    setSelectedIssues: state.setSelectedIssues,
    setLean: state.setLean,
    completeOnboarding: state.completeOnboarding,
  }));

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const { selectedIssues, lean } = useOnboardingStore.getState();
    setLocalIssues(selectedIssues.length > 0 ? selectedIssues : []);
    setLocalLean(typeof lean === "number" ? lean : 0);
  }, [open]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const leanDescriptor = useMemo(() => {
    return LEAN_LABELS.find((entry) => localLean < entry.threshold)?.label ?? "Centro";
  }, [localLean]);

  const handleIssueToggle = (issueId: string) => {
    setLocalIssues((prev) => {
      if (prev.includes(issueId)) {
        return prev.filter((id) => id !== issueId);
      }
      if (prev.length >= 3) {
        const [, ...rest] = prev.concat(issueId);
        return rest;
      }
      return prev.concat(issueId);
    });
  };

  const nextStep = () => {
    setStep((current) => Math.min(TOTAL_STEPS - 1, current + 1));
  };

  const prevStep = () => {
    setStep((current) => Math.max(0, current - 1));
  };

  const handleComplete = () => {
    setSelectedIssues(localIssues);
    setLean(localLean);
    completeOnboarding();
    onComplete();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-card/90 border border-border rounded-xl shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground"
        >
          Saltar
        </button>
        <div className="space-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Paso {step + 1} de {TOTAL_STEPS} • ~{ESTIMATED_TIMES[step]}
            </div>
            <h2 className="text-xl font-display text-accent mt-1">
              {title ?? "Encuentra tu match en minutos"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {subtitle ?? "Selecciona tus prioridades para personalizar la brújula política."}
            </p>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">Elige hasta 3 temas que te importen</p>
              <div className="flex flex-wrap gap-2">
                {onboardingIssues.map((issue) => {
                  const selected = localIssues.includes(issue.id);
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => handleIssueToggle(issue.id)}
                      className={cn(
                        "px-3 py-2 rounded-full border text-xs font-semibold transition-all",
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {issue.label}
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {localIssues.length === 0
                  ? "Selecciona al menos una opción"
                  : `${localIssues.length} de 3 seleccionadas`}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">¿Hacia qué lado tiendes en general?</p>
                <p className="text-xs text-muted-foreground">
                  Mueve el dial entre propuestas más progresistas o conservadoras. Puedes dejarlo al centro.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                <span>Progresista</span>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={10}
                  value={localLean}
                  onChange={(event) => setLocalLean(Number(event.target.value))}
                  className="flex-1 accent-primary"
                  aria-label="Preferencia ideológica"
                />
                <span>Conservador</span>
              </div>
              <div className="text-sm font-semibold text-foreground">{leanDescriptor}</div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Todo listo.</p>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-3 space-y-2 text-xs">
                <div className="font-semibold uppercase tracking-wide text-primary text-[11px]">Tu enfoque</div>
                <ul className="list-disc list-inside space-y-1">
                  {localIssues.map((issueId) => {
                    const issue = onboardingIssues.find((item) => item.id === issueId);
                    if (!issue) return null;
                    return (
                      <li key={issueId}>
                        <span className="font-semibold text-foreground">{issue.label}:</span>{" "}
                        <span className="text-muted-foreground">{issue.highlight ?? issue.description}</span>
                      </li>
                    );
                  })}
                </ul>
                <div>
                  <span className="font-semibold text-foreground">Orientación:</span>{" "}
                  <span className="text-muted-foreground">{leanDescriptor}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Al continuar te llevamos directo a la brújula con candidatos que coinciden con tus prioridades.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={step === 0 ? onClose : prevStep}>
              {step === 0 ? "Cerrar" : "Volver"}
            </Button>
            {step < TOTAL_STEPS - 1 ? (
              <Button size="sm" onClick={nextStep} disabled={step === 0 && localIssues.length === 0}>
                Siguiente
              </Button>
            ) : (
              <Button size="sm" onClick={handleComplete}>
                Ir a la brújula
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

