import React from 'react';
import EventCard from '../components/events/EventCard';
import eventsData from '../data/events.json';
import { SEO, StructuredData } from '@/components/seo/SEO';
import { generateBreadcrumbStructuredData } from '@/lib/seo';

const News: React.FC = () => {
  // Filter events to only include those with related videos, then sort by date
  const sortedEvents = [...eventsData.events]
    .filter(event => event.related_videos && event.related_videos.length > 0)
    .sort((a, b) => 
      new Date(b.story_start).getTime() - new Date(a.story_start).getTime()
    );

  const featuredEvent = sortedEvents[0];
  const otherEvents = sortedEvents.slice(1);

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Inicio', url: '/' },
    { name: 'Noticias', url: '/news' }
  ]);

  return (
    <>
      <SEO 
        title="Radar Político - Noticias y Eventos Electorales"
        description="Últimas noticias, entrevistas y eventos de los candidatos presidenciales de Perú 2026. Mantente informado sobre la campaña electoral con nuestro radar político."
        keywords={[
          'noticias politicas peru',
          'eventos electorales',
          'campana electoral 2026',
          'entrevistas candidatos',
          'radar politico',
          'actualidad electoral'
        ]}
      />
      <StructuredData data={breadcrumbData} />
      
      <div className="min-h-screen fighting-game-bg">
        <main className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-10 md:mb-16">
              <h1 
                className="text-3xl md:text-5xl font-bold uppercase tracking-wider"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  color: 'hsl(var(--accent))',
                  textShadow: '2px 2px 0px hsl(var(--background)), 4px 4px 0px hsl(var(--border))'
                }}
              >
                Radar Político
              </h1>
              <p className="text-muted-foreground mt-4 text-sm md:text-base">
              Las últimas noticias de la arena política peruana.
            </p>
        </header>
        
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Featured Event */}
            {featuredEvent && (
              <div className="md:col-span-2 lg:col-span-3">
                <EventCard event={featuredEvent} isFeatured={true} />
              </div>
            )}

            {/* Other Events */}
            {otherEvents.map(event => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No hay noticias con cobertura de video disponibles en este momento.</p>
          </div>
        )}
      </main>
    </div>
    </>
  );
};

export default News;