import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GavelIcon from '@mui/icons-material/Gavel';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ChatIcon from '@mui/icons-material/Chat';
import { NewsletterCTA } from '@/components/marketing/NewsletterCTA';

const featureCards = [
    {
        title: 'Comparador',
        description:
            'Elige dos candidatos y compara sus perfiles, propuestas y trayectoria lado a lado.',
        link: '/compare',
        icon: <CompareArrowsIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
        cta: 'Comparar Ahora',
    },
    {
        title: 'Mapa Ideológico',
        description:
             'Crea tu propio mapa. Cambia los ejes y descubre las posturas similares.',
        link: '/compass',
        icon: <GavelIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
        cta: 'Ir al Mapa',
    },
    {
        title: 'Chat IA',
        description:
            'Pregúntale a nuestra IA sobre candidatos, propuestas y el proceso electoral.',
        link: '/chat',
        icon: <ChatIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
        cta: 'Iniciar Chat',
    },
    {
        title: 'Noticias',
        description:
            'Mantente al día con las últimas noticias, entrevistas y eventos importantes de la campaña.',
        link: '/news',
        icon: <NewspaperIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-primary" />,
        cta: 'Ver Noticias',
    },
];

export function HomePage() {
    return (
        <div className="min-h-screen fighting-game-bg text-white">
            <main className="container mx-auto px-4 py-8 sm:py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider"
                        style={{
                            fontFamily: "'Press Start 2P', cursive",
                            color: 'hsl(var(--accent))',
                            textShadow:
                                '2px 2px 0px hsl(var(--background)), 4px 4px 0px hsl(var(--border))',
                        }}
                    >
                        CAPIBARISMO
                    </h1>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-foreground/90 font-sans px-2">
                        Tu guía interactiva para las elecciones presidenciales de Perú 2026.
                        Compara candidatos, entiende sus posturas y mantente informado.
                    </p>
                </div>

                {/* Feature Cards - "Level Select" */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                    {featureCards.map((feature) => (
                        <Link to={feature.link} key={feature.title} className="block group">
                            <Card className="fighting-game-card h-full flex flex-col text-center transform group-hover:-translate-y-2 transition-transform duration-200 min-h-[200px] sm:min-h-[250px]">
                                <CardHeader className="pb-3 sm:pb-4">
                                    {feature.icon}
                                    <CardTitle className="text-sm sm:text-lg lg:text-xl font-display leading-tight">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-between pt-0">
                                    <CardDescription className="mb-4 sm:mb-6 font-sans text-xs sm:text-sm lg:text-base leading-relaxed px-1">
                                        {feature.description}
                                    </CardDescription>
                                    <div className="font-bold text-accent group-hover:text-white transition-colors flex items-center justify-center text-xs sm:text-sm">
                                        <span className="hidden sm:inline">{feature.cta}</span>
                                        <span className="sm:hidden">Ir</span>
                                        <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <div className="max-w-6xl mx-auto mt-12 sm:mt-16">
                    <NewsletterCTA />
                </div>
            </main>
        </div>
    );
}