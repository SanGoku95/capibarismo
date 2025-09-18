import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsletterCTA } from "@/components/marketing/NewsletterCTA";
import { useUserPreferences } from "@/store/useUserPreferences";
import { candidates } from "@/data/candidates";
import { buildCompareUrl } from "@/lib/compass";
import { trendingMatchups } from "@/data/issues";
import { toast } from "@/hooks/use-toast";

const getCandidateName = (id: string) => candidates.find((candidate) => candidate.id === id)?.nombre ?? id;

const shareMatchup = async (leftId: string, rightId: string) => {
  const link = buildCompareUrl(leftId, rightId);
  const message = `Compara a ${getCandidateName(leftId)} vs ${getCandidateName(rightId)} en Capybarismo`;
  if (typeof navigator === "undefined") {
    return false;
  }
  try {
    if (navigator.share) {
      await navigator.share({ title: "Duelo presidencial", text: message, url: link });
      return true;
    }
  } catch (error) {
    console.error("Web Share failed", error);
  }
  try {
    await navigator.clipboard.writeText(`${message} ${link}`);
    toast({ title: "Copiado", description: "Enlace listo para compartir" });
    return true;
  } catch (error) {
    console.error("Clipboard share failed", error);
    return false;
  }
};

export function SavedPage() {
  const navigate = useNavigate();
  const {
    savedCandidateIds,
    savedMatchups,
    removeMatchup,
    highIntentCount,
    lastQuizResult,
    recordMatchupView,
  } = useUserPreferences();

  const savedCandidates = useMemo(
    () => candidates.filter((candidate) => savedCandidateIds.includes(candidate.id)),
    [savedCandidateIds],
  );

  const hasSaves = savedCandidates.length > 0 || savedMatchups.length > 0;

  return (
    <div className="min-h-screen fighting-game-bg pb-24 pt-10 text-white">
      <main className="container mx-auto max-w-5xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-display uppercase tracking-wider text-accent">Tu esquina guardada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Retoma matchups, comparte resultados y sigue a tus candidatos favoritos.
          </p>
        </header>

        {!hasSaves && (
          <Card className="fighting-game-card border-accent/40 bg-background/80">
            <CardContent className="space-y-4 p-6 text-center">
              <h2 className="text-xl font-display text-accent">Aún no tienes guardados</h2>
              <p className="text-sm text-muted-foreground">
                Comienza con uno de los duelos populares y guarda tus comparaciones en un toque.
              </p>
              <div className="space-y-2">
                {trendingMatchups.map((matchup) => (
                  <Button
                    key={`${matchup.a}-${matchup.b}`}
                    className="w-full"
                    onClick={() => navigate(`/compare?a=${matchup.a}&b=${matchup.b}`)}
                  >
                    {matchup.headline}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {savedMatchups.length > 0 && (
          <section className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-accent">Matchups guardados</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/compare")}>Nuevo duelo</Button>
            </div>
            <div className="space-y-3">
              {savedMatchups.map((matchup) => {
                const left = candidates.find((candidate) => candidate.id === matchup.a);
                const right = candidates.find((candidate) => candidate.id === matchup.b);
                if (!left || !right) return null;
                return (
                  <Card key={`${matchup.a}-${matchup.b}`} className="fighting-game-card border-border/80 bg-background/80">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-primary-foreground">
                          {left.nombre.split(" ")[0]} vs {right.nombre.split(" ")[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Guardado el {new Date(matchup.savedAt).toLocaleDateString("es-PE")}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            recordMatchupView(matchup.a, matchup.b);
                            navigate(`/compare?a=${matchup.a}&b=${matchup.b}`);
                          }}
                        >
                          Reanudar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shareMatchup(matchup.a, matchup.b)}
                        >
                          Compartir
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            removeMatchup(matchup.a, matchup.b);
                            toast({ title: "Eliminado", description: "Matchup removido de guardados" });
                          }}
                        >
                          Quitar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {savedCandidates.length > 0 && (
          <section className="mt-10 space-y-3">
            <h2 className="font-display text-lg text-accent">Candidatos seguidos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {savedCandidates.map((candidate) => (
                <Card key={candidate.id} className="fighting-game-card border-border/70 bg-background/80">
                  <CardContent className="flex items-center gap-3 p-4">
                    <img src={candidate.headshot} alt={candidate.nombre} className="h-14 w-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-primary-foreground">{candidate.nombre}</div>
                      <div className="text-xs text-muted-foreground">{candidate.ideologia}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/candidate/${candidate.id}`)}>
                      Ver perfil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {lastQuizResult && (
          <section className="mt-12">
            <Card className="fighting-game-card border-accent/30 bg-background/80">
              <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-accent">Resultado guardado</div>
                  <div className="text-sm text-primary-foreground">
                    Tu mejor match: {getCandidateName(lastQuizResult.topMatches[0]?.candidateId ?? "")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => navigate("/compass")}>Repetir quiz</Button>
                  {lastQuizResult.topMatches.length >= 2 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/compare?a=${lastQuizResult.topMatches[0].candidateId}&b=${lastQuizResult.topMatches[1].candidateId}`,
                        )
                      }
                    >
                      Comparar top
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {highIntentCount >= 2 && (
          <section className="mt-12">
            <NewsletterCTA />
          </section>
        )}
      </main>
    </div>
  );
}

export default SavedPage;
