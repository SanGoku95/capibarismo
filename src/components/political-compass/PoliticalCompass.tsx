import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidates } from '@/data/candidates';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CompassProps {
  width?: number;
  height?: number;
  selectedCandidateIds?: string[];
}

type Candidate = {
  id: string;
  nombre: string;
  econ: number;
  social: number;
  color?: string;
  education?: string;
  security?: string;
  health?: string;
};

export function PoliticalCompass({
  width = 600,
  height = 600,
  selectedCandidateIds,
}: CompassProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCandidate, setHoveredCandidate] = useState<string | null>(null);
  const [clickedCandidate, setClickedCandidate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Canvas dimensions, responsive to container size
  const [dims, setDims] = useState({ w: width, h: height });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const availableHeight = window.innerHeight - 160;
      const maxSize = Math.min(containerWidth, availableHeight);
      const size = Math.max(280, Math.min(900, maxSize));
      setDims({ w: size, h: size });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Filter candidates (and sanitize econ/social fields)
  const displayCandidates = useMemo(() => {
    const base = candidates as Candidate[];
    const filtered =
      selectedCandidateIds && selectedCandidateIds.length > 0
        ? base.filter((c) => selectedCandidateIds.includes(c.id))
        : base;
    return filtered.filter(
      (c) =>
        typeof c.econ === 'number' &&
        typeof c.social === 'number' &&
        !Number.isNaN(c.econ) &&
        !Number.isNaN(c.social)
    );
  }, [selectedCandidateIds]);

  // Responsive sizing constants
  const PAD = Math.max(30, Math.min(80, dims.w * 0.1));
  const AXIS_STROKE = Math.max(1.5, Math.min(3, dims.w * 0.004));
  const FONT_XSM = Math.max(8, Math.min(12, dims.w * 0.018));
  const FONT_SM = Math.max(10, Math.min(14, dims.w * 0.023));
  const POINT_R = Math.max(6, Math.min(12, dims.w * 0.02));
  const LABEL_H = Math.max(14, Math.min(20, dims.w * 0.03));
  const LABEL_W = Math.max(80, Math.min(160, dims.w * 0.23));

  // Convert ideological coordinates (-10..10) to SVG coordinates
  const toSvgX = (econ: number) =>
    ((econ + 10) / 20) * (dims.w - 2 * PAD) + PAD;
  const toSvgY = (soc: number) =>
    ((10 - soc) / 20) * (dims.h - 2 * PAD) + PAD;

  // Dynamic character limit for candidate names
  const maxNameChars = Math.max(
    5,
    Math.floor((LABEL_W - 20) / (FONT_SM * 0.6))
  );
  const truncate = (s: string) =>
    s.length <= maxNameChars ? s : `${s.slice(0, maxNameChars - 1)}…`;

  // Colour generator with explicit fallback
  const generateColor = (index: number, total: number, explicit?: string) => {
    if (explicit) return explicit;
    const hue = (index * 360) / Math.max(1, total);
    return `hsl(${Math.round(hue)} 70% 55%)`;
  };

  const handleCandidateClick = (candidateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (clickedCandidate === candidateId) {
      // Second click - navigate to profile
      navigate(`/candidate/${candidateId}#creencias-clave`);
    } else {
      // First click - show policy summary
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      });
      setClickedCandidate(candidateId);
    }
  };

  const handleMouseEnter = (candidateId: string, event: React.MouseEvent) => {
    if (!clickedCandidate) {
      setHoveredCandidate(candidateId);
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandidate(null);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setClickedCandidate(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const formatPolicyValue = (value: string | undefined): string => {
    if (!value) return 'No definida';
    switch (value.toLowerCase()) {
      case 'pro':
        return '✅ A favor';
      case 'anti':
        return '❌ En contra';
      case 'neutral':
        return '⚖️ Neutral';
      default:
        return value;
    }
  };

  const activeCandidate = clickedCandidate || hoveredCandidate;
  const showTooltip = activeCandidate && (hoveredCandidate || clickedCandidate);
  const candidateData = displayCandidates.find(c => c.id === activeCandidate);

  return (
    <Card className="fighting-game-card">
      <CardHeader></CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="w-full flex justify-center max-h-[80vh] relative"
        >
          <svg
            role="img"
            aria-label="Brújula política con ejes económico y social"
            width={dims.w}
            height={dims.h}
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            className="max-w-full max-h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background */}
            <rect
              width={dims.w}
              height={dims.h}
              fill="hsl(var(--background))"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
            />

            {/* Axes */}
            <line
              x1={PAD}
              y1={dims.h / 2}
              x2={dims.w - PAD}
              y2={dims.h / 2}
              stroke="hsl(var(--accent))"
              strokeWidth={AXIS_STROKE}
            />
            <line
              x1={dims.w / 2}
              y1={PAD}
              x2={dims.w / 2}
              y2={dims.h - PAD}
              stroke="hsl(var(--accent))"
              strokeWidth={AXIS_STROKE}
            />

            {/* Axis labels */}
            <text
              x={dims.w - PAD}
              y={dims.h / 2 - 4}
              textAnchor="end"
              fontFamily="'Press Start 2P', cursive"
              fontWeight="bold"
              fontSize={FONT_XSM}
              fill="hsl(var(--accent))"
              stroke="hsl(var(--background))"
              strokeWidth={1}
              style={{ paintOrder: 'stroke fill' }}
            >
              EJE ECONÓMICO
            </text>
            <text
              x={dims.w / 2 - PAD - 18}
              y={PAD - 10}
              textAnchor="middle"
              fontFamily="'Press Start 2P', cursive"
              fontWeight="bold"
              fontSize={FONT_XSM}
              fill="hsl(var(--accent))"
              stroke="hsl(var(--background))"
              strokeWidth={1}
              transform={`rotate(-90 ${dims.w / 2} ${PAD - 8})`}
              style={{ paintOrder: 'stroke fill' }}
            >
              EJE SOCIAL
            </text>

            {/* Quadrant labels */}
            <text
              x={PAD + 3}
              y={PAD + FONT_XSM - 30}
              fontSize={FONT_XSM}
              fill="hsl(var(--foreground))"
              opacity={0.7}
            >
              IZQUIERDA-AUTORITARIO
            </text>
            <text
              x={dims.w - PAD - 3}
              y={PAD + FONT_XSM - 30}
              fontSize={FONT_XSM}
              fill="hsl(var(--foreground))"
              textAnchor="end"
              opacity={0.7}
            >
              DERECHA-AUTORITARIO
            </text>
            <text
              x={PAD + 3}
              y={dims.h - PAD + 20}
              fontSize={FONT_XSM}
              fill="hsl(var(--foreground))"
              opacity={0.7}
            >
              IZQUIERDA-LIBERTARIO
            </text>
            <text
              x={dims.w - PAD - 3}
              y={dims.h - PAD + 20}
              fontSize={FONT_XSM}
              fill="hsl(var(--foreground))"
              textAnchor="end"
              opacity={0.7}
            >
              DERECHA-LIBERTARIO
            </text>

            {/* Candidate points and labels */}
            {displayCandidates.map((candidate, index) => {
              const x = toSvgX(candidate.econ);
              const y = toSvgY(candidate.social);
              const color = generateColor(
                index,
                displayCandidates.length,
                candidate.color
              );
              const labelY = y - POINT_R - LABEL_H - 4;
              const isActive = activeCandidate === candidate.id;
              
              return (
                <g
                  key={candidate.id}
                  tabIndex={0}
                  onClick={(e) => handleCandidateClick(candidate.id, e)}
                  onMouseEnter={(e) => handleMouseEnter(candidate.id, e)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: 'pointer' }}
                  className={`hover:opacity-80 transition-opacity ${isActive ? 'opacity-100' : ''}`}
                >
                  <title>
                    {candidate.nombre} - Hover para políticas, click para más info
                  </title>
                  {/* Halo for contrast */}
                  <circle
                    cx={x}
                    cy={y}
                    r={POINT_R + (isActive ? 4 : 2)}
                    fill="hsl(var(--background))"
                    stroke={isActive ? color : 'transparent'}
                    strokeWidth={isActive ? 2 : 0}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={POINT_R}
                    fill={color}
                    stroke="hsl(var(--foreground))"
                    strokeWidth={isActive ? 3 : 2}
                  />
                  {/* Label background */}
                  <rect
                    x={x - LABEL_W / 2}
                    y={labelY}
                    width={LABEL_W}
                    height={LABEL_H}
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={isActive ? 2 : 1}
                    rx={4}
                    ry={4}
                  />
                  {/* Candidate name */}
                  <text
                    x={x}
                    y={labelY + LABEL_H - 5}
                    textAnchor="middle"
                    fontSize={Math.min(14, FONT_SM)}
                    fill="hsl(var(--foreground))"
                    fontFamily="'Inter', sans-serif"
                    fontWeight={isActive ? 700 : 600}
                  >
                    {truncate(candidate.nombre)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Policy Summary Tooltip */}
          {showTooltip && candidateData && (
            <div
              className="absolute z-50 bg-background border-2 border-foreground rounded-lg shadow-lg p-4 max-w-xs"
              style={{
                left: Math.min(tooltipPosition.x - 150, window.innerWidth - 320),
                top: Math.max(tooltipPosition.y - 100, 10),
                pointerEvents: 'none'
              }}
            >
              <div className="space-y-2">
                <h3 className="font-bold text-sm border-b pb-1">
                  {candidateData.nombre}
                </h3>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="font-medium">Educación:</span>{' '}
                    <span className="text-muted-foreground">
                      {formatPolicyValue(candidateData.education)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Seguridad:</span>{' '}
                    <span className="text-muted-foreground">
                      {formatPolicyValue(candidateData.security)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Salud:</span>{' '}
                    <span className="text-muted-foreground">
                      {formatPolicyValue(candidateData.health)}
                    </span>
                  </div>
                </div>
                {clickedCandidate && (
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                    Click nuevamente para ver perfil completo
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {displayCandidates.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-4 w-4 rounded-full"
                style={{
                  background: generateColor(
                    i,
                    displayCandidates.length,
                    c.color
                  ),
                  border: '2px solid hsl(var(--foreground))',
                }}
              />
              <span className="text-sm font-medium">{c.nombre}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
