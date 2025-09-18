import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidates } from "@/data/candidates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewsletterCTA } from "@/components/marketing/NewsletterCTA";
import { useUserPreferences } from "@/store/useUserPreferences";
import { useCompareStore } from "@/store/useCompareStore";
import { calculateMatchScores, CompassAnswerMap, getQuestionsForUser, buildCompareUrl } from "@/lib/compass";
import { toast } from "@/hooks/use-toast";

const CONFETTI_COLORS = ["#f97316", "#facc15", "#38bdf8", "#22d3ee", "#f472b6"];

const buildShareCopy = (topNames: string[], link: string) =>
  `Mis matches presidenciales: ${topNames.join(", ")}. ¿Quién gana tu duelo? ${link}`;

const shareResult = async (topNames: string[], link: string) => {
  const text = buildShareCopy(topNames, link);
  if (typeof navigator === "undefined") {
    return false;
  }
  try {
    if (navigator.share) {
      await navigator.share({ title: "Mis matches presidenciales", text, url: link });
      return true;
    }
  } catch (error) {
    console.error("Error sharing via Web Share API", error);
  }
  try {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Tu resultado está listo para compartir" });
    return true;
  } catch (error) {
    console.error("Clipboard copy failed", error);
    return false;
  }
};

const shareOnWhatsApp = (message: string, link: string) => {
  if (typeof window === "undefined") return;
  const url = `https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const ConfettiBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-start justify-center overflow-hidden">
      <div className="mt-24 grid grid-cols-10 gap-1">
        {Array.from({ length: 120 }).map((_, index) => {
          const delay = (index % 10) * 60;
          const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
          return (
            <span
              key={index}
              className="block h-1 w-2 animate-confetti rounded"
              style={{
                backgroundColor: color,
                animationDelay: `${delay}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export function PoliticalCompassPage() {
  const navigate = useNavigate();
  const {
    selectedIssues,
    recordQuizResult,
    incrementHighIntent,
    toggleSavedCandidate,
    savedCandidateIds,
    recordMatchupView,
  } = useUserPreferences();
  const { setPair } = useCompareStore();

  const questions = useMemo(() => getQuestionsForUser(selectedIssues), [selectedIssues]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CompassAnswerMap>(() => {
    const initial: CompassAnswerMap = {};
    questions.forEach((question) => {
      initial[question.id] = null;
    });
    return initial;
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const map: CompassAnswerMap = {};
    questions.forEach((question) => {
      map[question.id] = null;
    });
    setAnswers(map);
    setCurrentIndex(0);
    setIsComplete(false);
  }, [questions]);

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isComplete]);

  const handleSelectAnswer = (value: number) => {
    const question = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish({ ...answers, [question.id]: value });
    }
  };

  const handleSkip = () => {
    const question = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: null }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish({ ...answers, [question.id]: null });
    }
  };

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFinish = (finalAnswers: CompassAnswerMap) => {
    const scores = calculateMatchScores(finalAnswers).sort((a, b) => b.score - a.score);
    if (scores.length === 0) {
      return;
    }
    setAnswers(finalAnswers);
    setIsComplete(true);
    const topThree = scores.slice(0, 3);
    const [topOne, topTwo] = topThree;
    const leftCandidate = topOne ? candidates.find((candidate) => candidate.id === topOne.candidateId) ?? null : null;
    const rightCandidate = topTwo ? candidates.find((candidate) => candidate.id === topTwo.candidateId) ?? null : null;
    if (leftCandidate && rightCandidate) {
      setPair(leftCandidate, rightCandidate);
      recordMatchupView(leftCandidate.id, rightCandidate.id);
    }
    const shareUrl = topThree[1]
      ? buildCompareUrl(topThree[0].candidateId, topThree[1].candidateId)
      : buildCompareUrl(topThree[0].candidateId, topThree[0].candidateId);
    recordQuizResult({
      completedAt: new Date().toISOString(),
      topMatches: topThree,
      answers: Object.entries(finalAnswers).map(([issueId, value]) => ({ issueId, value })),
      shareUrl,
    });
    incrementHighIntent();
    toast({ title: "¡Listo!", description: "Tu top presidencial está armado" });
  };

  const progress = ((currentIndex + (isComplete ? 1 : 0)) / questions.length) * 100;

  const topMatches = useMemo(() => {
    if (!isComplete) return [];
    const scores = calculateMatchScores(answers).sort((a, b) => b.score - a.score);
    return scores.slice(0, 3);
  }, [answers, isComplete]);

  const topMatchCandidates = topMatches
    .map((match) => ({ ...match, candidate: candidates.find((candidate) => candidate.id === match.candidateId) }))
    .filter((match) => match.candidate);

  return (
    <div className="relative min-h-screen fighting-game-bg">
      <ConfettiBurst active={showConfetti} />
      <main className="container mx-auto px-4 pb-24 pt-10 md:pt-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-background/90 p-6 shadow-2xl md:max-w-3xl md:p-8 lg:max-w-4xl lg:p-10">
          {!isComplete ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Pregunta {currentIndex + 1} de {questions.length}
                </p>
                <h1 className="text-2xl font-display text-accent md:text-3xl">{questions[currentIndex]?.title}</h1>
                <p className="text-sm text-muted-foreground">{questions[currentIndex]?.description}</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="space-y-3">
                {questions[currentIndex]?.options.map((option) => (
                  <button
                    key={option.value}
                    className="w-full rounded-2xl border border-border/60 bg-background/70 p-4 text-left transition hover:border-accent hover:bg-accent/10"
                    onClick={() => handleSelectAnswer(option.value)}
                  >
                    <div className="text-sm font-semibold text-primary-foreground">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.helper}</div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Button variant="ghost" size="sm" onClick={handleBack} disabled={currentIndex === 0}>
                  Volver
                </Button>
                <div className="flex items-center gap-3">
                  <button className="text-xs font-semibold uppercase tracking-wide" onClick={handleSkip}>
                    Saltar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-accent">Tu top matches</p>
                <h2 className="text-3xl font-display text-primary-foreground">Así quedó el podio</h2>
              </div>

              <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                {topMatchCandidates.map((match, index) => (
                  <Card key={match.candidate!.id} className="border-accent/40 bg-background/80">
                    <CardContent className="flex items-center justify-between gap-4 p-3 md:flex-col md:items-center md:gap-3 md:text-center">
                      <div className="flex items-center gap-3 md:flex-col md:text-center">
                        <span className="text-2xl font-display text-accent">#{index + 1}</span>
                        <img
                          src={match.candidate!.headshot}
                          alt={match.candidate!.nombre}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="md:space-y-1">
                          <div className="text-sm font-semibold text-primary-foreground">{match.candidate!.nombre}</div>
                          <div className="text-xs text-muted-foreground">{match.candidate!.ideologia}</div>
                        </div>
                      </div>
                      <div className="text-right md:text-center">
                        <div className="text-xl font-display text-accent">{match.score}%</div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="md:mt-2 md:w-full"
                          onClick={() => navigate(`/candidate/${match.candidate!.id}`)}
                        >
                          Ver perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {topMatchCandidates.length >= 2 && (
                <div className="grid gap-2 md:grid-cols-2">
                  <Button
                    size="lg"
                    onClick={() =>
                      navigate(`/compare?a=${topMatchCandidates[0].candidate!.id}&b=${topMatchCandidates[1].candidate!.id}`)
                    }
                  >
                    Comparar top 2 ahora
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="md:col-span-2"
                    onClick={async () => {
                      const left = topMatchCandidates[0]?.candidate?.nombre ?? "";
                      const right = topMatchCandidates[1]?.candidate?.nombre ?? "";
                      const link = buildCompareUrl(
                        topMatchCandidates[0].candidate!.id,
                        topMatchCandidates[1].candidate!.id,
                      );
                      const ok = await shareResult([left, right], link);
                      if (ok) incrementHighIntent();
                    }}
                  >
                    Compartir resultado
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const top = topMatchCandidates[0]?.candidate;
                      if (!top) return;
                      const alreadyFollowing = savedCandidateIds.includes(top.id);
                      toggleSavedCandidate(top.id);
                      toast({
                        title: alreadyFollowing ? "Guardado" : "Seguido",
                        description: alreadyFollowing
                          ? "Tu match principal permanece en favoritos"
                          : "Añadido a tu lista de seguidos",
                      });
                    }}
                  >
                    {topMatchCandidates[0] && savedCandidateIds.includes(topMatchCandidates[0].candidate!.id)
                      ? "Siguiendo"
                      : "Seguir top 1"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      shareOnWhatsApp(
                        "Mira mis matches presidenciales",
                        buildCompareUrl(
                          topMatchCandidates[0].candidate!.id,
                          topMatchCandidates[1]?.candidate?.id ?? topMatchCandidates[0].candidate!.id,
                        ),
                      )
                    }
                  >
                    Enviar por WhatsApp
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/saved")}>
                  Ver guardados
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                  Ir al inicio
                </Button>
              </div>

              <NewsletterCTA />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PoliticalCompassPage;
