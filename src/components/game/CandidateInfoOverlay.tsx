import { useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';

import { base } from '@/data/domains/base';
import { educacion } from '@/data/domains/educacion';
import { experienciaLaboral } from '@/data/domains/experienciaLaboral';
import { ingresos } from '@/data/domains/ingresos';
import { propiedades } from '@/data/domains/propiedades';
import { sentencias } from '@/data/domains/sentencias';

import {
  GraduationCap,
  Briefcase,
  Banknote,
  Home,
  Gavel,
} from 'lucide-react';

const formatYear = (y?: string) => (!y || y === 'None' ? '—' : y);

const formatMoney = (n?: number) => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(n);
};

export function CandidateInfoOverlay() {
  const { candidateInfoOpen, compareCandidateIds, closeCandidateInfo } = useGameUIStore();

  const candidates = useMemo(() => {
    return compareCandidateIds
      .map(id => base[id])
      .filter(Boolean);
  }, [compareCandidateIds]);

  if (!candidateInfoOpen || candidates.length === 0) return null;

  return (
    <Sheet open={candidateInfoOpen} onOpenChange={(open) => !open && closeCandidateInfo()}>
      <SheetContent 
        className="flex flex-col gap-0 p-0 w-full h-[90vh] sm:max-w-[98vw]"
        side="bottom"
      >
        <SheetHeader className="px-3 pt-3 pb-2 border-b bg-gradient-to-b from-background to-background/95 flex-shrink-0">
          <SheetTitle className="text-xs sm:text-sm font-bold text-center">
            Comparación de Candidatos
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 h-full">
            {candidates.map((candidate) => (
              <CompactCandidateColumn key={candidate.id} candidateId={candidate.id} />
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-2 sm:p-3 border-t bg-background/98 backdrop-blur-sm flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={closeCandidateInfo}
            className="w-full h-8 sm:h-9 text-[10px] sm:text-xs font-medium"
          >
            Volver al juego
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CompactCandidateColumn({ candidateId }: { candidateId: string }) {
  const candidate = base[candidateId];
  if (!candidate) return null;

  const edu = educacion[candidateId];
  const jobs = experienciaLaboral[candidateId] ?? [];
  const ingresoRows = ingresos[candidateId] ?? [];
  const props = propiedades[candidateId];
  const sentences = sentencias[candidateId] ?? [];

  const latestIngreso = ingresoRows.length > 0 
    ? ingresoRows.sort((a, b) => Number(b.año) - Number(a.año))[0]
    : null;
  const latestJob = jobs[0];

  return (
    <div className="border rounded-lg p-2 sm:p-3 space-y-2 sm:space-y-3 bg-muted/5 flex flex-col">
      {/* Compact Header */}
      <div className="flex flex-col items-center gap-1 pb-2 border-b">
        {candidate.headshot && (
          <img
            src={candidate.headshot}
            alt={candidate.nombre}
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-primary/20"
            loading="lazy"
          />
        )}
        <h3 className="text-[10px] sm:text-xs font-bold leading-tight text-center">{candidate.nombre}</h3>
        {candidate.ideologia && (
          <p className="text-[8px] sm:text-[9px] text-muted-foreground text-center line-clamp-1">{candidate.ideologia}</p>
        )}
      </div>

      {/* Compact sections */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        <CompactSection
          icon={<GraduationCap size={12} className="sm:w-3.5 sm:h-3.5" />}
          title="Educación"
        >
          {edu ? (
            <div className="space-y-1">
              <p className="text-[8px] sm:text-[9px]">
                <span className="font-semibold">Básica:</span> P: {edu.basica?.primaria ?? '—'} / S: {edu.basica?.secundaria ?? '—'}
              </p>
              {edu.universitaria?.[0] && (
                <p className="text-[8px] sm:text-[9px] line-clamp-2">
                  <span className="font-semibold">Univ:</span> {edu.universitaria[0].carrera}
                </p>
              )}
              {edu.postgrado?.[0] && (
                <p className="text-[8px] sm:text-[9px] line-clamp-2">
                  <span className="font-semibold">Post:</span> {edu.postgrado[0].tipo}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[8px] sm:text-[9px] text-muted-foreground">Sin datos</p>
          )}
        </CompactSection>

        <CompactSection
          icon={<Briefcase size={12} className="sm:w-3.5 sm:h-3.5" />}
          title="Experiencia"
        >
          {latestJob ? (
            <div className="space-y-0.5">
              <p className="text-[8px] sm:text-[9px] font-semibold line-clamp-1">{latestJob.puesto}</p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground line-clamp-1">{latestJob.empresa}</p>
              <p className="text-[7px] sm:text-[8px] text-muted-foreground">{latestJob.periodo}</p>
            </div>
          ) : (
            <p className="text-[8px] sm:text-[9px] text-muted-foreground">Sin datos</p>
          )}
        </CompactSection>

        <CompactSection
          icon={<Banknote size={12} className="sm:w-3.5 sm:h-3.5" />}
          title="Ingresos"
        >
          {latestIngreso ? (
            <div className="space-y-0.5">
              <p className="text-[8px] sm:text-[9px]">
                <span className="font-semibold">Año {latestIngreso.año}</span>
              </p>
              <p className="text-[8px] sm:text-[9px] text-muted-foreground">
                Total: {formatMoney(latestIngreso.total)}
              </p>
            </div>
          ) : (
            <p className="text-[8px] sm:text-[9px] text-muted-foreground">Sin datos</p>
          )}
        </CompactSection>

        <CompactSection
          icon={<Home size={12} className="sm:w-3.5 sm:h-3.5" />}
          title="Propiedades"
        >
          {props ? (
            <div className="space-y-0.5">
              <p className="text-[8px] sm:text-[9px]">Inmuebles: <span className="font-semibold">{props.inmuebles}</span></p>
              <p className="text-[8px] sm:text-[9px]">Vehículos: <span className="font-semibold">{props.vehiculos}</span></p>
            </div>
          ) : (
            <p className="text-[8px] sm:text-[9px] text-muted-foreground">Sin datos</p>
          )}
        </CompactSection>

        <CompactSection
          icon={<Gavel size={12} className="sm:w-3.5 sm:h-3.5" />}
          title="Sentencias"
        >
          {sentences.length > 0 ? (
            <div className="space-y-0.5">
              <p className="text-[8px] sm:text-[9px] font-semibold">
                {sentences.length} registro{sentences.length !== 1 ? 's' : ''}
              </p>
              {sentences[0] && (
                <p className="text-[8px] sm:text-[9px] text-muted-foreground line-clamp-2">
                  {sentences[0].delito} ({formatYear(sentences[0].año)})
                </p>
              )}
            </div>
          ) : (
            <p className="text-[8px] sm:text-[9px] text-muted-foreground">Sin sentencias</p>
          )}
        </CompactSection>
      </div>
    </div>
  );
}

function CompactSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      <div className="pl-1">
        {children}
      </div>
    </div>
  );
}
