import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { NewsletterCTA } from '@/components/marketing/NewsletterCTA';
import { candidates } from '@/data/candidates';
import { useMemo } from 'react';

export function HomePage() {
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
      <main className="relative w-full mx-auto px-3 sm:px-4 pt-6 sm:pt-7 pb-20 sm:pb-16 max-w-6xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-3 inline-flex items-center justify-center rounded-xl border border-accent/50 bg-accent/10 px-4 py-2.5 shadow-[0_0_0_3px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <svg aria-label="Logo" width="42" height="42" viewBox="0 0 64 64" className="drop-shadow-md">
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
            className="text-[1.85rem] leading-tight sm:text-[2.6rem] md:text-[3rem] font-bold uppercase tracking-wider"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: 'hsl(var(--accent))',
              textShadow: '2px 2px 0px hsl(var(--background)), 4px 4px 0px hsl(var(--border))',
            }}
          >
            CAPYBARISMO
          </h1>
          <p className="mt-2.5 text-[0.78rem] sm:text-sm md:text-base max-w-2xl mx-auto text-foreground/85 font-sans px-2">
            Compara candidatos y entiende sus posturas clave para las elecciones 2026.
          </p>
        </div>
        
        {/* Primary call-to-actions */}
        <section className="w-full max-w-xl mx-auto mb-6 sm:mb-7">
          <div className="rounded-2xl border border-border/60 bg-background/75 shadow-[0_8px_20px_rgba(0,0,0,0.32)] backdrop-blur-sm p-4 sm:p-5">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/75">
              Empieza aquí
            </p>
            <p className="mt-2 text-xs sm:text-sm text-foreground/85">
              Elige entre comparar perfiles o encontrar afinidad ideológica.
            </p>
            <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-2.5">
              <Link
                to="/compare"
                className="group inline-flex items-center justify-between gap-3 rounded-xl bg-accent text-black px-3.5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-transform hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <span>⚖️ Comparar candidatos</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/compass"
                className="group inline-flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-3.5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/60 hover:bg-primary hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span>
                  <Compass className="mr-2 inline h-4 w-4" />
                  Compass ideológico
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick compares */}
        <section className="w-full max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border/60 bg-background/60 backdrop-blur-sm p-4 sm:p-5 shadow-[0_8px_20px_rgba(0,0,0,0.28)]">
            <h2 className="text-xs sm:text-sm tracking-wide font-semibold uppercase text-accent/90">
              Comparaciones rápidas
            </h2>
            <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground/80">
              Acceso directo a duelos populares.
            </p>
            <div className="mt-3 grid gap-2 sm:gap-2.5 sm:grid-cols-3">
              {quickPairs.map(pair => (
                <Link
                  key={pair.a + pair.b}
                  to={`/compare?a=${pair.a}&b=${pair.b}`}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  <span className="pr-2 group-hover:text-accent">{pair.label}</span>
                  <ArrowRight className="h-4 w-4 text-accent/80 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto mt-9 sm:mt-11">
          <NewsletterCTA />
        </div>

        <div className="mt-7 text-center text-[10px] sm:text-[11px] text-foreground/60 font-sans">
          Datos en evolución. Este sitio es orientativo.
        </div>
      </main>
    </div>
  );
}