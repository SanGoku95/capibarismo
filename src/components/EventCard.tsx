import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Coverage {
  channel: string;
  bullet: string;
}

interface Event {
  event_slug: string;
  event_headline: string;
  coverage: Coverage[];
}

interface NewsEventCardProps {
  event: Event;
}

const MediaComment: React.FC<{ item: Coverage }> = ({ item }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 mt-1 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm flex-shrink-0">
        {item.channel.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-foreground leading-tight font-sans">{item.channel}</p>
        <p className="text-base text-muted-foreground font-sans leading-relaxed">
          {item.bullet}
        </p>
      </div>
    </div>
  );
};

const NewsEventCard: React.FC<NewsEventCardProps> = ({ event }) => {
  return (
    <AccordionItem value={event.event_slug} className="border-none">
      <Card className="fighting-game-card overflow-hidden">
        <AccordionTrigger className="p-4 text-left hover:no-underline">
          <CardHeader className="p-0 flex-1">
            <CardTitle className="text-lg md:text-xl font-sans text-left">{event.event_headline}</CardTitle>
          </CardHeader>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 px-4 pb-4 pt-0">
            <div className="border-t border-border/50 pt-4">
              <h3 className="font-bold text-base mb-3 text-accent">Cobertura de Medios</h3>
              <div className="space-y-4">
                {event.coverage.map(item => (
                  <MediaComment key={item.channel} item={item} />
                ))}
              </div>
            </div>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default NewsEventCard;