import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { candidateSourcesRaw } from "@/data/domains/candidateSources";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useArticleSEO } from "@/lib/useSEO";

// Extracted component to avoid re-renders
function SourceCard({ id, name, sources }: { id: string; name: string; sources: string[] }) {
  const previewSources = sources.slice(0, 3);
  const hasMoreSources = sources.length > 3;

  return (
    <section
      key={id}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/70 p-5 transition-colors duration-200 hover:border-accent/60 hover:bg-background/80"
    >
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
          {sources.length} fuente{sources.length !== 1 && "s"}
        </p>
      </header>
      <ul className="space-y-3 text-sm leading-snug text-muted-foreground">
        {previewSources.length > 0 ? (
          previewSources.map((url, index) => (
            <li key={`${id}-preview-${index}`} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-border/80 group-hover:bg-accent/80" />
              <a
                className="flex-1 break-words underline underline-offset-2 decoration-border/60 hover:text-accent"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))
        ) : (
          <li className="flex items-start gap-2 text-muted-foreground/60">
            <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-border/40" />
            <span>Sin fuentes</span>
          </li>
        )}
      </ul>
      {hasMoreSources && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-3 w-full justify-between rounded-full border border-border/60 bg-black/10">
              Ver todas las fuentes
              <span className="text-xs text-muted-foreground">{sources.length}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{name} - Fuentes</DialogTitle>
            </DialogHeader>
            <ul className="space-y-3 text-sm leading-snug text-foreground">
              {sources.map((url, index) => (
                <li key={`${id}-full-${index}`} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                  <a className="flex-1 break-words underline underline-offset-2 hover:text-accent" href={url} target="_blank" rel="noreferrer">
                    {url.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

export function Sources() {
  const totalSources = candidateSourcesRaw.reduce((count, candidate) => count + candidate.sources.length, 0);

  // SEO for Sources page
  useArticleSEO(
    'Fuentes de Información | Capibarismo',
    `Accede a las ${totalSources} fuentes verificadas que sustentan nuestra información sobre candidatos presidenciales de Perú 2026. Transparencia total con citas, reportajes y apariciones públicas.`,
    '2025-01-01',
    '2025-10-16'
  );

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <div className="container mx-auto p-4 md:p-12">
        <Button asChild variant="ghost" className="mb-8 w-full sm:w-auto justify-center sm:justify-start gap-2 rounded-full border border-border/60 bg-black/20 px-5 py-2 transition-colors hover:border-accent hover:bg-accent/10">
          <Link to="/about">
            <ArrowLeft className="h-4 w-4" />
            Volver a Acerca de
          </Link>
        </Button>

        {/* Removed backdrop-blur-2xl - using solid background instead */}
        <Card className="fighting-game-card mx-auto max-w-6xl border border-border/40 shadow-2xl bg-background/95">
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
                <SourceCard key={id} id={id} name={name} sources={sources} />
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