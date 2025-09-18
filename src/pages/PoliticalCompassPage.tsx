import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PoliticalCompass, Axis, axisLabels } from '@/components/political-compass/PoliticalCompass';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Info, Sparkles } from 'lucide-react';
import { useMatchResults } from '@/hooks/useMatchResults';
import { CompassResultCard } from '@/components/compass/CompassResultCard';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useSavedStore } from '@/store/useSavedStore';
import { shareOrCopy } from '@/lib/share';
import { ActivationFlow } from '@/components/onboarding/ActivationFlow';
import { ConfettiBurst } from '@/components/common/ConfettiBurst';
import { toast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [xAxis, setXAxis] = useState<Axis>('econ');
  const [yAxis, setYAxis] = useState<Axis>('social');
  const [isQuizOpen, setQuizOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const matches = useMatchResults();
  const { hasCompleted, setLastMatches, incrementShare } = useOnboardingStore((state) => ({
    hasCompleted: state.hasCompleted,
    setLastMatches: state.setLastMatches,
    incrementShare: state.incrementShare,
  }));

  const toggleCandidate = useSavedStore((state) => state.toggleCandidate);
  const isCandidateSaved = useSavedStore((state) => state.isCandidateSaved);
  const setResumeCompare = useSavedStore((state) => state.setResumeCompare);
  const saveMatchup = useSavedStore((state) => state.saveMatchup);

  useEffect(() => {
    if (!hasCompleted) {
      setQuizOpen(true);
    }
  }, [hasCompleted]);

  useEffect(() => {
    if (searchParams.get('start') === '1' || searchParams.get('onboarding') === '1') {
      setQuizOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (matches.length > 0) {
      setLastMatches(matches.slice(0, 3).map((entry) => entry.candidate.id));
    }
  }, [matches, setLastMatches]);

  const handleCompare = (leftId: string, rightId: string) => {
    saveMatchup([leftId, rightId], 'Match recomendado');
    setResumeCompare({ left: leftId, right: rightId });
    navigate(`/compare?a=${leftId}&b=${rightId}`);
  };

  const handleShare = async (leftId: string, rightId: string) => {
    const shareUrl = `${window.location.origin}/compare?a=${leftId}&b=${rightId}`;
    const leftCandidate = matches.find((entry) => entry.candidate.id === leftId)?.candidate;
    const rightCandidate = matches.find((entry) => entry.candidate.id === rightId)?.candidate;
    const text = leftCandidate && rightCandidate
      ? `Mis matches top: ${leftCandidate.nombre} vs ${rightCandidate.nombre}. ¿Quién te representa más?`
      : 'Descubre tus matches presidenciales en Capybarismo';
    await shareOrCopy({
      title: 'Comparte tu match político',
      text,
      url: shareUrl,
    });
    incrementShare();
  };

  const handleQuizComplete = () => {
    setQuizOpen(false);
    setConfettiTrigger((value) => value + 1);
    toast({ title: '¡Listo! 🎯', description: 'Actualizamos tus matches según tus temas clave.' });
  };

  const topTwo = useMemo(() => matches.slice(0, 2), [matches]);

  return (
    <div className="min-h-screen fighting-game-bg pb-20">
      <ConfettiBurst trigger={confettiTrigger} />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl md:text-4xl font-display text-accent">Brújula política</h1>
          <p className="text-sm md:text-base text-foreground/90 max-w-3xl">
            Responde rápido, descubre dónde caes y comparte tus matchups más cercanos. Puedes ajustar los ejes para explorar
            diferentes dimensiones.
          </p>
          <Button variant="ghost" size="sm" onClick={() => setQuizOpen(true)} className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Volver a elegir temas
          </Button>
        </div>

        {matches.length > 0 && (
          <CompassResultCard
            matches={matches}
            onCompare={(left, right) => handleCompare(left, right)}
            onShare={handleShare}
            onFollow={(candidateId) => toggleCandidate(candidateId)}
          />
        )}

        <AxisControls xAxis={xAxis} yAxis={yAxis} onXChange={setXAxis} onYChange={setYAxis} />

        <div className="max-w-6xl mx-auto mb-8">
          <PoliticalCompass width={700} height={700} xAxisKey={xAxis} yAxisKey={yAxis} selectedCandidateIds={matches.map((entry) => entry.candidate.id)} />
        </div>

        {topTwo.length === 2 && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => handleCompare(topTwo[0].candidate.id, topTwo[1].candidate.id)}>Comparar nuevamente</Button>
            <Button
              variant={isCandidateSaved(topTwo[0].candidate.id) ? 'secondary' : 'outline'}
              onClick={() => toggleCandidate(topTwo[0].candidate.id)}
            >
              {isCandidateSaved(topTwo[0].candidate.id) ? 'Siguiendo candidato top' : `Seguir a ${topTwo[0].candidate.nombre.split(' ')[0]}`}
            </Button>
          </div>
        )}
      </div>

      <ActivationFlow open={isQuizOpen} onClose={() => setQuizOpen(false)} onComplete={handleQuizComplete} title="Personaliza tu brújula" subtitle="Selecciona temas y ajusta tu orientación en menos de 15 segundos." />
    </div>
  );
}

export default PoliticalCompassPage;