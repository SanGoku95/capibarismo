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
};

export function PoliticalCompass({
  width = 600,
  height = 600,
  selectedCandidateIds,
}: CompassProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas dimensions, responsive to container size
  const [dims, setDims] = useState({ w: width, h: height });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const availableHeight = window.innerHeight - 160; // reserve space for header/footer
      const maxSize = Math.min(containerWidth, availableHeight);
      // clamp for readability
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

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/candidate/${candidateId}#creencias-clave`);
  };

  return (
    <Card className="fighting-game-card">
      <CardHeader></CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="w-full flex justify-center max-h-[80vh]"
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
              ESCALA ECONÓMICA
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
              ESCALA SOCIAL
            </text>

            {/* Quadrant labels */}
            <text
              x={PAD + 6}
              y={PAD + FONT_SM + 2}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
            >
              IZQUIERDA-AUTORITARIO
            </text>
            <text
              x={dims.w - PAD - 6}
              y={PAD + FONT_SM + 2}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
              textAnchor="end"
            >
              DERECHA-AUTORITARIO
            </text>
            <text
              x={PAD + 6}
              y={dims.h - PAD - 6}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
            >
              IZQUIERDA-LIBERTARIO
            </text>
            <text
              x={dims.w - PAD - 6}
              y={dims.h - PAD - 6}
              fontSize={FONT_SM}
              fill="hsl(var(--foreground))"
              textAnchor="end"
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
              return (
                <g
                  key={candidate.id}
                  tabIndex={0}
                  onClick={() => handleCandidateClick(candidate.id)}
                  style={{ cursor: 'pointer' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <title>
                    {candidate.nombre} ({candidate.econ.toFixed(1)},{' '}
                    {candidate.social.toFixed(1)}) - Click para ver perfil
                  </title>
                  {/* Halo for contrast */}
                  <circle
                    cx={x}
                    cy={y}
                    r={POINT_R + 2}
                    fill="hsl(var(--background))"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={POINT_R}
                    fill={color}
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                  />
                  {/* Label background */}
                  <rect
                    x={x - LABEL_W / 2}
                    y={labelY}
                    width={LABEL_W}
                    height={LABEL_H}
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--foreground))"
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
                    fontWeight={600}
                  >
                    {truncate(candidate.nombre)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* Legend */}
        <div
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
        >
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
