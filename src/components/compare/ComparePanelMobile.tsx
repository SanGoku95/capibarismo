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
  ArrowUpRight,
} from 'lucide-react';

interface CandidateComparisonGridProps {
  leftCandidate: CandidateBase | null;
  rightCandidate: CandidateBase | null;
}

interface ComparisonSectionProps {
  title: string;
  sectionId: string;
  profileHash: string; // Hash para navegar al perfil
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

function MetricRow({
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
    <div className="rounded-md border border-white/10 bg-white/5 px-2.5 py-2 overflow-hidden">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/80 flex-shrink-0">{icon}</span>
          <span className="text-[11px] text-white/70 font-semibold truncate">{label}</span>
        </div>
        <span className="text-sm font-bold text-white truncate tabular-nums">{value}</span>
      </div>
      {sub ? (
        <div className="mt-1 text-[11px] leading-snug text-white/65 line-clamp-2 break-words">
          {sub}
        </div>
      ) : null}
    </div>
  );
}

// Card optimized for showing job/education entries - title first, stacked layout
function EntryCard({
  icon,
  title,
  subtitle,
  meta,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  meta?: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 px-2.5 py-2 overflow-hidden">
      <div className="flex items-start gap-2">
        <span className="text-white/80 flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-white leading-tight line-clamp-2">
            {title}
          </div>
          <div className="text-[11px] text-white/65 leading-snug line-clamp-2 mt-0.5">
            {subtitle}
          </div>
          {meta && (
            <div className="text-[10px] text-white/50 mt-0.5">
              {meta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CountChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 min-w-0">
      <span className="text-white/75 flex-shrink-0">{icon}</span>
      <span className="text-[10px] text-white/65 font-semibold truncate">{label}</span>
      <span className="ml-auto text-xs font-bold text-white tabular-nums">{value}</span>
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
  profileHash,
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

      <div className={cn('grid grid-cols-1 min-[360px]:grid-cols-2 gap-3', UI_CLASSES.BREAK_WORDS)}>
        {/* Left Panel - Clickeable */}
        {hasLeftCandidate ? (
          <Link
            to={`/candidate/${leftCandidate.id}#${profileHash}`}
            className={cn(
              'p-3 md:p-4 rounded-lg min-w-0 block transition-all',
              `${leftConfig.panelColor} text-white`,
              'hover:ring-2 hover:ring-white/30 hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider opacity-60">Ver más</span>
              <ArrowUpRight size={12} className="opacity-60" />
            </div>
            {leftContent}
          </Link>
        ) : (
          <div className="p-3 md:p-4 rounded-lg min-w-0 bg-muted/20 border border-muted text-muted-foreground italic">
            <span className="font-sans">—</span>
          </div>
        )}

        {/* Right Panel - Clickeable */}
        {hasRightCandidate ? (
          <Link
            to={`/candidate/${rightCandidate.id}#${profileHash}`}
            className={cn(
              'p-3 md:p-4 rounded-lg min-w-0 block transition-all',
              `${rightConfig.panelColor} text-white`,
              'hover:ring-2 hover:ring-white/30 hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider opacity-60">Ver más</span>
              <ArrowUpRight size={12} className="opacity-60" />
            </div>
            {rightContent}
          </Link>
        ) : (
          <div className="p-3 md:p-4 rounded-lg min-w-0 bg-muted/20 border border-muted text-muted-foreground italic">
            <span className="font-sans">—</span>
          </div>
        )}
      </div>
    </div>
  );
});

export function CandidateComparisonGrid({ leftCandidate, rightCandidate }: CandidateComparisonGridProps) {
  const hasSelection = leftCandidate || rightCandidate;

  const renderEducacion = (candidateId: string) => {
    const e = educacion[candidateId];
    if (!e) return <div className="text-sm text-white/70">Sin datos</div>;

    // Combine postgrado and universitaria, sort by year (most recent first)
    const allTitles = [
      ...(e.postgrado ?? []).map((p) => ({
        tipo: p.tipo,
        institucion: p.institucion,
        año: p.año,
      })),
      ...(e.universitaria ?? []).map((u) => ({
        tipo: 'Universitario',
        institucion: u.universidad,
        año: u.año,
      })),
    ].sort((a, b) => Number(b.año || 0) - Number(a.año || 0));

    if (!allTitles.length) return <div className="text-sm text-white/70">Sin títulos registrados</div>;

    // Show up to 3 most recent titles
    return (
      <div className="space-y-2">
        {allTitles.slice(0, 3).map((title, idx) => (
          <EntryCard
            key={`${title.tipo}-${title.institucion}-${title.año ?? idx}`}
            icon={<GraduationCap size={14} />}
            title={title.tipo}
            subtitle={title.institucion}
            meta={title.año ? `Año ${title.año}` : undefined}
          />
        ))}
        {allTitles.length > 3 && (
          <div className="text-[10px] text-white/50 text-center">+{allTitles.length - 3} más</div>
        )}
      </div>
    );
  };

  const renderExperiencia = (candidateId: string) => {
    const jobs = experienciaLaboral[candidateId] ?? [];

    if (!jobs.length) return <div className="text-sm text-white/70">Sin experiencia registrada</div>;

    // Show up to 3 most recent jobs
    return (
      <div className="space-y-2">
        {jobs.slice(0, 3).map((job, idx) => (
          <EntryCard
            key={`${job.puesto}-${job.empresa}-${job.periodo}-${idx}`}
            icon={<Briefcase size={14} />}
            title={job.puesto}
            subtitle={job.empresa}
            meta={job.periodo}
          />
        ))}
        {jobs.length > 3 && (
          <div className="text-[10px] text-white/50 text-center">+{jobs.length - 3} más</div>
        )}
      </div>
    );
  };

  const renderIngresos = (candidateId: string) => {
    const row = getLatestIngreso(candidateId);
    if (!row) return <div className="text-sm text-white/70">Sin datos</div>;

    const pub = row.publico ?? 0;
    const priv = row.privado ?? 0;
    const total = row.total || 0;
    const pubPct = total > 0 ? Math.round((pub / total) * 100) : 0;

    return (
      <div className="space-y-2">
        <div className="rounded-md border border-white/10 bg-white/5 px-2.5 py-2">
          <div className="flex items-center gap-2 mb-1">
            <Banknote size={14} className="text-white/80 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white tabular-nums">{formatMoneyCompact(row.total)}</div>
              <div className="text-[10px] text-white/60">Total · Año {row.año}</div>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-white/5 px-2.5 py-2">
          <div className="flex items-center justify-between text-[10px] text-white/65 mb-1.5">
            <span>Público {pubPct}%</span>
            <span>Privado {100 - pubPct}%</span>
          </div>
          <MiniBar a={pub} b={priv} aClass="bg-sky-500/80" bClass="bg-fuchsia-500/80" />
          <div className="mt-1.5 grid grid-cols-2 gap-2 text-[10px] text-white/60">
            <div className="truncate">{formatMoneyCompact(pub)}</div>
            <div className="truncate text-right">{formatMoneyCompact(priv)}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderPropiedades = (candidateId: string) => {
    const p = propiedades[candidateId];
    if (!p) return <div className="text-sm text-white/70">Sin datos</div>;

    return (
      <div className="flex flex-wrap gap-2">
        <CountChip icon={<Home size={14} />} label="Inm" value={p.inmuebles} />
        <CountChip icon={<Car size={14} />} label="Veh" value={p.vehiculos} />
        <CountChip icon={<Package size={14} />} label="Otros" value={p.otros} />
      </div>
    );
  };

  const renderSentencias = (candidateId: string) => {
    const rows = sentencias[candidateId] ?? [];
    const top = rows[0];

    return (
      <div className="space-y-2">
        <MetricRow
          icon={<Gavel size={14} />}
          label="Registros"
          value={rows.length}
          sub={rows.length ? 'Detalle en perfil' : 'Sin registro'}
        />
        <MetricRow
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
                  profileHash="tray-educacion"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderEducacion(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderEducacion(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Experiencia"
                  sectionId="experiencia-laboral"
                  profileHash="tray-experiencia"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderExperiencia(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderExperiencia(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Ingresos"
                  sectionId="ingresos"
                  profileHash="patrimonio"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderIngresos(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderIngresos(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Propiedades"
                  sectionId="propiedades"
                  profileHash="patrimonio"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderPropiedades(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderPropiedades(rightCandidate.id) : <span className="font-sans">—</span>}
                />

                <ComparisonSection
                  title="Sentencias"
                  sectionId="sentencias"
                  profileHash="sentencias"
                  leftCandidate={leftCandidate}
                  rightCandidate={rightCandidate}
                  leftContent={leftCandidate ? renderSentencias(leftCandidate.id) : <span className="font-sans">—</span>}
                  rightContent={rightCandidate ? renderSentencias(rightCandidate.id) : <span className="font-sans">—</span>}
                />
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}