import { motion } from 'framer-motion';
import { memo } from 'react';
import type { CandidateBase } from '@/data/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { PLAYER_INDICATORS, UI_CLASSES } from '@/lib/constants';
import { CandidateFullBodyMedia } from '@/components/candidate/CandidateFullBody';

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
  Car,
  Package,
  Gavel,
  Check,
  X,
  ArrowUpRight,
} from 'lucide-react';

interface CandidateComparisonGridProps {
  leftCandidate: CandidateBase | null;
  rightCandidate: CandidateBase | null;
}

interface ComparisonSectionProps {
  title: string;
  sectionId: string;
  leftCandidate: CandidateBase | null;
  rightCandidate: CandidateBase | null;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
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

function MiniBar({ a, b, aClass, bClass }: { a: number; b: number; aClass: string; bClass: string }) {
  const total = a + b;
  const aPct = total > 0 ? Math.round((a / total) * 100) : 0;
  const bPct = total > 0 ? 100 - aPct : 0;
  return (
    <div className="h-2 w-full rounded-full overflow-hidden bg-white/10">
      <div className="h-full flex">
        <div className={cn('h-full', aClass)} style={{ width: `${aPct}%` }} />
        <div className={cn('h-full', bClass)} style={{ width: `${bPct}%` }} />
      </div>
    </div>
  );
}

function Stat({
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
    <div className="rounded-lg bg-white/5 border border-white/10 p-2">
      <div className="flex items-center gap-2">
        <div className="opacity-90">{icon}</div>
        <div className="text-[10px] uppercase tracking-wide text-white/70">{label}</div>
      </div>
      <div className="mt-1 text-sm font-semibold leading-tight">{value}</div>
      {sub ? <div className="mt-0.5 text-[11px] text-white/70 line-clamp-2">{sub}</div> : null}
    </div>
  );
}

function SectionNav() {
  const items = [
    { href: '#educacion', label: 'Educación', icon: <GraduationCap size={16} /> },
    { href: '#experiencia-laboral', label: 'Experiencia', icon: <Briefcase size={16} /> },
    { href: '#ingresos', label: 'Ingresos', icon: <Banknote size={16} /> },
    { href: '#propiedades', label: 'Propiedades', icon: <Home size={16} /> },
    { href: '#sentencias', label: 'Sentencias', icon: <Gavel size={16} /> },
  ] as const;

  return (
    <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-background/70 backdrop-blur border-b border-white/10">
      <div className="grid grid-cols-5 gap-2">
        {items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className="flex items-center justify-center h-9 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={`Ir a ${it.label}`}
            title={it.label}
          >
            <span className="text-white/80">{it.icon}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

const ComparisonSection = memo(function ComparisonSection({
  title,
  sectionId,
  leftCandidate,
  rightCandidate,
  leftContent,
  rightContent,
}: ComparisonSectionProps) {
  const hasLeftCandidate = leftCandidate !== null;
  const hasRightCandidate = rightCandidate !== null;
  const leftConfig = PLAYER_INDICATORS.left;
  const rightConfig = PLAYER_INDICATORS.right;

  return (
    <div id={sectionId} className="fighting-game-section p-4 mb-4 scroll-mt-16">
      <h3 className="section-title text-sm font-bold mb-3 text-center tracking-wide uppercase opacity-90">
        {title}
      </h3>
      <div className={UI_CLASSES.GRID_TWO_COLS}>
        <div
          className={cn(
            'p-3 md:p-4 rounded-lg',
            UI_CLASSES.BREAK_WORDS,
            hasLeftCandidate ? `${leftConfig.panelColor} text-white` : 'bg-muted/20 border border-muted text-muted-foreground italic'
          )}
        >
          {leftContent}
        </div>
        <div
          className={cn(
            'p-3 md:p-4 rounded-lg',
            UI_CLASSES.BREAK_WORDS,
            hasRightCandidate ? `${rightConfig.panelColor} text-white` : 'bg-muted/20 border border-muted text-muted-foreground italic'
          )}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
});

export function CandidateComparisonGrid({ leftCandidate, rightCandidate }: CandidateComparisonGridProps) {
  const hasSelection = leftCandidate || rightCandidate;

  const renderEducacion = (candidateId: string) => {
    const e = educacion[candidateId];
    if (!e) return <div className="text-sm text-white/70">Sin datos</div>;

    const primariaOk = (e.basica?.primaria ?? '').toLowerCase() === 'sí';
    const secundariaOk = (e.basica?.secundaria ?? '').toLowerCase() === 'sí';

    const topPost = e.postgrado?.[0];
    const topUni = e.universitaria?.[0];

    return (
      <div className="grid grid-cols-2 gap-2">
        <Stat
          icon={<GraduationCap size={14} />}
          label="Básica"
          value={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs">
                {primariaOk ? <Check size={14} /> : <X size={14} />} <span className="text-white/70">Pri</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs">
                {secundariaOk ? <Check size={14} /> : <X size={14} />} <span className="text-white/70">Sec</span>
              </span>
            </div>
          }
        />
        <Stat
          icon={<GraduationCap size={14} />}
          label="Registros"
          value={`${(e.universitaria?.length ?? 0)} Uni · ${(e.postgrado?.length ?? 0)} Post`}
          sub={
            topPost
              ? `${topPost.tipo}: ${topPost.institucion} (${formatYear(topPost.año)})`
              : topUni
                ? `${topUni.universidad} (${formatYear(topUni.año)})`
                : '—'
          }
        />
      </div>
    );
  };

  const renderExperiencia = (candidateId: string) => {
    const jobs = experienciaLaboral[candidateId] ?? [];
    const top = jobs[0];
    return (
      <div className="grid grid-cols-2 gap-2">
        <Stat icon={<Briefcase size={14} />} label="Cargos" value={`${jobs.length}`} sub={top ? `${top.puesto}` : 'Sin datos'} />
        <Stat icon={<Briefcase size={14} />} label="Más reciente" value={top ? top.periodo : '—'} sub={top ? top.empresa : '—'} />
      </div>
    );
  };

  const renderIngresos = (candidateId: string) => {
    const row = getLatestIngreso(candidateId);
    if (!row) return <div className="text-sm text-white/70">Sin datos</div>;
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={<Banknote size={14} />} label="Total" value={formatMoneyCompact(row.total)} sub={`Año ${row.año}`} />
          <Stat icon={<Banknote size={14} />} label="Mix" value={`${Math.round(((row.publico ?? 0) / (row.total || 1)) * 100)}% Pub`} sub={`${Math.round(((row.privado ?? 0) / (row.total || 1)) * 100)}% Priv`} />
        </div>
        <MiniBar a={row.publico ?? 0} b={row.privado ?? 0} aClass="bg-sky-500/80" bClass="bg-fuchsia-500/80" />
        <div className="flex justify-between text-[11px] text-white/70">
          <span>Púb: {formatMoneyCompact(row.publico)}</span>
          <span>Priv: {formatMoneyCompact(row.privado)}</span>
        </div>
      </div>
    );
  };

  const renderPropiedades = (candidateId: string) => {
    const p = propiedades[candidateId];
    if (!p) return <div className="text-sm text-white/70">Sin datos</div>;
    return (
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={<Home size={14} />} label="Inm" value={p.inmuebles} />
        <Stat icon={<Car size={14} />} label="Veh" value={p.vehiculos} />
        <Stat icon={<Package size={14} />} label="Otros" value={p.otros} />
      </div>
    );
  };

  const renderSentencias = (candidateId: string) => {
    const rows = sentencias[candidateId] ?? [];
    const top = rows[0];
    return (
      <div className="grid grid-cols-2 gap-2">
        <Stat icon={<Gavel size={14} />} label="Registros" value={`${rows.length}`} sub={rows.length ? 'Ver detalle en perfil' : 'Sin registro'} />
        <Stat
          icon={<Gavel size={14} />}
          label="Última"
          value={top ? formatYear(top.año) : '—'}
          sub={top ? `${top.delito} · ${top.fallo}` : '—'}
        />
      </div>
    );
  };

  return (
    <div className="fighting-game-bg-compare flex flex-col h-screen overflow-hidden">
      <main className="flex-grow overflow-y-auto px-4 md:px-6 pb-24" style={{ scrollBehavior: 'smooth' }}>
        <div className="max-w-6xl mx-auto">
          {/* Character Images at Top */}
          <div className="py-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Character */}
              <div className="flex flex-col items-center avatar-container">
                {leftCandidate ? (
                  <>
                    <CandidateFullBodyMedia
                      candidate={leftCandidate}
                      side="left"
                      className="w-32 h-48 md:w-40 md:h-56 rounded shadow-lg mb-4 overflow-hidden"
                    />
                    <Link to={`/candidate/${leftCandidate.id}`} className="font-bold text-sm md:text-base text-white text-center hover:underline">
                      {leftCandidate.nombre}
                    </Link>
                    <div className="text-xs md:text-sm text-team-left font-medium text-center">
                      {leftCandidate.ideologia ?? '—'}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <div className="w-32 h-48 md:w-40 md:h-56 bg-team-left/10 rounded border-2 border-dashed border-team-left/40 flex flex-col items-center justify-center mb-4 gap-2">
                      <div className="w-16 h-16 rounded-full bg-team-left flex items-center justify-center text-white text-2xl font-bold">1</div>
                      <span className="text-xs text-muted-foreground font-semibold">Candidato 1</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Elige abajo</span>
                  </motion.div>
                )}
              </div>

              {/* Right Character */}
              <div className="flex flex-col items-center avatar-container">
                {rightCandidate ? (
                  <>
                    <CandidateFullBodyMedia
                      candidate={rightCandidate}
                      side="right"
                      className="w-32 h-48 md:w-40 md:h-56 rounded shadow-lg mb-4 overflow-hidden"
                    />
                    <Link to={`/candidate/${rightCandidate.id}`} className="font-bold text-sm md:text-base text-white text-center hover:underline">
                      {rightCandidate.nombre}
                    </Link>
                    <div className="text-xs md:text-sm text-team-right font-medium text-center">
                      {rightCandidate.ideologia ?? '—'}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <div className="w-32 h-48 md:w-40 md:h-56 bg-team-right/10 rounded border-2 border-dashed border-team-right/40 flex flex-col items-center justify-center mb-4 gap-2">
                      <div className="w-16 h-16 rounded-full bg-team-right flex items-center justify-center text-white text-2xl font-bold">2</div>
                      <span className="text-xs text-muted-foreground font-semibold">Candidato 2</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Elige abajo</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Comparison Sections */}
          {hasSelection && (
            <>
              <SectionNav />

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <ComparisonSection
                  title="Educación"
                  sectionId="educacion"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderEducacion(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderEducacion(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Experiencia"
                  sectionId="experiencia-laboral"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderExperiencia(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderExperiencia(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Ingresos"
                  sectionId="ingresos"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderIngresos(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderIngresos(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Propiedades"
                  sectionId="propiedades"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderPropiedades(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderPropiedades(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Sentencias"
                  sectionId="sentencias"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderSentencias(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderSentencias(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                {/* Minimal CTAs */}
                <div className="px-4 pb-4 -mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {leftCandidate ? (
                      <Link
                        to={`/candidate/${leftCandidate.id}`}
                        className="flex items-center justify-center gap-1 text-xs rounded-md border border-white/10 bg-white/5 py-2 hover:bg-white/10"
                        aria-label="Ver perfil del candidato 1"
                      >
                        Perfil <ArrowUpRight size={14} />
                      </Link>
                    ) : <div />}
                    {rightCandidate ? (
                      <Link
                        to={`/candidate/${rightCandidate.id}`}
                        className="flex items-center justify-center gap-1 text-xs rounded-md border border-white/10 bg-white/5 py-2 hover:bg-white/10"
                        aria-label="Ver perfil del candidato 2"
                      >
                        Perfil <ArrowUpRight size={14} />
                      </Link>
                    ) : <div />}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}