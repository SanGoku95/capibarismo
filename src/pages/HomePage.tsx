import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Scale, Gamepad2, ChevronDown, ChevronUp, Target } from "lucide-react";
import { track } from "@vercel/analytics";
import { listCandidates, getCandidateProfile } from "@/data";
import { useItemListSEO } from '@/lib/useSEO';
import { DonationModal } from '@/components/common/DonationModal';

export function HomePage() {
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  // SEO for homepage with ItemList structured data for candidates
  const candidateItems = useMemo(() => {
    const baseList = listCandidates();
    return baseList.map((c) => {
      const profile = getCandidateProfile(c.id);
      const resumen = profile?.proyectoPolitico?.resumen;
      return {
        name: c.nombre,
        url: `https://capibarismo.com/candidate/${c.id}`,
        description: `${c.nombre} - ${c.ideologia}: ${resumen ?? ''}`.trim(),
      };
    });
  }, []);

  useItemListSEO(
    'Compara Candidatos Presidenciales Perú 2026 | Información Objetiva',
    'Compara candidatos presidenciales de Perú 2026 con información verificada y objetiva. Conoce propuestas, trayectorias y posiciones políticas basadas en hechos. Brújula política interactiva.',
    candidateItems
  );

  return (
    <div className="min-h-screen flex flex-col fighting-game-bg text-white">
      {/* Fullscreen Hero */}
      <section className="w-full relative">
        <div className="w-full">
          {/* Artwork */}
          <div className="w-full">
            <picture className="w-full">
              <source
                media="(max-width: 850px)"
                srcSet="/fondo_capibarismo_cel.webp"
                type="image/webp"
              />
              <source srcSet="/fondo_capibarismo_1920x1080.webp" type="image/webp" />
              <img
                src="/fondo_capibarismo_1920x1080.png"
                alt=""
                aria-hidden="true"
                className="block w-full h-auto"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>

          {/* Bottom stack: titles + buttons move together */}
          <div className="w-full px-3 sm:px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:-mt-40 relative z-10">
            <div className="mx-auto w-full max-w-xl">
              {/* Titles */}
              <div className="text-center mt-4">
                <div
                  className="text-[0.95rem] sm:text-[1.05rem] leading-tight tracking-wider"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: "hsl(var(--accent))",
                    textShadow:
                      "3px 3px 0px hsl(var(--background)), 5px 5px 0px rgba(0,0,0,0.35)",
                  }}
                >
                  Simulador de Elecciones:
                </div>
                <div
                  className="mt-2 text-[2.1rem] sm:text-[2.8rem] leading-none tracking-wider"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: "hsl(var(--accent))",
                    textShadow:
                      "3px 3px 0px hsl(var(--background)), 6px 6px 0px rgba(0,0,0,0.35)",
                  }}
                >
                  Perú 2026
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-4 rounded-2xl border border-border/60 bg-background/55 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-sm p-4 sm:p-5">
                <div className="flex flex-col gap-3">
                  <Link
                    to="/jugar"
                    onClick={() => track("home_jugar_click", { via: "cta" })}
                    className="group inline-flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3.5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/60 active:translate-y-0"
                  >
                    <span className="flex items-center gap-3">
                      <Gamepad2 size={18} className="shrink-0" />
                      Jugar: Simulador de 2ª vuelta
                    </span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/compare"
                    onClick={() => track("home_compare_click", { via: "cta" })}
                    className="group inline-flex items-center justify-between gap-3 rounded-xl bg-accent text-black px-3.5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:translate-y-0"
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
                    className="group inline-flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-3.5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-primary hover:text-black hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:translate-y-0"
                  >
                    <span className="flex items-center gap-3">
                      <Compass size={18} className="shrink-0" />
                      Explorar mapa político
                    </span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page */}
      <main className="relative w-full mx-auto px-3 max-w-6xl">
        {/* Goal-driven Support Section */}
        <section className="w-full max-w-xl mx-auto ">
          <div className="rounded-3xl border border-border/45 bg-background/80 backdrop-blur-sm shadow-[0_10px_26px_rgba(0,0,0,0.18)] px-5 py-6">
            <div className="text-center">
              <h2 className="text-sm sm:text-base tracking-wide font-bold uppercase text-accent font-sans">
                Apoya el proyecto
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-foreground/70 font-sans">
                Tu contribución hace crecer este proyecto
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-2">
                <Target className="w-5 h-5 text-[#74239C] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-semibold text-foreground font-sans">
                      Meta actual: Completar datos de 10 candidatos
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-accent font-sans shrink-0">
                      S/ 100
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-1 font-sans">
                    Información completa sobre posiciones políticas, trayectoria y propuestas
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#74239C]/80 to-[#74239C] rounded-full transition-all duration-500"
                    style={{ width: "35%" }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/70 font-sans">
                    S/ 35 recaudados
                  </span>
                  <span className="text-xs font-medium text-foreground/80 font-sans">
                    35%
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDonationModal(true);
                  track("home_donation_click", { goal: "100_soles", position: "main" });
                }}
                className="w-full rounded-2xl bg-[#74239C] hover:bg-[#74239C]/90 text-white font-semibold py-4 px-6 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#74239C]/70 flex items-center justify-center gap-2 font-sans"
              >
                <span>Contribuir con Yape</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setShowAllGoals(!showAllGoals);
                  track("home_donation_toggle_goals", { expanded: !showAllGoals });
                }}
                className="w-full text-sm text-foreground/70 hover:text-foreground/90 transition-colors duration-200 flex items-center justify-center gap-2 py-2 font-sans"
              >
                <span>{showAllGoals ? "Ocultar metas siguientes" : "Ver todas las metas"}</span>
                {showAllGoals ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showAllGoals && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="rounded-2xl bg-muted/40 border border-border/40 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide font-sans">
                        Próxima meta
                      </span>
                      <span className="text-base font-bold text-foreground/80 font-sans">
                        S/ 200
                      </span>
                    </div>
                    <p className="text-sm text-foreground/75 font-sans">
                      Mejorar ilustración de la web
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/40 border border-border/40 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide font-sans">
                        Meta futura
                      </span>
                      <span className="text-base font-bold text-foreground/80 font-sans">
                        S/ 300
                      </span>
                    </div>
                    <p className="text-sm text-foreground/75 font-sans">
                      Mejorar ilustración de candidatos
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/40 border border-border/40 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide font-sans">
                        Meta final
                      </span>
                      <span className="text-base font-bold text-foreground/80 font-sans">
                        S/ 500
                      </span>
                    </div>
                    <p className="text-sm text-foreground/75 font-sans">
                      Completar datos de los 15 candidatos
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center pt-3 border-t border-border/40">
                <p className="text-xs text-foreground/70 font-sans">
                  🔒 Pagos seguros • 100% transparente • Actualizado semanalmente
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 text-center text-[10px] sm:text-[11px] text-foreground/60 font-sans">
          Datos en evolución. Este sitio es orientativo.
        </div>

        <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} />
      </main>
    </div>
  );
}
