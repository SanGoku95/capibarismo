import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidates } from '@/data/candidates';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

const axisLabels: Record<Axis, { name: string; low: string; high: string }> = {
  econ: { name: 'EJE ECONÓMICO', low: 'IZQUIERDA', high: 'DERECHA' },
  social: { name: 'EJE SOCIAL', low: 'LIBERTARIO', high: 'AUTORITARIO' },
  territorial: { name: 'EJE TERRITORIAL', low: 'REGIONALISTA', high: 'CENTRALISTA' },
  power: { name: 'ESTILO DE PODER', low: 'INSTITUCIONALISTA', high: 'POPULISTA' },
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
      const availableHeight = window.innerHeight - 250; 
      const maxSize = Math.min(containerWidth, availableHeight);
      const size = Math.max(280, Math.min(900, maxSize));
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

  const labelPositions = useLabelCollision(pointsForCollision, 200, 1, POINT_R);

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
  
  const xLow = axisLabels[xAxisKey].low;
  const xHigh = axisLabels[xAxisKey].high;
  const yLow = axisLabels[yAxisKey].low;
  const yHigh = axisLabels[yAxisKey].high;
  
  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <>
      <Card className="fighting-game-card">
        <CardHeader></CardHeader>
        <CardContent>
          {/* Leyenda */}
          <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
            {displayCandidates.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full"
                  style={{
                    background: generateColor(i, displayCandidates.length, c.color),
                    border: '2px solid hsl(var(--foreground))',
                  }}
                />
                <span className="text-sm font-medium">{c.nombre}</span>
              </div>
            ))}
          </div>

          {/* Contenedor del Gráfico */}
          <div ref={containerRef} className="w-full flex justify-center max-h-[80vh] relative">
            <svg
              role="img"
              aria-label={`Mapa ideológico con eje X (${axisLabels[xAxisKey].name}) y eje Y (${axisLabels[yAxisKey].name})`}
              width={dims.w}
              height={dims.h}
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              className="max-w-full max-h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect width={dims.w} height={dims.h} fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth={2}/>

              <line x1={PAD} y1={dims.h / 2} x2={dims.w - PAD} y2={dims.h / 2} stroke="hsl(var(--accent))" strokeWidth={AXIS_STROKE}/>
              <line x1={dims.w / 2} y1={PAD} x2={dims.w / 2} y2={dims.h - PAD} stroke="hsl(var(--accent))" strokeWidth={AXIS_STROKE}/>
              <text x={dims.w - PAD} y={dims.h / 2 - 4} textAnchor="end" fontFamily="'Press Start 2P', cursive" fontWeight="bold" fontSize={FONT_XSM} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={1} style={{ paintOrder: 'stroke fill' }}>{axisLabels[xAxisKey].name}</text>
              <text x={dims.w / 2 - PAD - 18} y={PAD - 10} textAnchor="middle" fontFamily="'Press Start 2P', cursive" fontWeight="bold" fontSize={FONT_XSM} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={1} transform={`rotate(-90 ${dims.w / 2} ${PAD - 8})`} style={{ paintOrder: 'stroke fill' }}>{axisLabels[yAxisKey].name}</text>
              
              <g className="quadrant-labels" opacity="0.7" fontFamily="'Press Start 2P', cursive" fontSize={FONT_XSM} fill="hsl(var(--foreground))" style={{ pointerEvents: 'none' }}>
                <text x={PAD + 3} y={PAD - 8}>{xLow}-{yHigh}</text>
                <text x={dims.w - PAD - 3} y={PAD - 8} textAnchor="end">{xHigh}-{yHigh}</text>
                <text x={PAD + 3} y={dims.h - PAD + 20}>{xLow}-{yLow}</text>
                <text x={dims.w - PAD - 3} y={dims.h - PAD + 20} textAnchor="end">{xHigh}-{yLow}</text>
              </g>

              {labelPositions.map((labelPos, index) => {
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