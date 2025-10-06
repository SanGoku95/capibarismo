import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompareStore } from '@/store/useCompareStore';
import { candidates } from '@/data/candidates';

const Index = () => {
  const [searchParams] = useSearchParams();
  const { setLeftCandidate, setRightCandidate, leftCandidate, rightCandidate } = useCompareStore();

  useEffect(() => {
    const aParam = searchParams.get('a');
    const bParam = searchParams.get('b');

    // If URL has parameters, update candidates accordingly
    if (aParam || bParam) {
      const leftCand = aParam ? candidates.find(c => c.id === aParam) : null;
      const rightCand = bParam ? candidates.find(c => c.id === bParam) : null;

      setLeftCandidate(leftCand);
      setRightCandidate(rightCand);
    }
    // Only depend on searchParams to react to URL changes, not candidate state changes
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
