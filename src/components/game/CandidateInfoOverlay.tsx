import { useMemo, useState, useId, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGameUIStore } from '@/store/useGameUIStore';
import { getCandidateProfile } from '@/data';
import { trayectorias } from '@/data/domains/trayectorias';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  GraduationCap, 
  Building2, 
  Landmark, 
  Flag, 
  AlertTriangle, 
  ExternalLink,
  Sparkles,
  Shield,
  ChevronRight,
  Info
} from 'lucide-react';

export function CandidateInfoOverlay() {
  const { candidateInfoOpen, selectedCandidateId, closeCandidateInfo } = useGameUIStore();
  const [activeTab, setActiveTab] = useState('resumen');
  
  const profile = useMemo(() => {
    if (!selectedCandidateId) return null;
    return getCandidateProfile(selectedCandidateId);
  }, [selectedCandidateId]);
  
  // Reset to summary tab when candidate changes
  useEffect(() => {
    if (selectedCandidateId) {
      setActiveTab('resumen');
    }
  }, [selectedCandidateId]);
  
  if (!selectedCandidateId || !profile) return null;
  
  const trayectoria = trayectorias[selectedCandidateId];
  const controversies = profile.controversias ?? [];
  const highPriorityControversies = controversies
    .filter(c => c.severidad === 'muy-alta' || c.severidad === 'alta')
    .slice(0, 3);
  
  const hasControversies = controversies.length > 0;
  const hasCreencias = profile.creenciasClave.length > 0;
  
  return (
    <Sheet open={candidateInfoOpen} onOpenChange={(open) => !open && closeCandidateInfo()}>
      <SheetContent className="flex flex-col gap-0 p-0 w-full sm:max-w-md">
        {/* Compact Header with Visual Hierarchy */}
        <SheetHeader className="px-4 pt-4 pb-2 border-b bg-gradient-to-b from-background to-background/95">
          <div className="flex items-center gap-3">
            {profile.base.headshot && (
              <img
                src={profile.base.headshot}
                alt={profile.base.nombre}
                className="w-14 h-14 object-cover rounded-full border-2 border-primary/20 flex-shrink-0"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base font-bold leading-tight mb-1">
                {profile.base.nombre}
              </SheetTitle>
              {profile.base.ideologia && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium">
                  {profile.base.ideologia}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>
        
        {/* Chunked Information with Tabs - Reduces Cognitive Load */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-3 h-9">
            <TabsTrigger value="resumen" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="trayectoria" className="text-xs">
              Trayectoria
            </TabsTrigger>
            <TabsTrigger value="posiciones" className="text-xs">
              Posiciones
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            {/* Tab 1: Summary - Most Critical Info First (Inverted Pyramid) */}
            <TabsContent value="resumen" className="px-4 py-3 mt-0 space-y-4">
              
              {/* High-Priority Controversies First - Risk Management */}
              {highPriorityControversies.length > 0 && (
                <section className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-destructive" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-destructive">
                      Controversias
                    </h3>
                    <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">
                      {controversies.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {highPriorityControversies.map((controversia) => (
                      <ControversyCard
                        key={controversia.id}
                        controversia={controversia}
                        candidateId={selectedCandidateId}
                        onNavigate={closeCandidateInfo}
                      />
                    ))}
                    {controversies.length > highPriorityControversies.length && (
                      <Link
                        to={`/candidate/${selectedCandidateId}#controversias`}
                        onClick={closeCandidateInfo}
                        className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold text-destructive hover:text-destructive/80"
                      >
                        Ver {controversies.length - highPriorityControversies.length} más
                        <ChevronRight size={10} />
                      </Link>
                    )}
                  </div>
                </section>
              )}

              {/* Key Beliefs - Pattern Recognition */}
              {hasCreencias && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-muted-foreground" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Creencias clave
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.creenciasClave.slice(0, 6).map((creencia) => (
                      <CreenciaChip
                        key={creencia.id}
                        creencia={creencia}
                        candidateId={selectedCandidateId}
                        onNavigate={closeCandidateInfo}
                      />
                    ))}
                    {profile.creenciasClave.length > 6 && (
                      <Link
                        to={`/candidate/${selectedCandidateId}#creencias`}
                        onClick={closeCandidateInfo}
                        className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-medium bg-muted/50 text-muted-foreground hover:bg-muted"
                      >
                        +{profile.creenciasClave.length - 6}
                      </Link>
                    )}
                  </div>
                </section>
              )}

              {/* Political Agenda - Scannable */}
              {profile.proyectoPolitico && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-muted-foreground" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Agenda
                    </h3>
                  </div>
                  <Link
                    to={`/candidate/${selectedCandidateId}#proyecto-politico`}
                    onClick={closeCandidateInfo}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs mb-1 leading-tight">
                        {profile.proyectoPolitico.titulo}
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {profile.proyectoPolitico.resumen}
                      </p>
                    </div>
                    <ChevronRight size={16} className="flex-shrink-0 ml-2 text-muted-foreground group-hover:text-foreground" />
                  </Link>
                </section>
              )}

            </TabsContent>

            {/* Tab 2: Trayectoria - Visual Grid (Reduces Text Processing) */}
            <TabsContent value="trayectoria" className="px-4 py-3 mt-0">
              {trayectoria ? (
                <div className="grid grid-cols-2 gap-3">
                  <TrajectoryCard
                    icon={<GraduationCap size={18} />}
                    label="Educación"
                    value={trayectoria.educacion.formacion}
                    sublabel={trayectoria.educacion.instituciones}
                    href={`/candidate/${selectedCandidateId}#tray-educacion`}
                    onNavigate={closeCandidateInfo}
                  />
                  <TrajectoryCard
                    icon={<Building2 size={18} />}
                    label="Sector Privado"
                    value={trayectoria.sector_privado.actividad}
                    sublabel={trayectoria.sector_privado.estrategia_ambito}
                    href={`/candidate/${selectedCandidateId}#tray-privado`}
                    onNavigate={closeCandidateInfo}
                  />
                  <TrajectoryCard
                    icon={<Landmark size={18} />}
                    label="Sector Público"
                    value={trayectoria.sector_publico.cargos_roles ?? 'Sin registro'}
                    sublabel={trayectoria.sector_publico.periodo}
                    href={`/candidate/${selectedCandidateId}#tray-publico`}
                    onNavigate={closeCandidateInfo}
                  />
                  <TrajectoryCard
                    icon={<Flag size={18} />}
                    label="Política"
                    value={trayectoria.politica.rol_accion}
                    sublabel={trayectoria.politica.resultados_posicionamiento}
                    href={`/candidate/${selectedCandidateId}#tray-politica`}
                    onNavigate={closeCandidateInfo}
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Sin información de trayectoria disponible
                </div>
              )}
            </TabsContent>

            {/* Tab 3: Posiciones - Detailed View for Deep Dive */}
            <TabsContent value="posiciones" className="px-4 py-3 mt-0 space-y-4">
              
              {hasCreencias && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Todas las creencias ({profile.creenciasClave.length})
                  </h3>
                  <div className="space-y-2">
                    {profile.creenciasClave.map((creencia) => (
                      <Link
                        key={creencia.id}
                        to={`/candidate/${selectedCandidateId}#creencia-${creencia.id}`}
                        onClick={closeCandidateInfo}
                        className="block p-3 rounded-lg border border-white/10 hover:bg-muted/30 transition-colors"
                      >
                        <p className="font-semibold text-xs mb-1">{creencia.nombre}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {creencia.resumen}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {hasControversies && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Todas las controversias ({controversies.length})
                  </h3>
                  <div className="space-y-2">
                    {controversies.map((controversia) => (
                      <ControversyCard
                        key={controversia.id}
                        controversia={controversia}
                        candidateId={selectedCandidateId}
                        onNavigate={closeCandidateInfo}
                        showDescription
                      />
                    ))}
                  </div>
                </section>
              )}

            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        {/* Sticky Footer - Clear Next Actions */}
        <div className="flex gap-2 p-3 border-t bg-background/98 backdrop-blur-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={closeCandidateInfo}
            className="flex-1 h-9 text-xs font-medium"
          >
            Volver al juego
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 h-9 text-xs font-medium"
            onClick={closeCandidateInfo}
          >
            <Link to={`/candidate/${selectedCandidateId}`} className="flex items-center gap-1">
              Perfil completo
              <ExternalLink size={11} />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Micro-Components for Reusability

function TrajectoryCard({ 
  icon, 
  label, 
  value, 
  sublabel, 
  href, 
  onNavigate 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  sublabel?: string; 
  href: string; 
  onNavigate: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onNavigate}
      className="flex flex-col p-3 rounded-lg border border-white/10 hover:bg-muted/30 transition-colors min-h-[100px]"
    >
      <div className="text-primary mb-2">{icon}</div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
        {label}
      </p>
      <p className="text-xs font-semibold leading-tight line-clamp-2 mb-1">
        {value}
      </p>
      {sublabel && (
        <p className="text-[9px] text-muted-foreground line-clamp-1 mt-auto">
          {sublabel}
        </p>
      )}
    </Link>
  );
}

function CreenciaChip({ 
  creencia, 
  candidateId, 
  onNavigate 
}: { 
  creencia: { id: string; nombre: string; resumen: string }; 
  candidateId: string; 
  onNavigate: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      setShowTooltip(true);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      closeTimer.current = window.setTimeout(() => setShowTooltip(false), 150);
    }
  };

  useEffect(() => () => clearTimer(), []);
  
  return (
    <Popover open={showTooltip} onOpenChange={setShowTooltip}>
      <PopoverTrigger asChild>
        <Link
          to={`/candidate/${candidateId}#creencia-${creencia.id}`}
          onClick={onNavigate}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {creencia.nombre}
          <Info size={10} className="opacity-60" />
        </Link>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={6}
        className="max-w-[220px] rounded-lg border border-white/12 bg-popover/95 p-2.5 text-[10px] leading-relaxed backdrop-blur-xl pointer-events-auto"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <p className="font-semibold mb-1">{creencia.nombre}</p>
        <p className="text-muted-foreground">{creencia.resumen}</p>
      </PopoverContent>
    </Popover>
  );
}

function ControversyCard({ 
  controversia, 
  candidateId, 
  onNavigate,
  showDescription = false
}: { 
  controversia: any; 
  candidateId: string; 
  onNavigate: () => void;
  showDescription?: boolean;
}) {
  return (
    <Link
      to={`/candidate/${candidateId}#controversia-${controversia.id}`}
      onClick={onNavigate}
      className="block p-2.5 rounded-lg border border-destructive/15 bg-destructive/5 hover:bg-destructive/10 transition-colors"
    >
      <p className="font-medium text-xs mb-1.5 leading-snug line-clamp-2">
        {controversia.titulo}
      </p>
      {showDescription && (
        <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
          {controversia.descripcion}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        <StatusChip
          className={sevProps(controversia.severidad).className}
          label={sevProps(controversia.severidad).label}
          description={sevHelp(controversia.severidad)}
        />
        <StatusChip
          className={legProps(controversia.legal).className}
          label={legProps(controversia.legal).label}
          description={legHelp(controversia.legal)}
        />
      </div>
    </Link>
  );
}

function StatusChip({
  label,
  className,
  description,
}: {
  label: string;
  className?: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const contentId = useId();

  const clearTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      setOpen(true);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      closeTimer.current = window.setTimeout(() => setOpen(false), 150);
    }
  };

  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    clearTimer();
    setOpen((prev) => !prev);
  };

  useEffect(() => () => clearTimer(), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
            open && 'ring-2 ring-primary',
            className
          )}
          aria-describedby={contentId}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={contentId}
        side="top"
        align="center"
        sideOffset={6}
        className="max-w-[200px] rounded-lg border border-white/12 bg-popover/95 p-2.5 text-[10px] leading-relaxed backdrop-blur-xl"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {description}
      </PopoverContent>
    </Popover>
  );
}

// Helper functions
const sevProps = (sev?: string) => {
  switch (sev) {
    case 'muy-alta':
      return { label: 'Crítica', className: 'bg-red-600 text-white' };
    case 'alta':
      return { label: 'Alta', className: 'bg-orange-600 text-white' };
    case 'media':
      return { label: 'Media', className: 'bg-amber-400 text-black' };
    default:
      return { label: 'N/A', className: 'bg-muted text-muted-foreground' };
  }
};

const legProps = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':
      return { label: 'Medios', className: 'bg-sky-600 text-white' };
    case 'en_curso':
      return { label: 'En curso', className: 'bg-amber-500 text-black' };
    case 'sancion':
      return { label: 'Sanción', className: 'bg-rose-600 text-white' };
    case 'cerrado_sin_sancion':
      return { label: 'Cerrado', className: 'bg-emerald-600 text-white' };
    case 'condena':
      return { label: 'Condena', className: 'bg-red-700 text-white' };
    default:
      return { label: 'N/A', className: 'bg-muted text-muted-foreground' };
  }
};

const sevHelp = (sev?: string) => {
  switch (sev) {
    case 'muy-alta':
      return 'Impacto crítico en credibilidad pública';
    case 'alta':
      return 'Impacto significativo con consecuencias';
    case 'media':
      return 'Controversia bajo seguimiento';
    default:
      return 'Sin clasificación de severidad';
  }
};

const legHelp = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':
      return 'Reportado en medios, sin proceso oficial';
    case 'en_curso':
      return 'Investigación o juicio activo';
    case 'sancion':
      return 'Sanción institucional confirmada';
    case 'cerrado_sin_sancion':
      return 'Caso cerrado sin sanción';
    case 'condena':
      return 'Condena penal firme';
    default:
      return 'Sin información legal disponible';
  }
};
