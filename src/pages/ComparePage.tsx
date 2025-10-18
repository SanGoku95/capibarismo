import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompareStore } from '@/store/useCompareStore';
import { candidates } from '@/data/candidates';
import { useSEO } from '@/lib/useSEO';

const Index = () => {
  const [searchParams] = useSearchParams();
  const { setLeftCandidate, setRightCandidate, leftCandidate, rightCandidate } = useCompareStore();

  const title = leftCandidate && rightCandidate
    ? `Comparar ${leftCandidate.nombre} vs ${rightCandidate.nombre} | Elecciones Perú 2026`
    : 'Comparar Candidatos Presidenciales | Perú 2026';

  const description = leftCandidate && rightCandidate
    ? `Compara las propuestas, trayectorias y posiciones de ${leftCandidate.nombre} y ${rightCandidate.nombre} para las elecciones presidenciales de Perú 2026.`
    : 'Compara candidatos presidenciales de Perú 2026 lado a lado. Analiza sus propuestas, trayectorias y posiciones políticas con información verificada.';

  useSEO({
    title,
    description,
    type: 'website',
  });

  useEffect(() => {
    const aParam = searchParams.get('a');
    const bParam = searchParams.get('b');

    if (aParam) {
      const match = candidates.find(candidate => candidate.id === aParam);
      if (match && (!leftCandidate || leftCandidate.id !== match.id)) {
        setLeftCandidate(match);
      }
    }

    if (bParam) {
      const match = candidates.find(candidate => candidate.id === bParam);
      if (match && (!rightCandidate || rightCandidate.id !== match.id)) {
        setRightCandidate(match);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-screen fighting-game-bg-compare lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
      <CompareView />
      <CandidatePicker />
    </div>
  );
};

export default Index;
