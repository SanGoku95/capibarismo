import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidates } from '@/data/candidates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompassProps {
  /** Optional starting size; component will auto-resize to container */
  width?: number;
  height?: number;
  selectedCandidateIds?: string[];
}

type Candidate = {
  id: string;
  nombre: string;       // using your Spanish field names
  econ: number;         // -10..+10
  social: number;       // -10..+10
  color?: string;       // optional brand color
};

export function PoliticalCompass({
  width = 600,
  height = 600,
  selectedCandidateIds,
}: CompassProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive square canvas: auto-fits parent width with sane clamps
  const [dims, setDims] = useState({ w: width, h: height });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const size = Math.max(320, Math.min(900, w)); // clamp for mobile/desktop
      setDims({ w: size, h: size });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const displayCandidates: Candidate[] = useMemo(() => {
    const base = candidates as Candidate[];
    const filtered = selectedCandidateIds && selectedCandidateIds.length > 0
      ? base.filter((c) => selectedCandidateIds.includes(c.id))
      : base;
    
    // Filter out candidates without valid coordinates
    return filtered.filter((c) => 
      typeof c.econ === 'number' && 
      typeof c.social === 'number' && 
      !isNaN(c.econ) && 
      !isNaN(c.social)
    );
  }, [selectedCandidateIds]);

  // Generate consistent fallback colors
  const generateColor = (index: number, total: number, explicit?: string) => {
    if (explicit) return explicit;
    const hue = (index * 360) / Math.max(1, total);
    return `hsl(${Math.round(hue)} 70% 55%)`;
  };

  // Dynamic paddings and sizes for readability across viewports
  const PAD = Math.max(48, Math.min(100, Math.floor(dims.w * 0.12)));
  const AXIS_STROKE = Math.max(2, Math.min(4, Math.floor(dims.w * 0.006)));
  const FONT_XSM = Math.max(8, Math.min(10, Math.floor(dims.w * 0.022)));
  const FONT_SM = Math.max(10, Math.min(12, Math.floor(dims.w * 0.022)));
  const POINT_R = Math.max(9, Math.min(14, Math.floor(dims.w * 0.022)));
  const LABEL_H = Math.max(14, Math.min(18, Math.floor(dims.w * 0.03)));
  const LABEL_W = Math.max(60, Math.min(110, Math.floor(dims.w * 0.19)));

  // Mapping (-10..+10) -> SVG coords inside padded square
  const toSvgX = (econ: number) =>
    ((econ + 10) / 20) * (dims.w - 2 * PAD) + PAD;
  const toSvgY = (soc: number) =>
    ((10 - soc) / 20) * (dims.h - 2 * PAD) + PAD;


  const truncate = (s: string, max: number) =>
    s.length <= max ? s : s.slice(0, Math.max(0, max - 1)) + '…';

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/candidate/${candidateId}#creencias-clave`);
  };

  return (
    <Card className="fighting-game-card">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full">
          <svg
            role="img"
            aria-label="Brújula política con ejes económico y social"
            width={dims.w}
            height={dims.h}
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            className="mx-auto block h-auto w-full bg-card"
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
            {/* X (Econ) */}
            <line
              x1={PAD}
              y1={dims.h / 2}
              x2={dims.w - PAD}
              y2={dims.h / 2}
              stroke="hsl(var(--accent))"
              strokeWidth={AXIS_STROKE}
            />
            {/* Y (Social) */}
            <line
              x1={dims.w / 2}
              y1={PAD}
              x2={dims.w / 2}
              y2={dims.h - PAD}
              stroke="hsl(var(--accent))"
              strokeWidth={AXIS_STROKE}
            />
            {/* Axis titles ON the lines, with outline for contrast */}
            {/* ESCALA ECONÓMICA on X-axis */}
            <text
              x={dims.w - PAD - 20}
              y={dims.h / 2 - 2}
              textAnchor="end"
              fontFamily="'Press Start 2P', cursive"
              fontWeight="bold"
              fontSize={FONT_XSM}
              fill="hsl(var(--accent))"
              stroke="hsl(var(--background))"
              strokeWidth={1}
              style={{ paintOrder: 'stroke fill' }}
            >
              ESCALA ECONÓMICA
            </text>

            {/* ESCALA SOCIAL on Y-axis (rotated) */}
             <text
              x={dims.w / - 10}
              y={PAD + 30}
              transform={`rotate(-90 ${dims.w / 2 + 15} ${PAD + 30})`}
              textAnchor="start"
              fontFamily="'Press Start 2P', cursive"
              fontWeight="bold"
              fontSize={FONT_XSM}
              fill="hsl(var(--accent))"
              stroke="hsl(var(--background))"
              strokeWidth={1}
              style={{ paintOrder: 'stroke fill' }}
            >
              ESCALA SOCIAL
            </text>

            {/* Quadrant labels for clarity (optional but helpful) */}
            <text
              x={PAD + 6}
              y={PAD + 16}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
            >
              IZQUIERDA-AUTORITARIO
            </text>
            <text
              x={dims.w - PAD - 6}
              y={PAD + 16}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
              textAnchor="end"
            >
              DERECHA-AUTORITARIO
            </text>
            <text
              x={PAD + 6}
              y={dims.h - PAD - 8}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
            >
              IZQUIERDA-LIBERTARIO
            </text>
            <text
              x={dims.w - PAD - 6}
              y={dims.h - PAD - 8}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
              textAnchor="end"
            >
              DERECHA-LIBERTARIO
            </text>

            {/* Candidate points */}
            {displayCandidates.map((candidate, index) => {
              const econValue = candidate.econ ?? 0;
              const socialValue = candidate.social ?? 0;
              
              const x = toSvgX(econValue);
              const y = toSvgY(socialValue);
              const color = generateColor(
                index,
                displayCandidates.length,
                candidate.color
              );
              const labelY = y - POINT_R - (LABEL_H + 6);
              const nameForLabel = truncate(candidate.nombre, 16);

              return (
                <g 
                  key={candidate.id} 
                  tabIndex={0}
                  onClick={() => handleCandidateClick(candidate.id)}
                  style={{ cursor: 'pointer' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <title>
                    {candidate.nombre} ({econValue.toFixed(1)},{' '}
                    {socialValue.toFixed(1)}) - Click para ver perfil
                  </title>

                  {/* halo for contrast */}
                  <circle cx={x} cy={y} r={POINT_R + 2} fill="hsl(var(--background))" />
                  <circle
                    cx={x}
                    cy={y}
                    r={POINT_R}
                    fill={color}
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    className="cursor-pointer hover:stroke-accent transition-colors"
                  />

                  {/* label with background */}
                  <rect
                    x={x - LABEL_W / 2}
                    y={labelY}
                    width={LABEL_W}
                    height={LABEL_H}
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--foreground))"
                    rx={3}
                    className="cursor-pointer hover:stroke-accent transition-colors"
                  />
                  <text
                    x={x}
                    y={labelY + LABEL_H - 4}
                    textAnchor="middle"
                    fontSize={Math.max(10, Math.min(12, Math.floor(dims.w * 0.022)))}
                    fill="hsl(var(--foreground))"
                    fontFamily="'Inter', sans-serif"
                    fontWeight={600}
                    className="cursor-pointer pointer-events-none"
                  >
                    {nameForLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
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
      </CardContent>
    </Card>
  );
}
