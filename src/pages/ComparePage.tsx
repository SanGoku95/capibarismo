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
    // Only process URL params if both slots are currently empty
    if (leftCandidate || rightCandidate) {
      return;
    }

    const aParam = searchParams.get('a');
    const bParam = searchParams.get('b');

    if (aParam || bParam) {
      const leftCand = aParam ? candidates.find(c => c.id === aParam) : null;
      const rightCand = bParam ? candidates.find(c => c.id === bParam) : null;

      if (leftCand) {
        setLeftCandidate(leftCand);
      }
      if (rightCand) {
        setRightCandidate(rightCand);
      }
    }
  }, [searchParams, setLeftCandidate, setRightCandidate, leftCandidate, rightCandidate]);

  return (
    <div className="min-h-screen fighting-game-bg-compare lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
      <CompareView />
      <CandidatePicker />
    </div>
  );
};

export default Index;
