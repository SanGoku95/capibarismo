import React from 'react';
import NewsEventCard from '../components/EventCard';
import eventsData from '../data/events.json';
import { Accordion } from '@/components/ui/accordion';

const News: React.FC = () => {
  const { events } = eventsData;

  return (
    <div className="min-h-screen fighting-game-bg">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-12">
            <h1 
              className="text-2xl md:text-4xl font-bold uppercase tracking-wider"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: 'hsl(var(--accent))',
                textShadow: '2px 2px 0px hsl(var(--background)), 4px 4px 0px hsl(var(--border))'
              }}
            >
              Noticias Políticas
            </h1>
        </div>
        
        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
          {events.map(event => (
            <NewsEventCard key={event.event_slug} event={event} />
          ))}
        </Accordion>
      </main>
    </div>
  );
};

export default News;