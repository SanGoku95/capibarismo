import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Scale } from "lucide-react";
import { track } from "@vercel/analytics";
import { candidates } from "@/data/candidates";

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
          <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full bg-background/80 shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
            <img src="/capi_logo.png" alt="Capibara logo" className="h-24 w-24" />
          </div>
          <h1
            className="text-[1.3rem] leading-tight sm:text-[1.75rem] md:text-[2rem] font-bold uppercase tracking-wider"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: 'hsl(var(--accent))',
              textShadow: '3px 3px 0px hsl(var(--background)), 5px 5px 0px hsl(var(--border))',
            }}
          >
            CAPIBARISMO
          </h1>
          <p className="mt-3 text-[0.85rem] sm:text-base md:text-lg max-w-2xl mx-auto text-foreground/90 font-sans px-2 leading-relaxed">
            Tu Dibujito Observador: Elecciones 2026
          </p>
        </div>
        
        {/* Primary call-to-actions */}
        <section className="w-full max-w-xl mx-auto mb-6 sm:mb-7">
          <div className="rounded-2xl border border-border/60 bg-background/75 shadow-[0_8px_20px_rgba(0,0,0,0.32)] backdrop-blur-sm p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <Link
                to="/compare"
                onClick={() => track("home_compare_click", { via: "cta" })}
                className="group inline-flex items-center justify-between gap-3 rounded-xl bg-accent text-black px-3.5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:translate-y-0"
              >
                <span className="flex items-center gap-3">
                  <Scale size={18} className="shrink-0" />
                  Comparar candidatos
                </span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/compass"
                onClick={() => track("home_mapa_politico_click", { via: "cta" })}
                className="group inline-flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-3.5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-primary hover:text-black hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:translate-y-0"
              >
                <span className="flex items-center gap-3">
                  <Compass size={18} className="shrink-0" />
                  Explorar mapa político
                </span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
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
              Acceso directo a comparaciones populares.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickPairs.map((pair, index) => (
                <Link
                  key={pair.a + pair.b}
                  to={`/compare?a=${pair.a}&b=${pair.b}`}
                  onClick={() =>
                    track("home_compare_pair_click", {
                      candidateA: pair.a,
                      candidateB: pair.b,
                      position: index + 1,
                    })
                  }
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3.5 py-3 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 hover:border-accent/60 hover:bg-accent/10 hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 active:translate-y-0"
                >
                  <span>{pair.label}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
         {/* Support CTA */}
        <section className="w-full max-w-xl mx-auto mt-9">
          <div className="rounded-3xl border border-border/45 bg-background/80 backdrop-blur-sm shadow-[0_10px_26px_rgba(0,0,0,0.18)] px-5 py-6 text-center">
            <h2 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent/75">
              Apoya el proyecto
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground/80 leading-relaxed">
              Cada aporte ayuda a mantener los datos actualizados y la experiencia libre para todos.
            </p>
            <div className="mt-5 flex justify-center">
              <a
                href="https://ko-fi.com/D1D31GKBY9"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("home_kofi_click", { via: "support_section" })}
                className="inline-flex items-center justify-center rounded-2xl border border-accent/50 bg-accent/15 px-4 py-3 transition-all duration-200 hover:bg-accent/25 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                aria-label="Apoya el proyecto en Ko-fi"
              >
                <img
                  height={36}
                  style={{ border: 0, height: 36 }}
                  src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
                  alt="Apoya el proyecto en Ko-fi"
                />
              </a>
            </div>
          </div>
        </section>

        <div className="mt-7 text-center text-[10px] sm:text-[11px] text-foreground/60 font-sans">
          Datos en evolución. Este sitio es orientativo.
        </div>
      </main>
    </div>
  );
}