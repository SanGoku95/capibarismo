import { motion } from 'framer-motion';
import type { CandidateBase } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { CandidateAvatar } from '../candidate/CandidateAvatar';
import { PlayerIndicator } from '../common/PlayerIndicator';
import { PLAYER_INDICATORS, type CandidateSide } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Briefcase, GraduationCap, Banknote, Home, Car, Package, Gavel, Check, X, ArrowUpRight } from 'lucide-react';

import { educacion } from '@/data/domains/educacion';
import { experienciaLaboral } from '@/data/domains/experienciaLaboral';
import { ingresos } from '@/data/domains/ingresos';
import { propiedades } from '@/data/domains/propiedades';
import { sentencias } from '@/data/domains/sentencias';

interface CandidateFactSheetProps {
  candidate: CandidateBase | null;
  side: CandidateSide;
  openSection: string | null;
  setOpenSection: (section: string | null) => void;
}

const formatYear = (y?: string) => (!y || y === 'None' ? '—' : y);

const formatMoneyCompact = (n?: number) => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
};

const getLatestIngreso = (candidateId: string) => {
  const rows = ingresos[candidateId] ?? [];
  if (!rows.length) return null;
  return rows.slice().sort((a, b) => Number(b.año) - Number(a.año))[0] ?? null;
};

function SummaryPill({
  icon,
  label,
  value,
  tone = 'neutral',
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warn';
}) {
  const toneClass =
    tone === 'good'
      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
      : tone === 'warn'
        ? 'border-rose-500/25 bg-rose-500/10 text-rose-200'
        : 'border-border/60 bg-muted/20 text-muted-foreground';

  return (
    <div className={cn('rounded-md border px-2 py-1 flex items-center justify-between gap-2 text-xs', toneClass)}>
      <span className="inline-flex items-center gap-1">
        <span className="opacity-80">{icon}</span>
        <span className="font-semibold">{label}</span>
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function MiniBar({ a, b, aClass, bClass }: { a: number; b: number; aClass: string; bClass: string }) {
  const total = a + b;
  const aPct = total > 0 ? Math.round((a / total) * 100) : 0;
  const bPct = total > 0 ? 100 - aPct : 0;
  return (
    <div className="h-2 w-full rounded-full overflow-hidden bg-muted/40">
      <div className="h-full flex">
        <div className={cn('h-full', aClass)} style={{ width: `${aPct}%` }} />
        <div className={cn('h-full', bClass)} style={{ width: `${bPct}%` }} />
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="opacity-80">{icon}</span>
        <span className="uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold leading-tight">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{sub}</div> : null}
    </div>
  );
}

export function CandidateFactSheet({ candidate, side, openSection, setOpenSection }: CandidateFactSheetProps) {
  const config = PLAYER_INDICATORS[side];

  if (!candidate) {
    return (
      <Card className={cn('h-full border-l-4 fighting-game-card', config.borderColor)}>
        <CardContent className="flex items-center justify-center h-full p-8">
          <div className="text-center text-muted-foreground">
            <PlayerIndicator side={side} size="lg" className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Candidato {config.number}</h3>
            <p className="text-sm">Selecciona un candidato para comparar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const e = educacion[candidate.id];
  const eduScore = (e?.universitaria?.length ?? 0) + (e?.postgrado?.length ?? 0);

  const jobs = experienciaLaboral[candidate.id] ?? [];
  const latestJob = jobs[0];

  const inc = getLatestIngreso(candidate.id);
  const props = propiedades[candidate.id];
  const propTotal = props ? (props.inmuebles ?? 0) + (props.vehiculos ?? 0) + (props.otros ?? 0) : 0;

  const sents = sentencias[candidate.id] ?? [];
  const sentTone: 'good' | 'warn' = sents.length > 0 ? 'warn' : 'good';

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('h-full border-l-4 fighting-game-card', config.borderColor)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <PlayerIndicator side={side} size="sm" variant="badge" className="shadow-md border-2 border-white/30" />
                <CardTitle className="text-lg md:text-xl font-bold">
                  <Link to={`/candidate/${candidate.id}`} className="hover:underline">
                    {candidate.nombre}
                  </Link>
                </CardTitle>
              </div>

              <Badge className={`text-xs md:text-sm ${config.badgeColor}`}>
                {candidate.ideologia ?? '—'}
              </Badge>
            </div>

            {candidate.headshot ? (
              <CandidateAvatar src={candidate.headshot} alt={`Retrato de ${candidate.nombre}`} />
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-4">
          {/* Summary (candidate-specific, scan-first) */}
          <div className="grid grid-cols-5 gap-2">
            <SummaryPill icon={<GraduationCap size={14} />} label="Edu" value={eduScore} />
            <SummaryPill icon={<Briefcase size={14} />} label="Exp" value={jobs.length} />
            <SummaryPill icon={<Banknote size={14} />} label="Ing" value={inc ? formatMoneyCompact(inc.total) : '—'} />
            <SummaryPill icon={<Home size={14} />} label="Prop" value={props ? propTotal : '—'} />
            <SummaryPill icon={<Gavel size={14} />} label="Sent" value={sents.length} tone={sentTone} />
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openSection ?? undefined}
            onValueChange={(value) => setOpenSection(value ?? null)}
          >
            <AccordionItem value="educacion">
              <AccordionTrigger className="text-base font-semibold">
                <GraduationCap size={16} className="mr-2" /> Educación
              </AccordionTrigger>
              <AccordionContent>
                {(() => {
                  const e2 = e;
                  if (!e2) return <div className="pt-2 text-sm text-muted-foreground">Sin datos</div>;

                  const primariaOk = (e2.basica?.primaria ?? '').toLowerCase() === 'sí';
                  const secundariaOk = (e2.basica?.secundaria ?? '').toLowerCase() === 'sí';
                  const topPost = e2.postgrado?.[0];
                  const topUni = e2.universitaria?.[0];

                  return (
                    <div className="pt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <StatTile
                          icon={<GraduationCap size={14} />}
                          label="Básica"
                          value={
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center gap-1">
                                {primariaOk ? <Check size={14} /> : <X size={14} />} <span className="text-muted-foreground">Pri</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                {secundariaOk ? <Check size={14} /> : <X size={14} />} <span className="text-muted-foreground">Sec</span>
                              </span>
                            </div>
                          }
                        />
                        <StatTile
                          icon={<GraduationCap size={14} />}
                          label="Top"
                          value={topPost ? topPost.tipo : topUni ? 'Uni' : '—'}
                          sub={
                            topPost
                              ? `${topPost.institucion} (${formatYear(topPost.año)})`
                              : topUni
                                ? `${topUni.universidad} (${formatYear(topUni.año)})`
                                : '—'
                          }
                        />
                      </div>

                      <Link to={`/candidate/${candidate.id}#educacion`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary">
                        Perfil <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experiencia-laboral">
              <AccordionTrigger className="text-base font-semibold">
                <Briefcase size={16} className="mr-2" /> Experiencia laboral
              </AccordionTrigger>
              <AccordionContent>
                {(() => {
                  if (!jobs.length) return <div className="pt-2 text-sm text-muted-foreground">Sin datos</div>;

                  return (
                    <div className="pt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <StatTile icon={<Briefcase size={14} />} label="Cargos" value={`${jobs.length}`} sub={latestJob ? latestJob.puesto : '—'} />
                        <StatTile icon={<Briefcase size={14} />} label="Último" value={latestJob ? latestJob.periodo : '—'} sub={latestJob ? latestJob.empresa : '—'} />
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {jobs.slice(0, 2).map((j, idx) => (
                          <div key={`${j.empresa}-${idx}`} className="rounded-md border border-border/50 bg-muted/10 p-2">
                            <div className="text-sm font-semibold leading-tight line-clamp-1">{j.puesto}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{j.empresa} · {j.periodo}</div>
                          </div>
                        ))}
                      </div>

                      <Link to={`/candidate/${candidate.id}#experiencia-laboral`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary">
                        Perfil <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingresos">
              <AccordionTrigger className="text-base font-semibold">
                <Banknote size={16} className="mr-2" /> Ingresos
              </AccordionTrigger>
              <AccordionContent>
                {(() => {
                  const row = getLatestIngreso(candidate.id);
                  if (!row) return <div className="pt-2 text-sm text-muted-foreground">Sin datos</div>;

                  return (
                    <div className="pt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <StatTile icon={<Banknote size={14} />} label="Total" value={formatMoneyCompact(row.total)} sub={`Año ${row.año}`} />
                        <StatTile
                          icon={<Banknote size={14} />}
                          label="Mix"
                          value={`${Math.round(((row.publico ?? 0) / (row.total || 1)) * 100)}% Pub`}
                          sub={`${Math.round(((row.privado ?? 0) / (row.total || 1)) * 100)}% Priv`}
                        />
                      </div>

                      <MiniBar a={row.publico ?? 0} b={row.privado ?? 0} aClass="bg-sky-500/80" bClass="bg-fuchsia-500/80" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Púb: {formatMoneyCompact(row.publico)}</span>
                        <span>Priv: {formatMoneyCompact(row.privado)}</span>
                      </div>

                      <Link to={`/candidate/${candidate.id}#ingresos`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary">
                        Perfil <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="propiedades">
              <AccordionTrigger className="text-base font-semibold">
                <Home size={16} className="mr-2" /> Propiedades
              </AccordionTrigger>
              <AccordionContent>
                {(() => {
                  const p = propiedades[candidate.id];
                  if (!p) return <div className="pt-2 text-sm text-muted-foreground">Sin datos</div>;

                  return (
                    <div className="pt-2 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <StatTile icon={<Home size={14} />} label="Inm" value={p.inmuebles} />
                        <StatTile icon={<Car size={14} />} label="Veh" value={p.vehiculos} />
                        <StatTile icon={<Package size={14} />} label="Otros" value={p.otros} />
                      </div>

                      <Link to={`/candidate/${candidate.id}#propiedades`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary">
                        Perfil <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sentencias">
              <AccordionTrigger className="text-base font-semibold">
                <Gavel size={16} className="mr-2" /> Sentencias
              </AccordionTrigger>
              <AccordionContent>
                {(() => {
                  const rows = sentencias[candidate.id] ?? [];
                  const top = rows[0];
                  return (
                    <div className="pt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <StatTile icon={<Gavel size={14} />} label="Registros" value={`${rows.length}`} sub={rows.length ? 'Ver detalle en perfil' : 'Sin registro'} />
                        <StatTile
                          icon={<Gavel size={14} />}
                          label="Última"
                          value={top ? formatYear(top.año) : '—'}
                          sub={top ? `${top.delito} · ${top.fallo}` : '—'}
                        />
                      </div>

                      {rows.slice(0, 2).map((s, idx) => (
                        <div key={`${s.delito}-${idx}`} className="rounded-md border border-border/50 bg-muted/10 p-2">
                          <div className="text-sm font-semibold leading-tight line-clamp-1">{s.delito}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{formatYear(s.año)} · {s.fallo}</div>
                        </div>
                      ))}

                      <Link to={`/candidate/${candidate.id}#sentencias`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 hover:text-primary">
                        Perfil <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
