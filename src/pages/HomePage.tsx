import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ChatIcon from '@mui/icons-material/Chat';
import { NewsletterCTA } from '@/components/marketing/NewsletterCTA';
import { ActivationFlow } from '@/components/onboarding/ActivationFlow';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useSavedStore } from '@/store/useSavedStore';
import { trendingMatchups } from '@/data/matchups';

const featureCards = [
  {
    title: 'Comparador',
    description: 'Selecciona dos candidatos y mira sus posturas frente a frente, tema por tema.',
    link: '/compare',
    icon: <CompareArrowsIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
    cta: 'Comparar ahora',
  },
  {
    title: 'Brújula',
    description: 'Visualiza qué tan cerca estás de cada candidatura según los temas que elegiste.',
    link: '/compass',
    icon: <Compass className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
    cta: 'Abrir brújula',
  },
  {
    title: 'Chat IA',
    description: 'Haz preguntas rápidas sobre planes de gobierno, controversias o eventos recientes.',
    link: '/chat',
    icon: <ChatIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
    cta: 'Preguntar',
  },
  {
    title: 'Radar de noticias',
    description: 'Filtra noticias por tus matches o candidatos guardados y ve el impacto inmediato.',
    link: '/news',
    icon: <NewspaperIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
    cta: 'Ver radar',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [isActivationOpen, setActivationOpen] = useState(false);
  const { hasCompleted, lastMatchCandidates } = useOnboardingStore((state) => ({
    hasCompleted: state.hasCompleted,
    lastMatchCandidates: state.lastMatchCandidates,
  }));
  const resume = useSavedStore((state) => state.resumeCompare);

  const primaryMatchup = lastMatchCandidates.length >= 2 ? lastMatchCandidates.slice(0, 2) : trendingMatchups[0].candidates;

  const handleActivationComplete = () => {
    setActivationOpen(false);
    navigate('/compass');
  };

  const handlePrimaryCta = () => {
    setActivationOpen(true);
  };

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <main className="container mx-auto px-4 py-10 sm:py-12 md:py-16 space-y-16">
        <section className="text-center space-y-6">
          <div className="space-y-3">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: 'hsl(var(--accent))',
                textShadow: '2px 2px 0px hsl(var(--background)), 4px 4px 0px hsl(var(--border))',
              }}
            >
              Capybarismo 2026
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto text-foreground/90 font-sans">
              Elige tus prioridades, encuentra a tus matches presidenciales y comparte comparaciones con un solo toque.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={handlePrimaryCta} className="px-6 py-6 text-base font-display">
              Encuentra tu match
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-sm font-semibold text-accent">
              <Link to={`/compare?a=${primaryMatchup[0]}&b=${primaryMatchup[1]}`}>
                o compara a los top de hoy
              </Link>
            </Button>
          </div>
          {resume && (resume.left || resume.right) && (
            <div className="mx-auto max-w-lg rounded-xl border border-primary/40 bg-primary/10 p-4 text-left">
              <div className="text-xs uppercase text-accent font-semibold mb-1">Retoma tu duelo</div>
              <div className="text-sm text-foreground mb-3">
                Continua comparando a tus últimos candidatos seleccionados.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/compare?a=${resume.left ?? ''}&b=${resume.right ?? ''}`)}
              >
                Reanudar comparación
              </Button>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-display text-accent mb-4 flex items-center gap-2 justify-center">
            <Sparkles className="h-5 w-5" /> Lo esencial
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {featureCards.map((feature) => (
              <Link to={feature.link} key={feature.title} className="block group">
                <Card className="fighting-game-card h-full flex flex-col text-center transform group-hover:-translate-y-2 transition-transform duration-200 min-h-[200px] sm:min-h-[220px]">
                  <CardHeader className="pb-3 sm:pb-4">
                    {feature.icon}
                    <CardTitle className="text-sm sm:text-lg font-display leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between pt-0">
                    <CardDescription className="mb-4 text-xs sm:text-sm font-sans leading-relaxed px-1">
                      {feature.description}
                    </CardDescription>
                    <div className="font-bold text-accent group-hover:text-white transition-colors flex items-center justify-center text-xs sm:text-sm">
                      <span>{feature.cta}</span>
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section id="newsletter" className="max-w-5xl mx-auto">
          <NewsletterCTA />
        </section>
      </main>

      <ActivationFlow
        open={isActivationOpen}
        onClose={() => setActivationOpen(false)}
        onComplete={handleActivationComplete}
        title={hasCompleted ? 'Actualiza tus prioridades' : 'Encuentra tu match en minutos'}
        subtitle={hasCompleted ? 'Puedes volver a jugar la brújula cuando quieras.' : undefined}
      />
    </div>
  );
}