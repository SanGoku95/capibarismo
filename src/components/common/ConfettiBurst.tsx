import { useEffect, useMemo, useState } from "react";

interface ConfettiBurstProps {
  trigger: number;
}

const COLORS = ["#ff385c", "#ffb800", "#1eb980", "#2b6fff", "#b5179e"];

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [trigger]);

  const pieces = useMemo(() => {
    const jitter = (trigger % COLORS.length) * 1.5;
    return Array.from({ length: 36 }).map((_, index) => {
      const angle = Math.random() * 360;
      const distance = 120 + Math.random() * 80 + jitter;
      const duration = 1200 + Math.random() * 600;
      const size = 6 + Math.random() * 6;
      const color = COLORS[index % COLORS.length];
      return { angle, distance, duration, size, color, id: index };
    });
  }, [trigger]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: piece.size,
            height: piece.size * 3,
            backgroundColor: piece.color,
            transformOrigin: "center bottom",
            transform: `rotate(${piece.angle}deg) translateY(-${piece.distance}px)`,
            borderRadius: "2px",
            opacity: 0,
            animation: `confetti-fall ${piece.duration}ms ease-out forwards`,
            animationDelay: `${Math.random() * 200}ms`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(160px) scale(1); }
        }
      `}</style>
    </div>
  );
}

