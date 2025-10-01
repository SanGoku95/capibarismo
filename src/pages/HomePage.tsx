import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Compass } from 'lucide-react';
import { NewsletterCTA } from '@/components/marketing/NewsletterCTA';
import { candidates } from '@/data/candidates';
import { useMemo } from 'react';

export function HomePage() {
  // Fixed quick comparisons (only 3)
  const quickPairs = useMemo(() => {
    const lookup = Object.fromEntries(candidates.map(c => [c.id, c]));
    const raw = [
      { a: 'keiko', b: 'rafael' },
      { a: 'antauro', b: 'martin-vizcarra' },
      { a: 'martin-vizcarra', b: 'carlos-alvarez' },
    ];
    return raw
      .filter(p => lookup[p.a] && lookup[p.b])
      .map(p => ({
        ...p,
        label: `${lookup[p.a].nombre} vs ${lookup[p.b].nombre}`,
      }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col fighting-game-bg text-white">
      <main className="relative w-full mx-auto px-4 pt-8 sm:pt-10 pb-24 sm:pb-20 max-w-6xl">
        {/* Hero / Logo */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-xl border border-accent/50 bg-accent/10 px-5 py-3 shadow-[0_0_0_3px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <svg aria-label="Logo" width="46" height="46" viewBox="0 0 64 64" className="drop-shadow-md">
              <rect x="4" y="4" width="56" height="56" rx="8" className="fill-accent/80 stroke-white/20" strokeWidth="2" />
              <path
                d="M18 44V20h6l6 10 6-10h6v24h-6V32l-6 10-6-10v12h-6Z"
                className="fill-background stroke-white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            className="text-[1.9rem] leading-tight sm:text-4xl md:text-5xl font-bold uppercase tracking-wider"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: 'hsl(var(--accent))',
              textShadow: '2px 2px 0px hsl(var(--background)), 4px 4px 0px hsl(var(--border))',
            }}
          >
            CAPYBARISMO
          </h1>
          <p className="mt-3 text-[0.8rem] sm:text-sm md:text-lg max-w-3xl mx-auto text-foreground/90 font-sans px-2">
            Compara candidatos y entiende sus posturas clave para las elecciones 2026.
          </p>
        </div>

        {/* Primary Actions (Two Options) */}
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-10 sm:mb-12">
          <Link
            to="/compare"
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded-lg"
          >
            <Card className="fighting-game-card h-full flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                <span className="w-9 h-9 mb-3 flex items-center justify-center text-2xl drop-shadow-md">⚖️</span>
                <CardTitle className="text-base sm:text-xl font-display">
                  Comparar Candidatos
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-2 font-sans leading-relaxed">
                  Elige dos y revisa diferencias en trayectoria, ideas y controversias.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mt-1 text-accent font-bold flex items-center group-hover:text-white transition-colors text-sm">
                  Empezar
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            to="/compass"
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded-lg"
          >
            <Card className="fighting-game-card h-full flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
                <Compass className="w-9 h-9 mb-3 text-accent drop-shadow-md" />
                <CardTitle className="text-base sm:text-xl font-display">
                  Mapa Ideológico
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-2 font-sans leading-relaxed">
                  Responde preguntas y descubre coincidencias al instante.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mt-1 text-accent font-bold flex items-center group-hover:text-white transition-colors text-sm">
                  Iniciar
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Compare Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-xs sm:text-sm tracking-wide font-semibold uppercase text-accent/90 mb-3 pl-1">
            Comparaciones Rápidas
          </h2>
          <div className="flex flex-col gap-3">
            {quickPairs.map(pair => (
              <Link
                key={pair.a + pair.b}
                to={`/compare?a=${pair.a}&b=${pair.b}`}
                className="group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                <div className="p-4 rounded-lg border bg-background/40 backdrop-blur-sm hover:bg-accent/10 hover:border-accent/50 transition-colors fighting-game-card-inner">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm sm:text-base font-medium group-hover:text-accent">
                      {pair.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-accent/80 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-14">
          <NewsletterCTA />
        </div>

        {/* Foot Micro Copy */}
        <div className="mt-10 text-center text-[10px] sm:text-[11px] text-foreground/60 font-sans">
          Datos en evolución. Este sitio es orientativo.
        </div>
      </main>
    </div>
  );
}