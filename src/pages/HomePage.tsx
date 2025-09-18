import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompassOnboarding } from "@/components/onboarding/CompassOnboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewsletterCTA } from "@/components/marketing/NewsletterCTA";
import { useUserPreferences } from "@/store/useUserPreferences";
import { candidates } from "@/data/candidates";
import { trendingMatchups } from "@/data/issues";

export function HomePage() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const {
    onboardingCompleted,
    lastMatchup,
    lastQuizResult,
    savedCandidateIds,
    highIntentCount,
    markOnboardingComplete,
  } = useUserPreferences();

  const savedCandidates = useMemo(
    () => candidates.filter((candidate) => savedCandidateIds.includes(candidate.id)),
    [savedCandidateIds],
  );

  const resumeMatchupLabel = useMemo(() => {
    if (!lastMatchup) return null;
    const left = candidates.find((candidate) => candidate.id === lastMatchup.a);
    const right = candidates.find((candidate) => candidate.id === lastMatchup.b);
    if (!left || !right) return null;
    return `${left.nombre.split(" ")[0]} vs ${right.nombre.split(" ")[0]}`;
  }, [lastMatchup]);

  const handleStart = () => {
    if (onboardingCompleted) {
      navigate("/compass");
      return;
    }
    setShowOnboarding(true);
  };

  const handleComplete = ({ issues, lean }: { issues: string[]; lean: number | null }) => {
    markOnboardingComplete(issues, lean);
    navigate("/compass", { replace: false });
  };

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <main className="container mx-auto max-w-5xl px-4 pb-24 pt-12 md:pt-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start">
          <div className="space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-3xl font-display uppercase tracking-wider text-accent md:text-5xl">
                Encuentra tu match 2026
              </h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Responde un quiz relámpago y compara candidatos presidenciales en segundos.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button size="lg" onClick={handleStart} className="w-full max-w-xs sm:w-auto">
                Encuentra tu match
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate("/compare")}
                className="text-muted-foreground hover:text-accent"
              >
                O compara candidatos top
              </Button>
            </div>

            {!onboardingCompleted && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Primero uso recomendado · 10 s · resultados instantáneos
              </p>
            )}
          </div>

          <section className="space-y-4 md:space-y-6">
            {(resumeMatchupLabel || lastQuizResult) && (
              <Card className="fighting-game-card border-accent/40 bg-background/80">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-accent">Retoma tu sesión</h2>
                    <Button variant="outline" size="sm" onClick={() => navigate("/saved")}>Ver todo</Button>
                  </div>
                  {lastQuizResult && (
                    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-3 text-left">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Resultado reciente</div>
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-primary-foreground">
                          {lastQuizResult.topMatches[0]
                            ? `Tu mejor match: ${
                                candidates.find((c) => c.id === lastQuizResult.topMatches[0]?.candidateId)?.nombre ?? ""
                              }`
                            : "Completa tu brújula"}
                        </div>
                        {lastQuizResult.topMatches.length > 1 && (
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {lastQuizResult.topMatches.slice(0, 3).map((match) => {
                              const candidate = candidates.find((c) => c.id === match.candidateId);
                              if (!candidate) return null;
                              return (
                                <span
                                  key={match.candidateId}
                                  className="rounded-full border border-border/50 bg-background/60 px-2 py-1 font-semibold text-foreground"
                                >
                                  {candidate.nombre.split(" ")[0]} · {match.score}%
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => navigate("/compass")} variant="secondary">
                          Volver a la brújula
                        </Button>
                        {lastQuizResult.topMatches.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(
                                `/compare?a=${lastQuizResult.topMatches[0].candidateId}&b=${lastQuizResult.topMatches[1].candidateId}`,
                              )
                            }
                          >
                            Comparar top 2
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                {resumeMatchupLabel && (
                  <div className="flex flex-col items-start gap-2 rounded-lg border border-border/60 bg-background/40 p-3 text-left">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Comparación reciente</div>
                    <div className="text-sm font-semibold text-primary-foreground">{resumeMatchupLabel}</div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/compare?a=${lastMatchup?.a}&b=${lastMatchup?.b}`)}
                      variant="secondary"
                      className="self-start"
                    >
                      Reanudar comparador
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          </section>
        </div>

        <section className="mt-12 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="fighting-game-card">
              <CardContent className="space-y-3 p-4">
                <h3 className="font-display text-base text-accent">Tendencias del ring</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {trendingMatchups.map((matchup) => {
                    const left = candidates.find((candidate) => candidate.id === matchup.a);
                    const right = candidates.find((candidate) => candidate.id === matchup.b);
                    if (!left || !right) return null;
                    return (
                      <li key={`${matchup.a}-${matchup.b}`} className="flex items-center justify-between gap-2">
                        <span>{matchup.headline}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/compare?a=${matchup.a}&b=${matchup.b}`)}
                        >
                          Ver duelo
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card className="fighting-game-card">
              <CardContent className="space-y-3 p-4">
                <h3 className="font-display text-base text-accent">Tus favoritos</h3>
                {savedCandidates.length > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {savedCandidates.slice(0, 4).map((candidate) => (
                      <li key={candidate.id} className="flex items-center justify-between gap-2">
                        <span>{candidate.nombre}</span>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/candidate/${candidate.id}`)}>
                          Ver perfil
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aún no sigues a ningún candidato. Usa el comparador y guarda tus favoritos.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {highIntentCount >= 2 && (
            <section className="pt-4">
              <NewsletterCTA />
            </section>
          )}
        </section>
      </main>

      <CompassOnboarding
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleComplete}
      />
    </div>
  );
}

export default HomePage;
