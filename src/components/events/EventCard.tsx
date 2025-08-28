import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Eye, Tv, ShieldCheck } from 'lucide-react';

// A helper to format large numbers
const formatViews = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

// A helper to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Define the types for a single video and event based on your JSON structure
type RelatedVideo = {
  video_id: string;
  title: string;
  url: string;
  channel: string;
  view_count: number;
  credibility_score: number;
  sintetization: string;
  bullet: string;
};

type Event = {
  id: number;
  slug: string;
  headline: string;
  summary: string;
  story_start: string;
  total_view_count: number;
  avg_credibility_score: number;
  related_videos: RelatedVideo[];
};

interface EventCardProps {
  event: Event;
  isFeatured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isFeatured = false }) => {
  return (
    <Link to={`/news/${event.slug}`} className="block group">
      <Card className={`fighting-game-card flex flex-col h-full text-left transition-all duration-200 group-hover:border-accent group-hover:-translate-y-1`}>
        <CardHeader>
          <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
            <span>{formatDate(event.story_start)}</span>
            {isFeatured && <span className="font-display text-accent uppercase text-sm">Noticia Principal</span>}
          </div>
          <CardTitle className="text-lg md:text-xl font-bold text-primary-foreground leading-tight">
            {event.headline}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{event.summary}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm mt-4 border-t border-border pt-3">
          <div className="flex items-center gap-1" title="Vistas Totales">
            <Eye className="h-4 w-4 text-accent" />
            <span className="font-bold">{formatViews(event.total_view_count)}</span>
          </div>
          <div className="flex items-center gap-1" title="Credibilidad Promedio">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="font-bold">{event.avg_credibility_score.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1" title="Fuentes">
            <Tv className="h-4 w-4 text-accent" />
            <span className="font-bold">{event.related_videos.length}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;