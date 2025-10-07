import { useState } from 'react';
import { PoliticalCompass, Axis, axisLabels } from '@/components/political-compass/PoliticalCompass';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info, ChevronDown, Check } from 'lucide-react';
import { candidates } from '@/data/candidates';

const availableAxes: { key: Axis; label: string }[] = [
  { key: 'econ', label: 'Eje Económico' },
  { key: 'social', label: 'Eje Social' },
  { key: 'territorial', label: 'Eje Territorial' },
  { key: 'power', label: 'Estilo de Poder' },
];

const candidateFilterOptions = candidates
  .map(({ id, nombre }) => ({ id, nombre }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre));

function AxisControls({
  xAxis,
  yAxis,
  onXChange,
  onYChange,
  selectedCandidateIds,
  onCandidatesChange,
  candidateOptions,
}: {
  xAxis: Axis;
  yAxis: Axis;
  onXChange: (v: Axis) => void;
  onYChange: (v: Axis) => void;
  selectedCandidateIds: string[];
  onCandidatesChange: (ids: string[]) => void;
  candidateOptions: { id: string; nombre: string }[];
}) {
  const [filterOpen, setFilterOpen] = useState(false);

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

  const toggleCandidate = (candidateId: string) => {
    onCandidatesChange(
      selectedCandidateIds.includes(candidateId)
        ? selectedCandidateIds.filter((id) => id !== candidateId)
        : [...selectedCandidateIds, candidateId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full rounded-lg border border-accent/40 bg-background/60 backdrop-blur-sm shadow-md p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-display text-accent px-1 leading-none">Eje Horizontal</div>
          <div className="flex items-stretch gap-2">
            <Select value={xAxis} onValueChange={(v) => onXChange(v as Axis)}>
              <SelectTrigger id="x-axis-select" className="h-9 px-3 text-xs w-full">
                <SelectValue placeholder="Eje Horizontal" />
              </SelectTrigger>
              <SelectContent className="text-xs py-1">
                {availableAxes.map((axis) => (
                  <SelectItem key={axis.key} value={axis.key} disabled={axis.key === yAxis} className="text-xs py-2">
                    {axis.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderInfo(xAxis)}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs font-display text-accent px-1 leading-none">Eje Vertical</div>
          <div className="flex items-stretch gap-2">
            <Select value={yAxis} onValueChange={(v) => onYChange(v as Axis)}>
              <SelectTrigger id="y-axis-select" className="h-9 px-3 text-xs w-full">
                <SelectValue placeholder="Eje Vertical" />
              </SelectTrigger>
              <SelectContent className="text-xs py-1">
                {availableAxes.map((axis) => (
                  <SelectItem key={axis.key} value={axis.key} disabled={axis.key === xAxis} className="text-xs py-2">
                    {axis.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderInfo(yAxis)}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="text-xs font-display text-accent px-1 leading-none">Filtrar candidatos</div>
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-9 px-3 text-xs inline-flex items-center justify-between w-full rounded-md border border-input bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/60"
              >
                <span className="truncate">
                  {selectedCandidateIds.length === 0
                    ? 'Selecciona candidatos'
                    : `${selectedCandidateIds.length} seleccionados`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="bottom" className="w-full sm:w-72 max-w-xs sm:max-w-none p-0">
              <div className="max-h-64 overflow-y-auto py-1 text-xs">
                {candidateOptions.map((candidate) => {
                  const isActive = selectedCandidateIds.includes(candidate.id);
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => toggleCandidate(candidate.id)}
                      className={`w-full px-3 py-2 flex items-center gap-2 text-left transition ${
                        isActive ? 'bg-accent/10 text-foreground' : 'hover:bg-muted/60 text-foreground/80'
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center h-4 w-4 rounded-sm border ${
                          isActive ? 'border-accent bg-accent text-background' : 'border-foreground/30'
                        }`}
                      >
                        {isActive && <Check className="h-3 w-3" />}
                      </span>
                      <span className="truncate">{candidate.nombre}</span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t px-3 py-2 flex justify-between gap-2">
                <button
                  type="button"
                  className="text-[11px] text-foreground/70 hover:text-foreground font-medium"
                  onClick={() => onCandidatesChange(candidateOptions.map((c) => c.id))}
                >
                  Seleccionar todos
                </button>
                <button
                  type="button"
                  className="text-[11px] text-foreground/70 hover:text-foreground font-medium"
                  onClick={() => onCandidatesChange([])}
                >
                  Limpiar
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export function PoliticalCompassPage() {
  const [xAxis, setXAxis] = useState<Axis>('econ');
  const [yAxis, setYAxis] = useState<Axis>('social');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([
    'antauro',
    'guillermo-bermejo',
    'martin-vizcarra',
    'rafael',
  ]);

  return (
    <div className="min-h-screen fighting-game-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-display text-accent mb-3">Mapa Ideológico</h1>
          <p className="text-sm md:text-base text-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Crea tu propio cuadrilátero. Cambia los ejes para cruzar posturas y descubrir nuevas perspectivas.
          </p>
        </div>

        {/* Axis Selection Controls */}
        <AxisControls
          xAxis={xAxis}
          yAxis={yAxis}
          onXChange={setXAxis}
          onYChange={setYAxis}
          selectedCandidateIds={selectedCandidateIds}
          onCandidatesChange={setSelectedCandidateIds}
          candidateOptions={candidateFilterOptions}
        />

        {/* Main Compass */}
        <div className="max-w-6xl mx-auto mb-8 mt-6">
          <PoliticalCompass
            width={700}
            height={700}
            xAxisKey={xAxis}
            yAxisKey={yAxis}
            selectedCandidateIds={selectedCandidateIds}
          />
        </div>
      </div>
    </div>
  );
}

export default PoliticalCompassPage;