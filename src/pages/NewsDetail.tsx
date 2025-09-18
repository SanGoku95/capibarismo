import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import eventsData from '../data/events.json';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Youtube, Eye, ShieldCheck, Filter, SortAsc } from 'lucide-react';

// Helper para formatear vistas
const formatViews = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

// Normaliza un canal a una "clave de medio" conocida
const getMediaKey = (channel: string) => {
  const name = channel.toLowerCase();
  if (name.includes('república')) return 'La República';
  if (name.includes('comercio')) return 'El Comercio';
  if (name.includes('exitosa')) return 'Exitosa';
  if (name.includes('willax')) return 'Willax';
  if (name.includes('peru21')) return 'Peru21';
  if (name.includes('pbo')) return 'PBO';
  if (name.includes('24 horas')) return '24 Horas';
  if (name.includes('marco sifuentes') || name.includes('encerrona')) return 'La Encerrona';
  if (name.includes('sallqa')) return 'Sallqa TV';
  if (name.includes('diario el reporte')) return 'Diario El Reporte';
  if (name.includes('rafael lopez aliaga')) return 'R. López Aliaga - Oficial';
  return channel; // fallback: usa el nombre del canal
};

// Paleta por medio (bg/border/text). Fallback: gris.
const getMediaStyle = (key: string) => {
  const map: Record<string, { border: string; badgeBg: string; badgeText: string }> = {
    'La República': { border: 'border-red-500', badgeBg: 'bg-red-500/20', badgeText: 'text-red-300' },
    'El Comercio': { border: 'border-amber-500', badgeBg: 'bg-amber-500/20', badgeText: 'text-amber-300' },
    'Exitosa': { border: 'border-blue-500', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-300' },
    'Willax': { border: 'border-violet-500', badgeBg: 'bg-violet-500/20', badgeText: 'text-violet-300' },
    'Peru21': { border: 'border-cyan-500', badgeBg: 'bg-cyan-500/20', badgeText: 'text-cyan-300' },
    'PBO': { border: 'border-fuchsia-500', badgeBg: 'bg-fuchsia-500/20', badgeText: 'text-fuchsia-300' },
    '24 Horas': { border: 'border-emerald-500', badgeBg: 'bg-emerald-500/20', badgeText: 'text-emerald-300' },
    'La Encerrona': { border: 'border-orange-500', badgeBg: 'bg-orange-500/20', badgeText: 'text-orange-300' },
    'Sallqa TV': { border: 'border-teal-500', badgeBg: 'bg-teal-500/20', badgeText: 'text-teal-300' },
    'Diario El Reporte': { border: 'border-sky-500', badgeBg: 'bg-sky-500/20', badgeText: 'text-sky-300' },
    'R. López Aliaga - Oficial': { border: 'border-slate-500', badgeBg: 'bg-slate-500/20', badgeText: 'text-slate-300' },
  };
  return map[key] ?? { border: 'border-zinc-500', badgeBg: 'bg-zinc-500/20', badgeText: 'text-zinc-300' };
};

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

type SortKey = 'views' | 'credibility';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = eventsData.events.find(e => e.slug === id || String(e.id) === id);
  const relatedVideos = useMemo<RelatedVideo[]>(
    () => (event?.related_videos ?? []) as RelatedVideo[],
    [event],
  );

  // Deriva claves de medios desde los videos relacionados
  const mediaKeys = useMemo(() => {
    const keys = new Set<string>();
    relatedVideos.forEach((video) => {
      const channel = video?.channel ?? 'Desconocido';
      keys.add(getMediaKey(channel));
    });
    return Array.from(keys).sort();
  }, [relatedVideos]);

  // Controles de orden y filtro
  const [sortBy, setSortBy] = useState<SortKey>('views');
  const [activeMedia, setActiveMedia] = useState<Set<string>>(new Set());

  const toggleMedia = (key: string) => {
    setActiveMedia(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearFilters = () => setActiveMedia(new Set());

  // Lista derivada de videos según orden y filtros
  const preparedVideos = useMemo(() => {
    let list = [...relatedVideos];
    if (activeMedia.size > 0) {
      list = list.filter(video => activeMedia.has(getMediaKey(video?.channel ?? 'Desconocido')));
    }
    list.sort((a, b) => {
      const av = Number(a?.view_count ?? 0);
      const bv = Number(b?.view_count ?? 0);
      const ac = Number(a?.credibility_score ?? 0);
      const bc = Number(b?.credibility_score ?? 0);
      if (sortBy === 'views') return bv - av;
      return bc - ac;
    });
    return list;
  }, [relatedVideos, activeMedia, sortBy]);

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

  return (
    <div className="min-h-screen fighting-game-bg">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link to="/news" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display text-sm">Todas las Noticias</span>
          </Link>
        </div>

        {/* Hero del evento */}
        <div className="fighting-game-section p-4 md:p-8 mb-12">
          <h1 className="font-display text-2xl md:text-4xl text-primary-foreground mb-4">{event.headline}</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <p className="text-muted-foreground md:col-span-2">{event.summary}</p>
            <Card className="fighting-game-card md:col-span-1">
              <div className="p-4">
                <h3 className="text-sm font-display uppercase tracking-wider text-accent/90 mb-2">Métricas del evento</h3>
                <div className="text-sm text-primary-foreground/90 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Total vistas (videos)</span>
                    <strong>{formatViews(event.total_view_count)}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Credibilidad promedio</span>
                    <strong>{Number(event.avg_credibility_score).toFixed(2)}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notas/Clips</span>
                    <strong>{event.related_videos?.length ?? 0}</strong>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Análisis comparado */}
        {event.contrast_analysis && (
          <section className="mb-12">
            <h2 className="section-title mb-4">Análisis comparado</h2>
            <Card className="fighting-game-card overflow-hidden">
              <div className="p-4 md:p-6">
                <p className="text-sm md:text-base text-primary-foreground/90 leading-relaxed">{event.contrast_analysis}</p>
                {/* Leyenda dinámica de medios presentes */}
                {mediaKeys.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mediaKeys.map(key => {
                      const style = getMediaStyle(key);
                      return (
                        <span
                          key={key}
                          className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${style.badgeBg} ${style.badgeText} ${style.border}`}
                          title={key}
                        >
                          {key}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        {/* Controles de cobertura */}
        <section className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent/80" />
              <span className="text-sm text-muted-foreground">Filtrar por medio</span>
            </div>

            {/* Fila desplazable en móvil para chips */}
            <div className="w-full md:w-auto overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
              <div className="inline-flex flex-nowrap md:flex-wrap gap-2">
                {mediaKeys.map(key => {
                  const style = getMediaStyle(key);
                  const active = activeMedia.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleMedia(key)}
                      className={`inline-flex items-center rounded border px-2 py-1 text-[11px] font-semibold transition-colors
                        ${style.border} ${active ? `${style.badgeBg} ${style.badgeText}` : 'bg-transparent text-muted-foreground hover:bg-white/5'}`}
                      title={key}
                    >
                      {key}
                    </button>
                  );
                })}
                {activeMedia.size > 0 && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center rounded border border-zinc-600 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-white/5"
                    title="Limpiar filtros"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-accent/80" />
              <div className="inline-flex rounded border border-zinc-600 overflow-hidden">
                <button
                  onClick={() => setSortBy('views')}
                  className={`px-3 py-1 text-xs font-semibold ${sortBy === 'views' ? 'bg-accent/20 text-accent-foreground' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  Por vistas
                </button>
                <button
                  onClick={() => setSortBy('credibility')}
                  className={`px-3 py-1 text-xs font-semibold ${sortBy === 'credibility' ? 'bg-accent/20 text-accent-foreground' : 'text-muted-foreground hover:bg-white/5'}`}
                >
                  Por credibilidad
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cobertura en medios */}
        <h2 className="section-title mb-4">Cobertura en medios</h2>
        {preparedVideos.length === 0 ? (
          <Card className="fighting-game-card">
            <div className="p-4 text-sm text-muted-foreground">No hay clips para los filtros seleccionados.</div>
          </Card>
        ) : (
          <div className="space-y-4">
            {preparedVideos.map((video) => {
              const mediaKey = getMediaKey(video?.channel ?? 'Desconocido');
              const style = getMediaStyle(mediaKey);
              const views = Number(video?.view_count ?? 0);
              const cred = Number(video?.credibility_score ?? 0);
              return (
                <a
                  key={video.video_id ?? `${mediaKey}-${video?.title ?? 'clip'}`}
                  href={video.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className={`fighting-game-card transition-all duration-200 group-hover:bg-white/5 group-hover:border-accent/50 overflow-hidden border-l-4 ${style.border}`}>
                    {/* En móvil apila (thumb arriba, texto abajo); en sm+ usa fila */}
                    <div className="flex flex-col sm:flex-row">
                      {/* Thumbnail */}
                      <div className="w-full sm:w-32 flex-shrink-0">
                        <img
                          src={video.video_id ? `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg` : ''}
                          alt={video.title ?? 'Video'}
                          className="w-full h-36 sm:h-full object-cover bg-zinc-800"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow p-3 md:p-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badgeBg} ${style.badgeText} border ${style.border}`}>
                            {mediaKey}
                          </span>
                          <p className="text-[11px] md:text-xs font-display uppercase tracking-wider text-accent/90 truncate">
                            {video.channel ?? 'Fuente'}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-primary-foreground leading-tight mt-2 line-clamp-2">
                          {video.title ?? 'Título no disponible'}
                        </p>
                        {video.bullet && (
                          <p className="text-sm text-muted-foreground mt-2 hidden md:block">"{video.bullet}"</p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="p-3 md:p-4 flex flex-row sm:flex-col md:flex-row items-end sm:items-center gap-3 text-sm flex-shrink-0">
                        <div className="flex items-center gap-1.5" title="Vistas">
                          <Eye className="h-4 w-4 text-accent/80" />
                          <span className="font-bold w-14 text-right">{formatViews(views)}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Credibilidad">
                          <ShieldCheck className="h-4 w-4 text-accent/80" />
                          <span className="font-bold w-10 text-right">{cred.toFixed(1)}</span>
                        </div>
                        <Youtube className="h-5 w-5 text-destructive/80 hidden md:block" />
                      </div>
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventDetail;