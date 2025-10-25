// src/hooks/useLabelCollision.ts
import { useState, useEffect, useMemo } from 'react';

interface Point {
  id: string;
  x: number;
  y: number;
  labelWidth: number;
  labelHeight: number;
}

export interface LabelPosition extends Point {
  finalX: number;
  finalY: number;
}

export function useLabelCollision(points: Point[], iterations = 100, pointRadius = 10) {
  const [labelPositions, setLabelPositions] = useState<LabelPosition[]>([]);

  const initialPositions = useMemo(() => 
    points.map(p => ({ 
      ...p, 
      finalX: p.x - p.labelWidth / 2,
      finalY: p.y - p.labelHeight - pointRadius - 5,
    })),
    [points, pointRadius]
  );

  useEffect(() => {
    const positions = JSON.parse(JSON.stringify(initialPositions)) as LabelPosition[];

    for (let i = 0; i < iterations; i++) {
      let wasMoved = false;
      for (let j = 0; j < positions.length; j++) {
        for (let k = j + 1; k < positions.length; k++) {
          const p1 = positions[j];
          const p2 = positions[k];

          const r1 = { x: p1.finalX, y: p1.finalY, width: p1.labelWidth, height: p1.labelHeight };
          const r2 = { x: p2.finalX, y: p2.finalY, width: p2.labelWidth, height: p2.labelHeight };

          const overlapX = (r1.x < r2.x + r2.width && r1.x + r1.width > r2.x);
          const overlapY = (r1.y < r2.y + r2.height && r1.y + r1.height > r2.y);

          if (overlapX && overlapY) {
            wasMoved = true;
            // Calcula la distancia vertical que se superponen
            const overlapAmount = Math.min(r1.y + r1.height - r2.y, r2.y + r2.height - r1.y);
            
            // Empuja una etiqueta hacia arriba y la otra hacia abajo por la mitad de la superposición
            const adjustment = overlapAmount / 2 + 1; // +1 para un pequeño espacio
            
            // Alterna: la que esté más arriba se empuja más arriba, la otra más abajo
            if (p1.finalY < p2.finalY) {
              p1.finalY -= adjustment;
              p2.finalY += adjustment;
            } else {
              p1.finalY += adjustment;
              p2.finalY -= adjustment;
            }
          }
        }
      }
      if (!wasMoved) break;
    }
    setLabelPositions(positions);
  }, [initialPositions, iterations]);

  return labelPositions;
}