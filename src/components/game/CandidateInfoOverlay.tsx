import { useMemo, useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameUIStore } from '@/store/useGameUIStore';
import { Link } from 'react-router-dom';

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
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const formatYear = (y?: string) => (!y || y === 'None' ? '—' : y);

const formatMoney = (n?: number) => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 2 }).format(n);
};

const getLatestIngreso = (candidateId: string) => {
  const rows = ingresos[candidateId] ?? [];
  if (!rows.length) return null;
  return rows
    .slice()
    .sort((a, b) => Number(b.año) - Number(a.año))[0] ?? null;
};

export function CandidateInfoOverlay() {
  const { candidateInfoOpen, selectedCandidateId, closeCandidateInfo } = useGameUIStore();
  const [activeTab, setActiveTab] = useState<'resumen' | 'detalle'>('resumen');

  const candidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return base[selectedCandidateId] ?? null;
  }, [selectedCandidateId]);

  // Reset tab on candidate change
  useEffect(() => {
    if (selectedCandidateId) setActiveTab('resumen');
  }, [selectedCandidateId]);

  if (!selectedCandidateId || !candidate) return null;

  const edu = educacion[selectedCandidateId];
  const jobs = experienciaLaboral[selectedCandidateId] ?? [];
  const latestJob = jobs[0] ?? null;

  const latestIngreso = getLatestIngreso(selectedCandidateId);
  const props = propiedades[selectedCandidateId];
  const sentences = sentencias[selectedCandidateId] ?? [];

  return (
    <Sheet open={candidateInfoOpen} onOpenChange={(open) => !open && closeCandidateInfo()}>
      <SheetContent className="flex flex-col gap-0 p-0 w-full sm:max-w-md">
        <SheetHeader className="px-4 pt-4 pb-2 border-b bg-gradient-to-b from-background to-background/95">
          <div className="flex items-center gap-3">
            {candidate.headshot ? (
              <img
                src={candidate.headshot}
                alt={candidate.nombre}
                className="w-14 h-14 object-cover rounded-full border-2 border-primary/20 flex-shrink-0"
                loading="lazy"
              />
            ) : null}

            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base font-bold leading-tight mb-1">
                {candidate.nombre}
              </SheetTitle>
              {candidate.ideologia ? (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium">
                  {candidate.ideologia}
                </Badge>
              ) : null}
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-2 mx-4 mt-3 h-9">
            <TabsTrigger value="resumen" className="text-xs">Resumen</TabsTrigger>
            <TabsTrigger value="detalle" className="text-xs">Detalle</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 min-h-0">
            <TabsContent value="resumen" className="px-4 py-3 mt-0 space-y-3">
              <DataCard
                icon={<GraduationCap size={16} />}
                title="Educación"
                lines={[
                  edu
                    ? `Básica: Primaria ${edu.basica?.primaria ?? '—'} · Secundaria ${edu.basica?.secundaria ?? '—'}`
                    : 'Sin datos',
                  edu?.postgrado?.length
                    ? `Postgrado: ${edu.postgrado[0].tipo} — ${edu.postgrado[0].institucion} (${formatYear(edu.postgrado[0].año)})`
                    : edu?.universitaria?.length
                      ? `Universitaria: ${edu.universitaria[0].carrera} — ${edu.universitaria[0].universidad} (${formatYear(edu.universitaria[0].año)})`
                      : '—',
                ]}
              />

              <DataCard
                icon={<Briefcase size={16} />}
                title="Experiencia laboral"
                lines={[
                  latestJob ? `${latestJob.puesto}` : 'Sin datos',
                  latestJob ? `${latestJob.empresa} · ${latestJob.periodo}` : '—',
                ]}
              />

              <DataCard
                icon={<Banknote size={16} />}
                title="Ingresos"
                lines={[
                  latestIngreso ? `Año ${latestIngreso.año}` : 'Sin datos',
                  latestIngreso ? `Total: ${formatMoney(latestIngreso.total)}` : '—',
                ]}
              />

              <DataCard
                icon={<Home size={16} />}
                title="Propiedades"
                lines={[
                  props ? `Inmuebles: ${props.inmuebles} · Vehículos: ${props.vehiculos} · Otros: ${props.otros}` : 'Sin datos',
                ]}
              />

              <DataCard
                icon={<Gavel size={16} />}
                title="Sentencias"
                lines={[
                  `Registros: ${sentences.length}`,
                  sentences[0] ? `${sentences[0].delito} (${formatYear(sentences[0].año)}) — ${sentences[0].fallo}` : 'Sin sentencias registradas',
                ]}
              />
            </TabsContent>

            <TabsContent value="detalle" className="px-4 py-3 mt-0 space-y-6">
              <section className="space-y-2">
                <SectionTitle icon={<GraduationCap size={14} />} title="Educación" />
                {edu ? (
                  <div className="text-sm text-muted-foreground space-y-3">
                    <div>
                      <div className="font-semibold text-foreground">Básica</div>
                      <div>Primaria: {edu.basica?.primaria ?? '—'} · Secundaria: {edu.basica?.secundaria ?? '—'}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-foreground">Universitaria</div>
                      {edu.universitaria?.length ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {edu.universitaria.slice(0, 8).map((u, idx) => (
                            <li key={`${u.universidad}-${idx}`}>
                              {u.carrera} — {u.universidad} ({formatYear(u.año)})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>Sin registros</div>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-foreground">Postgrado</div>
                      {edu.postgrado?.length ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {edu.postgrado.slice(0, 8).map((p, idx) => (
                            <li key={`${p.institucion}-${idx}`}>
                              {p.tipo}: {p.especialidad} — {p.institucion} ({formatYear(p.año)})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>Sin registros</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Sin datos</div>
                )}
              </section>

              <section className="space-y-2">
                <SectionTitle icon={<Briefcase size={14} />} title="Experiencia laboral" />
                {jobs.length ? (
                  <div className="space-y-2">
                    {jobs.slice(0, 10).map((j, idx) => (
                      <div key={`${j.empresa}-${idx}`} className="p-2 rounded-md border border-white/10">
                        <div className="font-semibold text-sm">{j.puesto}</div>
                        <div className="text-xs text-muted-foreground">{j.empresa}</div>
                        <div className="text-xs text-muted-foreground">{j.periodo}{j.ubicacion && j.ubicacion !== 'None' ? ` · ${j.ubicacion}` : ''}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Sin datos</div>
                )}
              </section>

              <section className="space-y-2">
                <SectionTitle icon={<Banknote size={14} />} title="Ingresos" />
                {(() => {
                  const rows = ingresos[selectedCandidateId] ?? [];
                  if (!rows.length) return <div className="text-sm text-muted-foreground">Sin datos</div>;
                  const sorted = rows.slice().sort((a, b) => Number(b.año) - Number(a.año));
                  return (
                    <div className="space-y-2">
                      {sorted.slice(0, 6).map((r) => (
                        <div key={r.año} className="p-2 rounded-md border border-white/10 text-sm">
                          <div className="font-semibold">Año {r.año}</div>
                          <div className="text-muted-foreground text-xs">Público: {formatMoney(r.publico)}</div>
                          <div className="text-muted-foreground text-xs">Privado: {formatMoney(r.privado)}</div>
                          <div className="text-xs font-semibold">Total: {formatMoney(r.total)}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </section>

              <section className="space-y-2">
                <SectionTitle icon={<Home size={14} />} title="Propiedades" />
                {props ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Inmuebles: <span className="font-semibold text-foreground">{props.inmuebles}</span></div>
                    <div>Vehículos: <span className="font-semibold text-foreground">{props.vehiculos}</span></div>
                    <div>Otros: <span className="font-semibold text-foreground">{props.otros}</span></div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Sin datos</div>
                )}
              </section>

              <section className="space-y-2">
                <SectionTitle icon={<Gavel size={14} />} title="Sentencias" />
                {sentences.length ? (
                  <div className="space-y-2">
                    {sentences.slice(0, 10).map((s, idx) => (
                      <div key={`${s.delito}-${idx}`} className="p-2 rounded-md border border-white/10">
                        <div className="font-semibold text-sm">{s.delito}</div>
                        <div className="text-xs text-muted-foreground">{formatYear(s.año)} · {s.fallo}</div>
                        <div className="text-xs text-muted-foreground">{s.organo}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Sin sentencias registradas</div>
                )}
              </section>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex gap-2 p-3 border-t bg-background/98 backdrop-blur-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={closeCandidateInfo}
            className="w-full h-9 text-xs font-medium"
          >
            Volver al juego
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
    </div>
  );
}

function DataCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-muted/10 select-text">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 text-primary">{icon}</div>
        <div className="min-w-0">
          <div className="font-semibold text-sm">{title}</div>
          <div className="mt-1 space-y-0.5">
            {lines.filter(Boolean).map((t, idx) => (
              <div key={idx} className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
