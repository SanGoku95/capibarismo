import { useState } from 'react';
import { PoliticalCompass, Axis, axisLabels } from '@/components/political-compass/PoliticalCompass';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';

const availableAxes: { key: Axis; label: string }[] = [
  { key: 'econ', label: 'Eje Económico' },
  { key: 'social', label: 'Eje Social' },
  { key: 'territorial', label: 'Eje Territorial' },
  { key: 'power', label: 'Estilo de Poder' },
];

function AxisControls({
  xAxis,
  yAxis,
  onXChange,
  onYChange,
}: {
  xAxis: Axis;
  yAxis: Axis;
  onXChange: (v: Axis) => void;
  onYChange: (v: Axis) => void;
}) {
  const renderInfo = (axisKey: Axis) => {
    const meta = axisLabels[axisKey];
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Información sobre ${meta.name}`}
            className="inline-flex items-center justify-center h-7 w-7 rounded-md border hover:bg-accent/10 text-foreground/80"
          >
            <Info className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-56 text-xs">
          <div className="space-y-2">
            <div className="font-display text-accent text-sm">{meta.name}</div>
            <div className="space-y-1">
              <div>
                <span className="font-semibold">{meta.low}:</span>{' '}
                {meta.name === 'EJE ECONÓMICO'
                  ? 'Mayor intervención estatal, regulación.'
                  : meta.name === 'EJE SOCIAL'
                  ? 'Máximas libertades individuales.'
                  : meta.name === 'EJE TERRITORIAL'
                  ? 'Mayor poder a las regiones.'
                  : 'Respeta las reglas del sistema.'}
              </div>
              <div>
                <span className="font-semibold">{meta.high}:</span>{' '}
                {meta.name === 'EJE ECONÓMICO'
                  ? 'Libre mercado, menor intervención.'
                  : meta.name === 'EJE SOCIAL'
                  ? 'Mayor control social, orden.'
                  : meta.name === 'EJE TERRITORIAL'
                  ? 'Poder concentrado en Lima.'
                  : 'Desafía a las instituciones.'}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch mb-3 p-2 rounded-md border border-accent/40 max-w-lg mx-auto">
      <div className="w-full sm:w-1/2 flex flex-col gap-1">
        <div className="text-[12px] font-display text-accent px-1 leading-none">Eje Horizontal</div>
        <div className="flex items-center gap-2">
          <label htmlFor="x-axis-select" className="sr-only">
            Eje Horizontal
          </label>
          <Select value={xAxis} onValueChange={(v) => onXChange(v as Axis)}>
            <SelectTrigger id="x-axis-select" className="h-8 px-2 text-xs">
              <SelectValue placeholder="Eje Horizontal" />
            </SelectTrigger>
            <SelectContent className="text-xs py-1">
              {availableAxes.map((axis) => (
                <SelectItem key={axis.key} value={axis.key} disabled={axis.key === yAxis} className="text-xs py-1.5">
                  {axis.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderInfo(xAxis)}
        </div>
      </div>

      <div className="w-full sm:w-1/2 flex flex-col gap-1">
        <div className="text-[12px] font-display text-accent px-1 leading-none">Eje Vertical</div>
        <div className="flex items-center gap-2">
          <label htmlFor="y-axis-select" className="sr-only">
            Eje Vertical
          </label>
          <Select value={yAxis} onValueChange={(v) => onYChange(v as Axis)}>
            <SelectTrigger id="y-axis-select" className="h-8 px-2 text-xs">
              <SelectValue placeholder="Eje Vertical" />
            </SelectTrigger>
            <SelectContent className="text-xs py-1">
              {availableAxes.map((axis) => (
                <SelectItem key={axis.key} value={axis.key} disabled={axis.key === xAxis} className="text-xs py-1.5">
                  {axis.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderInfo(yAxis)}
        </div>
      </div>
    </div>
  );
}

export function PoliticalCompassPage() {
  const [xAxis, setXAxis] = useState<Axis>('econ');
  const [yAxis, setYAxis] = useState<Axis>('social');

  return (
    <div className="min-h-screen fighting-game-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-display text-accent mb-2">Mapa Ideológico</h1>
          <p className="text-sm md:text-base text-foreground/90 max-w-3xl mx-auto">
            Crea tu propio cuadrilátero. Cambia los ejes para cruzar posturas y descubrir nuevas perspectivas.
          </p>
        </div>

        {/* Axis Selection Controls */}
        <AxisControls xAxis={xAxis} yAxis={yAxis} onXChange={setXAxis} onYChange={setYAxis} />

        {/* Main Compass */}
        <div className="max-w-6xl mx-auto mb-8">
          <PoliticalCompass width={700} height={700} xAxisKey={xAxis} yAxisKey={yAxis} />
        </div>
      </div>
    </div>
  );
}

export default PoliticalCompassPage;