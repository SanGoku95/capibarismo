import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { candidateSourcesRaw } from "@/data/candidateSources";
import { Badge } from "@/components/ui/badge";

export function Sources() {
  const totalSources = candidateSourcesRaw.reduce((count, candidate) => count + candidate.sources.length, 0);

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <div className="container mx-auto p-4 md:p-12">
        <Button asChild variant="ghost" className="mb-8 w-full sm:w-auto justify-center sm:justify-start gap-2 rounded-full border border-border/60 bg-black/20 px-5 py-2 transition-all hover:border-accent hover:bg-accent/10">
          <Link to="/about">
            <ArrowLeft className="h-4 w-4" />
            Volver a Acerca de
          </Link>
        </Button>

        <Card className="fighting-game-card mx-auto max-w-6xl border border-border/40 shadow-2xl backdrop-blur-2xl">
          <CardHeader className="space-y-6 pb-0">
            <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div className="space-y-2">
                <Badge variant="secondary" className="rounded-full bg-accent/20 px-4 py-1 uppercase tracking-widest text-xs text-accent">
                  Transparencia
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-display text-accent">
                  Fuentes de Información
                </CardTitle>
                <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
                  Cada perfil se construye con evidencia verificada. Explora las citas, reportajes y apariciones públicas que sustentan nuestras fichas.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 px-5 py-4 text-center shadow-inner">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Total de fuentes</p>
                <p className="text-3xl font-semibold text-foreground">{totalSources}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {candidateSourcesRaw.map(({ id, name, sources }) => (
                <section
                  key={id}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:bg-background/80"
                >
                  <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-accent/10 to-transparent opacity-0 blur-3xl transition-opacity duration-200 group-hover:opacity-70" />
                  <header className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
                      {sources.length} fuente{sources.length !== 1 && "s"}
                    </p>
                  </header>
                  <ul className="space-y-3 text-sm leading-snug text-muted-foreground">
                    {sources.map((url, index) => (
                      <li key={`${id}-${index}`} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-border/80 group-hover:bg-accent/80" />
                        <a
                          className="flex-1 break-words underline underline-offset-2 transition-colors hover:text-accent"
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {url.replace(/^https?:\/\//, "")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              ¿Tienes una fuente adicional o detectaste un error? Escríbenos y lo revisaremos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}