import React from 'react';
import { useParams, Link } from 'react-router-dom';
import eventsData from '../data/events.json';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Youtube, Eye, ShieldCheck } from 'lucide-react';

// Helper para formatear vistas
const formatViews = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = eventsData.events.find(e => e.slug === slug);

  if (!event) {
    return (
      <div className="min-h-screen fighting-game-bg flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-display text-2xl text-destructive mb-4">Evento No Encontrado</h2>
        <p className="text-muted-foreground mb-8">El evento solicitado no pudo ser localizado.</p>
        <Link to="/news" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Noticias
        </Link>
      </div>
    );
  }

  // Sort videos by view count
  const sortedVideos = [...event.related_videos].sort((a, b) => b.view_count - a.view_count);

  return (
    <div className="min-h-screen fighting-game-bg">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link to="/news" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display text-sm">Todas las Noticias</span>
          </Link>
        </div>

        <div className="fighting-game-section p-4 md:p-8 mb-12">
          <h1 className="font-display text-2xl md:text-4xl text-primary-foreground mb-4">{event.headline}</h1>
          <p className="text-muted-foreground">{event.summary}</p>
        </div>

        <h2 className="section-title mb-6">Comparativa de Perspectivas</h2>
        <div className="space-y-4">
          {sortedVideos.map((video) => (
            <a key={video.video_id} href={video.url} target="_blank" rel="noopener noreferrer" className="block group">
              <Card className="fighting-game-card transition-all duration-200 group-hover:bg-white/5 group-hover:border-accent/50 overflow-hidden">
                <div className="flex items-center">
                  {/* Thumbnail */}
                  <div className="w-24 md:w-32 flex-shrink-0">
                    <img src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover"/>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow p-3 md:p-4">
                    <p className="text-sm font-bold text-primary-foreground leading-tight truncate">{video.title}</p>
                    <p className="text-xs font-display uppercase tracking-wider text-accent/90">{video.channel}</p>
                    <p className="text-sm text-muted-foreground mt-2 hidden md:block">"{video.bullet}"</p>
                  </div>

                  {/* Stats */}
                  <div className="p-3 md:p-4 flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 text-sm flex-shrink-0">
                    <div className="flex items-center gap-1.5" title="Vistas">
                      <Eye className="h-4 w-4 text-accent/80" />
                      <span className="font-bold w-10">{formatViews(video.view_count)}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Credibilidad">
                      <ShieldCheck className="h-4 w-4 text-accent/80" />
                      <span className="font-bold w-8">{video.credibility_score.toFixed(1)}</span>
                    </div>
                    <Youtube className="h-5 w-5 text-destructive/80 hidden md:block" />
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EventDetail;