import { useEffect, useRef, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { findCandidateBase } from '@/data';
import { Lock, Crown } from 'lucide-react';
import { ROUND_CONFIG, PROPAGATION_GROUP_SIZES } from '@/lib/tournamentConstants';
import type { TournamentBracket, TournamentMatch } from '@/lib/tournamentTypes';

// =============================================================================
// Types
// =============================================================================

interface BracketTreeProps {
  bracket: TournamentBracket;
  currentRound: number;
  currentMatchIndex: number;
  /** On mobile: start zoomed-out showing full bracket, then zoom into current match */
  showOverviewFirst?: boolean;
}

type MatchStatus = 'completed' | 'current' | 'upcoming';

// =============================================================================
// Constants
// =============================================================================

const MATCH_H = 88;
const GAP = 10;
const COL_W = 190;
const CONNECTOR_W = 32;

// Derived
const HALF_W = 3 * COL_W + 2 * CONNECTOR_W; // one half (R0→R1→R2)
const CENTER_START = HALF_W + CONNECTOR_W;    // where R3 column starts
const RIGHT_START = CENTER_START + COL_W + CONNECTOR_W; // where right half starts

// Semifinal-only layout (used when R0/R1 are empty stubs)
const SEMI_COL_W = 260;
const SEMI_MATCH_H = 160;
const SEMI_CONNECTOR_W = 56;

// =============================================================================
// Helpers
// =============================================================================

function getMatchStatus(
  roundIndex: number,
  matchIndex: number,
  currentRound: number,
  currentMatchIndex: number,
): MatchStatus {
  if (roundIndex < currentRound) return 'completed';
  if (roundIndex > currentRound) return 'upcoming';
  if (matchIndex < currentMatchIndex) return 'completed';
  if (matchIndex === currentMatchIndex) return 'current';
  return 'upcoming';
}

function getLastName(nombre: string): string {
  const parts = nombre.split(' ');
  return parts[parts.length - 1];
}

// =============================================================================
// Layout Computation
// =============================================================================

interface HalfLayout {
  r0Ys: number[];
  r1Ys: number[];
  r2Y: number;
  totalH: number;
}

function computeHalfLayout(): HalfLayout {
  const r0Ys: number[] = [];
  for (let i = 0; i < 6; i++) {
    r0Ys.push(i * (MATCH_H + GAP) + MATCH_H / 2);
  }

  const r1Ys = [
    (r0Ys[0] + r0Ys[2]) / 2,
    (r0Ys[3] + r0Ys[5]) / 2,
  ];

  const r2Y = (r1Ys[0] + r1Ys[1]) / 2;
  const totalH = r0Ys[5] + MATCH_H / 2 + GAP;

  return { r0Ys, r1Ys, r2Y, totalH };
}

// =============================================================================
// Focus Point (for mobile zoom)
// =============================================================================

function computeFocusPoint(
  round: number,
  matchIndex: number,
  layout: HalfLayout,
): { x: number; y: number } {
  if (round === 0) {
    const isRight = matchIndex >= 6;
    const localIdx = isRight ? matchIndex - 6 : matchIndex;
    const colX = isRight
      ? RIGHT_START + 2 * (COL_W + CONNECTOR_W) + COL_W / 2
      : COL_W / 2;
    return { x: colX, y: layout.r0Ys[localIdx] };
  }
  if (round === 1) {
    const isRight = matchIndex >= 2;
    const localIdx = isRight ? matchIndex - 2 : matchIndex;
    const colX = isRight
      ? RIGHT_START + (COL_W + CONNECTOR_W) + COL_W / 2
      : (COL_W + CONNECTOR_W) + COL_W / 2;
    return { x: colX, y: layout.r1Ys[localIdx] };
  }
  if (round === 2) {
    const isRight = matchIndex === 1;
    const colX = isRight
      ? RIGHT_START + COL_W / 2
      : 2 * (COL_W + CONNECTOR_W) + COL_W / 2;
    return { x: colX, y: layout.r2Y };
  }
  // R3 final
  return { x: CENTER_START + COL_W / 2, y: layout.r2Y };
}

// =============================================================================
// Match Slot
// =============================================================================

function MatchSlot({
  match,
  status,
  isCurrent,
  colW = COL_W,
  matchH = MATCH_H,
}: {
  match: TournamentMatch;
  status: MatchStatus;
  isCurrent: boolean;
  colW?: number;
  matchH?: number;
}) {
  const isEmpty = match.candidates.length === 0;
  const isLarge = colW >= 240;

  return (
    <div
      className={cn(
        'relative rounded border bg-black/70 transition-all',
        isLarge ? 'text-sm' : 'text-[10px] sm:text-[13px]',
        status === 'completed' && 'border-green-500/30',
        isCurrent && 'border-yellow-400/80 shadow-[0_0_12px_rgba(255,193,7,0.5)]',
        status === 'upcoming' && !isCurrent && 'border-white/10 opacity-50',
      )}
      style={{ width: colW, height: matchH }}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full gap-1">
          <Lock className={cn(isLarge ? 'w-5 h-5' : 'w-3 h-3', 'text-white/20')} />
          <span className="text-white/15" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: isLarge ? '8px' : '6px' }}>¿?</span>
        </div>
      ) : (
        <div className={cn('flex flex-col justify-center h-full', isLarge ? 'px-3' : 'px-2')}>
          {match.candidates.map((cId, i) => {
            const candidate = findCandidateBase(cId);
            const isWinner = match.winner === cId;
            const isEliminated = match.eliminated.includes(cId);
            const avatarCls = isLarge
              ? (match.candidates.length <= 2 ? 'w-14 h-14' : 'w-10 h-10')
              : (match.candidates.length <= 2 ? 'w-8 h-8' : 'w-6 h-6');

            return (
              <div key={cId} className={cn(
                'flex items-center px-1.5',
                isLarge ? 'gap-3' : 'gap-1.5',
                i > 0 && 'border-t border-white/10',
              )} style={{ height: match.candidates.length <= 2 ? '50%' : '33.33%' }}>
                <div className={cn(
                  'rounded-full overflow-hidden border flex-shrink-0',
                  avatarCls,
                  isWinner && 'border-yellow-400/80',
                  isEliminated && 'border-red-500/50 opacity-40',
                  !isWinner && !isEliminated && 'border-white/20',
                )}>
                  {candidate?.headshot ? (
                    <img
                      src={encodeURI(candidate.headshot)}
                      alt={candidate.nombre}
                      className={cn('w-full h-full object-cover', isEliminated && 'grayscale')}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/30 text-[6px]">?</div>
                  )}
                </div>
                <span className={cn(
                  'truncate leading-none flex-1',
                  isWinner && 'text-yellow-400 font-bold',
                  isEliminated && 'text-white/25 line-through',
                  !isWinner && !isEliminated && 'text-white/70',
                )}>
                  {candidate ? getLastName(candidate.nombre) : '???'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SVG Connectors
// =============================================================================

function HalfConnectors({
  parentYs,
  childYs,
  groupSize,
  completed,
  mirrored,
}: {
  parentYs: number[];
  childYs: number[];
  groupSize: number;
  completed: boolean;
  mirrored?: boolean;
}) {
  const maxY = Math.max(
    parentYs.length > 0 ? parentYs[parentYs.length - 1] + MATCH_H / 2 : 0,
    childYs.length > 0 ? childYs[childYs.length - 1] + MATCH_H / 2 : 0,
  );

  const color = completed ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.15)';
  const midX = CONNECTOR_W / 2;

  const paths: string[] = [];
  for (let ci = 0; ci < childYs.length; ci++) {
    const childY = childYs[ci];
    for (let pi = 0; pi < groupSize; pi++) {
      const parentIdx = ci * groupSize + pi;
      if (parentIdx >= parentYs.length) break;
      const parentY = parentYs[parentIdx];
      paths.push(`M 0 ${parentY} H ${midX} V ${childY} H ${CONNECTOR_W}`);
    }
  }

  return (
    <svg
      width={CONNECTOR_W}
      height={maxY + GAP}
      className="flex-shrink-0"
      style={{ minHeight: maxY + GAP, transform: mirrored ? 'scaleX(-1)' : undefined }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={1.5} />
      ))}
    </svg>
  );
}

function CenterConnector({
  fromY,
  toY,
  height,
  completed,
  mirrored,
}: {
  fromY: number;
  toY: number;
  height: number;
  completed: boolean;
  mirrored?: boolean;
}) {
  const color = completed ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.15)';
  const midX = CONNECTOR_W / 2;
  const d = `M 0 ${fromY} H ${midX} V ${toY} H ${CONNECTOR_W}`;

  return (
    <svg
      width={CONNECTOR_W}
      height={height}
      className="flex-shrink-0"
      style={{ minHeight: height, transform: mirrored ? 'scaleX(-1)' : undefined }}
    >
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

// =============================================================================
// Semifinal-only Layout (when R0/R1 are empty stubs)
// =============================================================================

function SemifinalBracketLayout({
  bracket,
  currentRound,
  currentMatchIndex,
  currentMatchRef,
}: {
  bracket: TournamentBracket;
  currentRound: number;
  currentMatchIndex: number;
  currentMatchRef: React.RefObject<HTMLDivElement | null>;
}) {
  const r2Match0 = bracket.rounds[2].matches[0];
  const r2Match1 = bracket.rounds[2].matches[1];
  const r3Match = bracket.rounds[3].matches[0];

  const centerY = SEMI_MATCH_H / 2;
  const connectorColor = currentRound > 2 ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.15)';

  const r2_0_status = getMatchStatus(2, 0, currentRound, currentMatchIndex);
  const r2_1_status = getMatchStatus(2, 1, currentRound, currentMatchIndex);
  const r3Status = getMatchStatus(3, 0, currentRound, currentMatchIndex);
  const r2_0_isCurrent = currentRound === 2 && currentMatchIndex === 0;
  const r2_1_isCurrent = currentRound === 2 && currentMatchIndex === 1;
  const r3IsCurrent = currentRound === 3 && currentMatchIndex === 0;

  const colLabel = (text: string, gold?: boolean) => (
    <div className="text-center absolute -top-6 left-0 right-0">
      <span
        className={cn(
          'text-[8px] sm:text-[10px] uppercase tracking-wider',
          gold ? 'text-yellow-400/60' : 'text-white/40',
        )}
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex items-center px-4 py-16">
      {/* Left semifinal */}
      <div className="flex-shrink-0 relative">
        {colLabel(ROUND_CONFIG[2]?.label ?? 'Semifinal')}
        <div ref={r2_0_isCurrent ? currentMatchRef : undefined}>
          <MatchSlot match={r2Match0} status={r2_0_status} isCurrent={r2_0_isCurrent} colW={SEMI_COL_W} matchH={SEMI_MATCH_H} />
        </div>
      </div>

      {/* Left → final connector */}
      <svg width={SEMI_CONNECTOR_W} height={SEMI_MATCH_H} className="flex-shrink-0">
        <line x1={0} y1={centerY} x2={SEMI_CONNECTOR_W} y2={centerY} stroke={connectorColor} strokeWidth={1.5} />
      </svg>

      {/* Final */}
      <div className="flex-shrink-0 relative">
        {colLabel(ROUND_CONFIG[3]?.label ?? 'Final', true)}
        <div className="absolute -top-14 left-0 right-0 flex justify-center">
          <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]" />
        </div>
        <div ref={r3IsCurrent ? currentMatchRef : undefined}>
          <MatchSlot match={r3Match} status={r3Status} isCurrent={r3IsCurrent} colW={SEMI_COL_W} matchH={SEMI_MATCH_H} />
        </div>
      </div>

      {/* Final → right connector */}
      <svg width={SEMI_CONNECTOR_W} height={SEMI_MATCH_H} className="flex-shrink-0">
        <line x1={0} y1={centerY} x2={SEMI_CONNECTOR_W} y2={centerY} stroke={connectorColor} strokeWidth={1.5} />
      </svg>

      {/* Right semifinal */}
      <div className="flex-shrink-0 relative">
        {colLabel(ROUND_CONFIG[2]?.label ?? 'Semifinal')}
        <div ref={r2_1_isCurrent ? currentMatchRef : undefined}>
          <MatchSlot match={r2Match1} status={r2_1_status} isCurrent={r2_1_isCurrent} colW={SEMI_COL_W} matchH={SEMI_MATCH_H} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Half Bracket (R0 → R1 → R2 for one side)
// =============================================================================

function HalfBracket({
  bracket,
  layout,
  r0Start,
  r1Start,
  r2MatchIndex,
  currentRound,
  currentMatchIndex,
  mirrored,
  totalH,
  currentMatchRef,
}: {
  bracket: TournamentBracket;
  layout: HalfLayout;
  r0Start: number;
  r1Start: number;
  r2MatchIndex: number;
  currentRound: number;
  currentMatchIndex: number;
  mirrored?: boolean;
  totalH: number;
  currentMatchRef: React.RefObject<HTMLDivElement | null>;
}) {
  const r0Matches = bracket.rounds[0].matches.slice(r0Start, r0Start + 6);
  const r1Matches = bracket.rounds[1].matches.slice(r1Start, r1Start + 2);
  const r2Match = bracket.rounds[2].matches[r2MatchIndex];

  const columns = (
    <>
      {/* R0 column */}
      <div className="flex-shrink-0 relative" style={{ width: COL_W }}>
        <div className="text-center absolute -top-5 left-0 right-0">
          <span className="text-[8px] sm:text-[10px] text-white/40 uppercase tracking-wider"
            style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {ROUND_CONFIG[0]?.label}
          </span>
        </div>
        <div style={{ position: 'relative', height: totalH }}>
          {r0Matches.map((match, i) => {
            const globalIdx = r0Start + i;
            const y = layout.r0Ys[i] - MATCH_H / 2;
            const status = getMatchStatus(0, globalIdx, currentRound, currentMatchIndex);
            const isCurrent = currentRound === 0 && currentMatchIndex === globalIdx;
            return (
              <div key={match.id}
                ref={isCurrent ? currentMatchRef : undefined}
                style={{ position: 'absolute', top: y, left: 0 }}>
                <MatchSlot match={match} status={status} isCurrent={isCurrent} />
              </div>
            );
          })}
        </div>
      </div>

      {/* R0→R1 connectors */}
      <div className="flex-shrink-0" style={{ position: 'relative', height: totalH }}>
        <HalfConnectors
          parentYs={layout.r0Ys}
          childYs={layout.r1Ys}
          groupSize={PROPAGATION_GROUP_SIZES[0]}
          completed={currentRound > 0}
          mirrored={mirrored}
        />
      </div>

      {/* R1 column */}
      <div className="flex-shrink-0 relative" style={{ width: COL_W }}>
        <div className="text-center absolute -top-5 left-0 right-0">
          <span className="text-[8px] sm:text-[10px] text-white/40 uppercase tracking-wider"
            style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {ROUND_CONFIG[1]?.label}
          </span>
        </div>
        <div style={{ position: 'relative', height: totalH }}>
          {r1Matches.map((match, i) => {
            const globalIdx = r1Start + i;
            const y = layout.r1Ys[i] - MATCH_H / 2;
            const status = getMatchStatus(1, globalIdx, currentRound, currentMatchIndex);
            const isCurrent = currentRound === 1 && currentMatchIndex === globalIdx;
            return (
              <div key={match.id}
                ref={isCurrent ? currentMatchRef : undefined}
                style={{ position: 'absolute', top: y, left: 0 }}>
                <MatchSlot match={match} status={status} isCurrent={isCurrent} />
              </div>
            );
          })}
        </div>
      </div>

      {/* R1→R2 connectors */}
      <div className="flex-shrink-0" style={{ position: 'relative', height: totalH }}>
        <HalfConnectors
          parentYs={layout.r1Ys}
          childYs={[layout.r2Y]}
          groupSize={PROPAGATION_GROUP_SIZES[1]}
          completed={currentRound > 1}
          mirrored={mirrored}
        />
      </div>

      {/* R2 column (semifinal) */}
      <div className="flex-shrink-0 relative" style={{ width: COL_W }}>
        <div className="text-center absolute -top-5 left-0 right-0">
          <span className="text-[8px] sm:text-[10px] text-white/40 uppercase tracking-wider"
            style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {ROUND_CONFIG[2]?.label}
          </span>
        </div>
        <div style={{ position: 'relative', height: totalH }}>
          {(() => {
            const y = layout.r2Y - MATCH_H / 2;
            const status = getMatchStatus(2, r2MatchIndex, currentRound, currentMatchIndex);
            const isCurrent = currentRound === 2 && currentMatchIndex === r2MatchIndex;
            return (
              <div
                ref={isCurrent ? currentMatchRef : undefined}
                style={{ position: 'absolute', top: y, left: 0 }}>
                <MatchSlot match={r2Match} status={status} isCurrent={isCurrent} />
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );

  if (mirrored) {
    return (
      <div className="flex items-start flex-row-reverse">
        {columns}
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {columns}
    </div>
  );
}

// =============================================================================
// Main BracketTree
// =============================================================================

export function BracketTree({ bracket, currentRound, currentMatchIndex, showOverviewFirst }: BracketTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMatchRef = useRef<HTMLDivElement>(null);

  const isSemifinalMode = bracket.rounds[0].matches.length === 0;

  const layout = useMemo(() => computeHalfLayout(), []);
  const totalH = layout.totalH;

  // Track viewport for mobile zoom
  const [viewportW, setViewportW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  // Overview pan: 'left' → 'right' → 'done' (zooms left half, pans to right, then zooms current match)
  type OverviewStep = 'left' | 'right' | 'done';
  const [overviewStep, setOverviewStep] = useState<OverviewStep>(
    showOverviewFirst ? 'left' : 'done'
  );

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Timed overview pan: left → right → done
  useEffect(() => {
    if (overviewStep === 'done') return;
    if (overviewStep === 'left') {
      const timer = setTimeout(() => setOverviewStep('right'), 1200);
      return () => clearTimeout(timer);
    }
    if (overviewStep === 'right') {
      const timer = setTimeout(() => setOverviewStep('done'), 1200);
      return () => clearTimeout(timer);
    }
  }, [overviewStep]);

  const isMobile = viewportW < 768;

  // Compute mobile zoom transform
  const mobileTransform = useMemo(() => {
    if (!isMobile) return undefined;

    const availH = window.innerHeight - 100;

    // Semifinal layout: pan into the active match card
    if (isSemifinalMode) {
      // Pixel positions of match centers inside SemifinalBracketLayout (px-4 py-16)
      const px = 16; // px-4
      const py = 64; // py-16
      const focusY = py + SEMI_MATCH_H / 2;
      let focusX: number;
      if (currentRound === 2 && currentMatchIndex === 0) {
        focusX = px + SEMI_COL_W / 2;
      } else if (currentRound === 3) {
        focusX = px + SEMI_COL_W + SEMI_CONNECTOR_W + SEMI_COL_W / 2;
      } else {
        // R2 match 1 (right semifinal)
        focusX = px + 2 * (SEMI_COL_W + SEMI_CONNECTOR_W) + SEMI_COL_W / 2;
      }
      const zoom = Math.min((viewportW * 0.85) / SEMI_COL_W, 2.0);
      const tx = viewportW / 2 / zoom - focusX;
      const ty = availH / 2 / zoom - focusY;
      return {
        transform: `scale(${zoom}) translate(${tx}px, ${ty}px)`,
        transformOrigin: '0 0' as const,
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }

    // Fill height: zoom so all 6 R0 matches fill the viewport vertically
    const panZoom = availH / (totalH + 10);

    if (overviewStep === 'left') {
      // Focus on left R0 column (show R0 + connector + R1)
      const leftFocusX = COL_W / 2 + CONNECTOR_W;
      const leftFocusY = totalH / 2;
      const tx = viewportW / 2 / panZoom - leftFocusX;
      const ty = availH / 2 / panZoom - leftFocusY;
      return {
        transform: `scale(${panZoom}) translate(${tx}px, ${ty}px)`,
        transformOrigin: '0 0' as const,
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }

    if (overviewStep === 'right') {
      // Focus on right R0 column (mirrored side)
      const rightFocusX = RIGHT_START + 2 * (COL_W + CONNECTOR_W) + COL_W / 2 - CONNECTOR_W;
      const rightFocusY = totalH / 2;
      const tx = viewportW / 2 / panZoom - rightFocusX;
      const ty = availH / 2 / panZoom - rightFocusY;
      return {
        transform: `scale(${panZoom}) translate(${tx}px, ${ty}px)`,
        transformOrigin: '0 0' as const,
        transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }

    // Normal: zoom into current match
    const focus = computeFocusPoint(currentRound, currentMatchIndex, layout);
    const zoom = Math.min(viewportW / (COL_W + 2 * CONNECTOR_W), 2.5);

    const tx = viewportW / 2 / zoom - focus.x;
    const ty = availH / 2 / zoom - focus.y;

    return {
      transform: `scale(${zoom}) translate(${tx}px, ${ty}px)`,
      transformOrigin: '0 0' as const,
      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  }, [isMobile, isSemifinalMode, viewportW, currentRound, currentMatchIndex, layout, overviewStep, totalH]);

  // Desktop: auto-scroll to current match
  useEffect(() => {
    if (isMobile) return; // zoom handles it on mobile
    const timer = setTimeout(() => {
      currentMatchRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [currentRound, currentMatchIndex, isMobile]);

  // Simplified view for external semifinal tournaments
  if (isSemifinalMode) {
    return (
      <div ref={scrollRef} className={cn('flex-1', isMobile ? 'overflow-hidden' : 'overflow-auto flex items-center justify-center')}>
        <div style={{ ...(mobileTransform ?? {}) }}>
          <SemifinalBracketLayout
            bracket={bracket}
            currentRound={currentRound}
            currentMatchIndex={currentMatchIndex}
            currentMatchRef={currentMatchRef}
          />
        </div>
      </div>
    );
  }

  const r3Match = bracket.rounds[3].matches[0];
  const r3Status = getMatchStatus(3, 0, currentRound, currentMatchIndex);
  const r3IsCurrent = currentRound === 3 && currentMatchIndex === 0;
  const finalY = layout.r2Y;

  return (
    <div
      ref={scrollRef}
      className={cn('flex-1', isMobile ? 'overflow-hidden' : 'overflow-auto')}
    >
      <div
        className={cn('flex items-start justify-center min-w-max px-3', isMobile ? 'py-2' : 'py-8')}
        style={{
          minHeight: totalH + 50,
          ...(mobileTransform ?? {}),
        }}
      >

        {/* LEFT HALF: R0[0-5] → R1[0-1] → R2[0] */}
        <HalfBracket
          bracket={bracket}
          layout={layout}
          r0Start={0}
          r1Start={0}
          r2MatchIndex={0}
          currentRound={currentRound}
          currentMatchIndex={currentMatchIndex}
          totalH={totalH}
          currentMatchRef={currentMatchRef}
        />

        {/* Left R2→R3 connector */}
        <div className="flex-shrink-0" style={{ position: 'relative', height: totalH }}>
          <CenterConnector
            fromY={layout.r2Y}
            toY={finalY}
            height={totalH}
            completed={currentRound > 2}
          />
        </div>

        {/* CENTER: R3 Final + Crown */}
        <div className="flex-shrink-0 relative" style={{ width: COL_W, height: totalH }}>
          <div className="text-center absolute -top-5 left-0 right-0">
            <span className="text-[8px] sm:text-[10px] text-yellow-400/60 uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', cursive" }}>
              {ROUND_CONFIG[3]?.label}
            </span>
          </div>
          <div
            ref={r3IsCurrent ? currentMatchRef : undefined}
            style={{ position: 'absolute', top: finalY - MATCH_H / 2, left: 0 }}>
            <MatchSlot match={r3Match} status={r3Status} isCurrent={r3IsCurrent} />
          </div>
          <div
            className="absolute"
            style={{ top: finalY - MATCH_H / 2 - 36, left: (COL_W - 40) / 2 }}>
            <Crown className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_12px_rgba(255,200,0,0.6)]" />
          </div>
        </div>

        {/* Right R2→R3 connector (mirrored) */}
        <div className="flex-shrink-0" style={{ position: 'relative', height: totalH }}>
          <CenterConnector
            fromY={layout.r2Y}
            toY={finalY}
            height={totalH}
            completed={currentRound > 2}
            mirrored
          />
        </div>

        {/* RIGHT HALF: R2[1] ← R1[2-3] ← R0[6-11] (mirrored) */}
        <HalfBracket
          bracket={bracket}
          layout={layout}
          r0Start={6}
          r1Start={2}
          r2MatchIndex={1}
          currentRound={currentRound}
          currentMatchIndex={currentMatchIndex}
          mirrored
          totalH={totalH}
          currentMatchRef={currentMatchRef}
        />
      </div>
    </div>
  );
}
