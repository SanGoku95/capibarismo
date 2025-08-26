import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GavelIcon from '@mui/icons-material/Gavel';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { NewsletterCTA } from '@/components/NewsletterCTA';

const featureCards = [
	{
		title: 'Comparador',
		description:
			'Elige dos candidatos y compara sus perfiles, propuestas y trayectoria lado a lado.',
		link: '/compare',
		icon: <CompareArrowsIcon className="w-10 h-10 mb-4 text-primary" />,
		cta: 'Comparar Ahora',
	},
	{
		title: 'Compass Político',
		description:
			'Compara las posturas de todos los candidatos en políticas clave.',
		link: '/compass',
		icon: <GavelIcon className="w-10 h-10 mb-4 text-primary" />,
		cta: 'Ir al Compass',
	},
	{
		title: 'Noticias',
		description:
			'Mantente al día con las últimas noticias, entrevistas y eventos importantes de la campaña.',
		link: '/news',
		icon: <NewspaperIcon className="w-10 h-10 mb-4 text-primary" />,
		cta: 'Ver Noticias',
	},
];

export function HomePage() {
	return (
		<div className="min-h-screen fighting-game-bg text-white">
			<main className="container mx-auto px-4 py-12 md:py-20">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1
						className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider"
						style={{
							fontFamily: "'Press Start 2P', cursive",
							color: 'hsl(var(--accent))',
							textShadow:
								'3px 3px 0px hsl(var(--background)), 6px 6px 0px hsl(var(--border))',
						}}
					>
						CAPYBARISMO
					</h1>
					<p className="mt-4 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-foreground/90 font-sans">
						Tu guía interactiva para las elecciones presidenciales de Perú 2026.
						Compara candidatos, entiende sus posturas y mantente informado.
					</p>
				</div>

				{/* Feature Cards - "Level Select" */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{featureCards.map((feature) => (
						<Link to={feature.link} key={feature.title} className="block group">
							<Card className="fighting-game-card h-full flex flex-col text-center transform group-hover:-translate-y-2 transition-transform duration-200">
								<CardHeader>
									{feature.icon}
									<CardTitle className="text-2xl font-display">
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex-grow flex flex-col justify-between">
									<CardDescription className="mb-6 font-sans text-base">
										{feature.description}
									</CardDescription>
									<div className="font-bold text-accent group-hover:text-white transition-colors flex items-center justify-center">
										{feature.cta}
										<ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				{/* Newsletter CTA */}
				<div className="max-w-6xl mx-auto mt-16">
					<NewsletterCTA />
				</div>
			</main>
		</div>
	);
}