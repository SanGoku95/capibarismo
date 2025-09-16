import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidates } from '@/data/candidates';
import { Card, CardContent } from '@/components/ui/card'; // removed CardHeader
import { Button } from '@/components/ui/button';
import { useLabelCollision, LabelPosition } from '@/hooks/useLabelCollision'; 

// --- TIPOS Y DATOS ESTRUCTURALES ---
export type Axis = 'econ' | 'social' | 'territorial' | 'power';

interface CompassProps {
  width?: number;
  height?: number;
  selectedCandidateIds?: string[];
  xAxisKey?: Axis;
  yAxisKey?: Axis;
}

type Candidate = {
  id: string;
  nombre: string;
  econ: number;
  social: number;
  territorial?: number; 
  power?: number;       
  color?: string;
  fullBody?: string;
};

export const axisLabels: Record<Axis, { name: string; low: string; high: string }> = {
  econ: { name: 'EJE ECONÓMICO', low: 'IZQUIERDA', high: 'DERECHA' },
  social: { name: 'EJE SOCIAL', low: 'LIBERTARIO', high: 'AUTORITARIO' },
  territorial: { name: 'EJE TERRITORIAL', low: 'REGIONALISTA', high: 'CENTRALISTA' },
  power: { name: 'ESTILO DE PODER', low: 'INSTITUCIONALISTA', high: 'POPULISTA' },
};

// End-captions legibles por eje (se muestran en los extremos de los ejes)
const axisEndCaptions: Record<Axis, { low: string; high: string }> = {
  econ: { low: 'Intervención estatal', high: 'Libre mercado' },
  social: { low: 'Liberal', high: 'Autoritario' },
  territorial: { low: 'Regionalista', high: 'Centralista' },
  power: { low: 'Institucionalista', high: 'Populista' },
};

// --- Componente de Línea Conectora ---
function LeaderLine({ from, to }: { from: {x:number, y:number}, to: LabelPosition }) {
  const toX = to.finalX + to.labelWidth / 2;
  const toY = to.finalY + to.labelHeight;
  return <line x1={from.x} y1={from.y} x2={toX} y2={toY} stroke={'hsl(var(--foreground))'} strokeWidth={1} opacity={0.4} />;
}

// --- COMPONENTE PRINCIPAL ---
export function PoliticalCompass({
  width = 600,
  height = 600,
  selectedCandidateIds,
  xAxisKey = 'econ',
  yAxisKey = 'social',
}: CompassProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState({ w: width, h: height });
  
  const leaveTimeoutRef = useRef<number | null>(null);

  // --- LÓGICA DE ESTADO Y CÁLCULOS ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      // Make the graph a bit bigger on tall screens
      const availableHeight = window.innerHeight - 200; // was 250
      const maxSize = Math.min(containerWidth, availableHeight);
      const size = Math.max(320, Math.min(1000, maxSize)); // was [280, 900]
      setDims({ w: size, h: size });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const displayCandidates = useMemo(() => {
    const base = candidates as Candidate[];
    const filtered =
      selectedCandidateIds && selectedCandidateIds.length > 0
        ? base.filter((c) => selectedCandidateIds.includes(c.id))
        : base;
    return filtered.map(c => ({
      ...c,
      [xAxisKey]: typeof c[xAxisKey] === 'number' ? c[xAxisKey] : 0,
      [yAxisKey]: typeof c[yAxisKey] === 'number' ? c[yAxisKey] : 0,
    })).filter(c => !Number.isNaN(c[xAxisKey]) && !Number.isNaN(c[yAxisKey]));
  }, [selectedCandidateIds, xAxisKey, yAxisKey]);
  
  const PAD = Math.max(30, Math.min(80, dims.w * 0.1));
  const AXIS_STROKE = Math.max(1.5, Math.min(3, dims.w * 0.004));
  const FONT_XSM = Math.max(8, Math.min(12, dims.w * 0.018));
  const FONT_SM = Math.max(10, Math.min(14, dims.w * 0.023));
  const POINT_R = Math.max(6, Math.min(12, dims.w * 0.02));
  const LABEL_H = Math.max(14, Math.min(20, dims.w * 0.03));
  const LABEL_W = Math.max(80, Math.min(160, dims.w * 0.23));

  // Insets para acercar los end-captions al centro
  const CAPTION_INSET_X = Math.max(36, dims.w * 0.12);
  const CAPTION_INSET_Y = Math.max(70, dims.h * 0.12);

  const toSvgX = (value: number) => ((value + 10) / 20) * (dims.w - 2 * PAD) + PAD;
  const toSvgY = (value: number) => ((10 - value) / 20) * (dims.h - 2 * PAD) + PAD;
  const maxNameChars = Math.max(5, Math.floor((LABEL_W - 20) / (FONT_SM * 0.6)));
  const truncate = (s: string) => s.length <= maxNameChars ? s : `${s.slice(0, maxNameChars - 1)}…`;

  const generateColor = (index: number, total: number, explicit?: string) => {
    if (explicit) return explicit;
    const hue = (index * 360) / Math.max(1, total);
    return `hsl(${Math.round(hue)} 70% 55%)`;
  };

  const pointsForCollision = useMemo(() => displayCandidates.map(c => ({
    id: c.id,
    x: toSvgX(c[xAxisKey]),
    y: toSvgY(c[yAxisKey]),
    labelWidth: LABEL_W,
    labelHeight: LABEL_H,
  })), [displayCandidates, xAxisKey, yAxisKey, dims.w, LABEL_W, LABEL_H]);

  // useLabelCollision(points, iterations = 100, pointRadius = 10)
  const labelPositions = useLabelCollision(pointsForCollision, 200, POINT_R);

  // Avoid clashes with axis text/lines: define keep-out bands and nudge labels out
  const labelPositionsAdjusted = useMemo(() => {
    const bandY = Math.max(16, FONT_SM + 10); // half-height of the horizontal keepout
    const bandX = Math.max(16, FONT_SM + 10); // half-width of the vertical keepout

    const keepouts = [
      // Horizontal band centered on X-axis (protects the axis line and captions above it)
      { x: 0, y: dims.h / 2 - bandY, width: dims.w, height: bandY * 2 },
      // Vertical band centered on Y-axis
      { x: dims.w / 2 - bandX, y: 0, width: bandX * 2, height: dims.h },
    ];

    const margin = 2;

    function rectsOverlap(a: {x:number;y:number;width:number;height:number}, b:{x:number;y:number;width:number;height:number}) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    return labelPositions.map(lp => {
      let finalX = lp.finalX;
      let finalY = lp.finalY;

      const r = () => ({ x: finalX, y: finalY, width: LABEL_W, height: LABEL_H });

      // Nudge vertically out of the horizontal keepout (X-axis)
      const xAxisBand = keepouts[0];
      if (rectsOverlap(r(), xAxisBand)) {
        if (lp.y < dims.h / 2) {
          // point is above the axis -> push label further up
          finalY = xAxisBand.y - LABEL_H - margin;
        } else {
          // point is below the axis -> push label further down
          finalY = xAxisBand.y + xAxisBand.height + margin;
        }
      }

      // Nudge horizontally out of the vertical keepout (Y-axis)
      const yAxisBand = keepouts[1];
      if (rectsOverlap(r(), yAxisBand)) {
        if (lp.x < dims.w / 2) {
          // point is to the left -> push label further left
          finalX = yAxisBand.x - LABEL_W - margin;
        } else {
          // point is to the right -> push label further right
          finalX = yAxisBand.x + yAxisBand.width + margin;
        }
      }

      // Keep labels inside the chart bounds
      finalX = Math.max(PAD, Math.min(dims.w - PAD - LABEL_W, finalX));
      finalY = Math.max(PAD, Math.min(dims.h - PAD - LABEL_H, finalY));

      return { ...lp, finalX, finalY };
    });
  }, [labelPositions, LABEL_W, LABEL_H, dims.w, dims.h, PAD, FONT_SM]);

  // --- MANEJADORES DE EVENTOS ---
  
  const handleMouseEnter = (candidateId: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveCandidate(candidateId);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = window.setTimeout(() => {
      setActiveCandidate(null);
    }, 100);
  };

  const handleCandidateClick = (candidateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveCandidate(candidateId);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };
  
  const handleProfileClick = (candidateId: string) => {
    navigate(`/candidate/${candidateId}#creencias-clave`);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX + 15, y: event.clientY + 15 });
  };
  
  const showTooltip = !!activeCandidate;
  const candidateData = displayCandidates.find(c => c.id === activeCandidate);
  const xCaps = axisEndCaptions[xAxisKey];
  const yCaps = axisEndCaptions[yAxisKey];

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <>
      <Card className="fighting-game-card">
        <CardContent>
          {/* Contenedor del Gráfico (añadimos padding vertical para separar del contenedor) */}
          <div
            ref={containerRef}
            className="w-full flex justify-center max-h-[80vh] relative py-4"
          >
            <svg
              role="img"
              aria-label={`Mapa ideológico con eje X (${xAxisKey}) y eje Y (${yAxisKey})`}
              width={dims.w}
              height={dims.h}
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              className="max-w-full max-h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect width={dims.w} height={dims.h} fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth={2}/>

              {/* Arrowheads for the axes */}
              <defs>
                <marker id="axis-arrow" viewBox="0 0 10 10" refX="8" refY="5"
                        markerWidth={Math.max(4, AXIS_STROKE * 3)}
                        markerHeight={Math.max(4, AXIS_STROKE * 3)}
                        orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--accent))" />
                </marker>
              </defs>

              {/* Ejes con flechas en ambos extremos */}
              <line x1={PAD} y1={dims.h / 2} x2={dims.w - PAD} y2={dims.h / 2}
                    stroke="hsl(var(--accent))" strokeWidth={AXIS_STROKE}
                    markerStart="url(#axis-arrow)" markerEnd="url(#axis-arrow)"/>
              <line x1={dims.w / 2} y1={PAD} x2={dims.w / 2} y2={dims.h - PAD}
                    stroke="hsl(var(--accent))" strokeWidth={AXIS_STROKE}
                    markerStart="url(#axis-arrow)" markerEnd="url(#axis-arrow)"/>

              {/* End-captions along the axes (responsive) */}
              <g fontFamily="'Inter', sans-serif" fontSize={FONT_SM} fill="hsl(var(--foreground))" opacity="0.9">
                {/* X axis: labels near ends, slightly above the line */}
                <text x={PAD + CAPTION_INSET_X} y={dims.h / 2 - 6} textAnchor="start">
                  ← {xCaps.low}
                </text>
                <text x={dims.w - PAD - CAPTION_INSET_X} y={dims.h / 2 - 6} textAnchor="end">
                  {xCaps.high} →
                </text>

                {/* Y axis: rotate labels to align with the vertical axis */}
                {(() => {
                  // acercar top/bottom hacia el centro
                  const capY = CAPTION_INSET_Y;
                  const topY = PAD + capY;
                  const bottomY = dims.h - PAD - capY;
                  const xOff = 10; //// slight offset from the axis so text doesn't sit on the stroke
                  return (
                    <>
                      <text
                        x={dims.w / 2 - xOff}
                        y={topY}
                        textAnchor="middle"
                        transform={`rotate(-90 ${dims.w / 2 - xOff} ${topY})`}
                      >
                        {yCaps.high} →
                      </text>
                      <text
                        x={dims.w / 2 - xOff}
                        y={bottomY}
                        textAnchor="middle"
                        transform={`rotate(-90 ${dims.w / 2 - xOff} ${bottomY})`}
                      >
                        ← {yCaps.low}
                      </text>
                    </>
                  );
                })()}
              </g>
              {labelPositionsAdjusted.map((labelPos, index) => {
                const candidate = displayCandidates.find(c => c.id === labelPos.id);
                if (!candidate) return null;

                const isActive = activeCandidate === candidate.id;
                const color = generateColor(index, displayCandidates.length, candidate.color);
                
                return (
                  <g
                    key={candidate.id}
                    tabIndex={0}
                    onClick={(e) => handleCandidateClick(candidate.id, e)}
                    onMouseEnter={() => handleMouseEnter(candidate.id)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: 'pointer' }}
                    className={`transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <title>{candidate.nombre} - Click para más info</title>

                    <circle cx={labelPos.x} cy={labelPos.y} r={POINT_R + (isActive ? 2 : 0)} fill={color} stroke="hsl(var(--background))" strokeWidth={AXIS_STROKE} />

                    <LeaderLine from={{ x: labelPos.x, y: labelPos.y }} to={labelPos} />

                    <g transform={`translate(${labelPos.finalX}, ${labelPos.finalY})`}>
                      <rect width={LABEL_W} height={LABEL_H} fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth={isActive ? 2 : 1} rx={4} />
                      <text x={LABEL_W/2} y={LABEL_H/2} dominantBaseline="middle" textAnchor="middle" fontSize={FONT_SM} fill="hsl(var(--foreground))" fontFamily="'Inter', sans-serif" fontWeight={isActive ? 'bold' : 'normal'}>
                        {truncate(candidate.nombre)}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {showTooltip && candidateData && (
        <div
          className="z-50 bg-background border-2 border-foreground rounded-lg shadow-lg p-4 w-48 flex flex-col gap-2"
          style={{
            position: 'fixed',
            left: 0, top: 0,
            transform: `translate(${tooltipPosition.x}px, ${tooltipPosition.y}px)`,
            pointerEvents: 'auto',
            opacity: showTooltip ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={() => handleMouseEnter(candidateData.id)}
          onMouseLeave={handleMouseLeave}
        >
          <h3 className="font-bold text-sm border-b pb-1">{candidateData.nombre}</h3>
          <div className="space-y-1 text-xs">
            <div>
              <span className="font-medium">{axisLabels[xAxisKey].name}:</span>{' '}
              <span className="text-muted-foreground">{candidateData[xAxisKey].toFixed(1)}</span>
            </div>
            <div>
              <span className="font-medium">{axisLabels[yAxisKey].name}:</span>{' '}
              <span className="text-muted-foreground">{candidateData[yAxisKey].toFixed(1)}</span>
            </div>
          </div>
          
          <Button 
            variant="accent" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => handleProfileClick(candidateData.id)}
          >
            Ver Perfil
          </Button>
        </div>
      )}
    </>
  );
}