import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Candidate } from '@/data/candidates';

interface MiniTimelineChartProps {
  data: Candidate['timeline'];
  side: 'left' | 'right';
}

export function MiniTimelineChart({ data, side }: MiniTimelineChartProps) {
  const color = side === 'left' ? 'hsl(var(--team-left))' : 'hsl(var(--team-right))';
  
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="clips"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}