import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';
import { CompareActionBar } from '@/components/compare/CompareActionBar';
import { TopicDifferences } from '@/components/compare/TopicDifferences';
import { useCompareStore } from '@/store/useCompareStore';
import { useUserPreferences } from '@/store/useUserPreferences';
import { candidates } from '@/data/candidates';

const Index = () => {
  const { leftCandidate, rightCandidate, setPair } = useCompareStore();
  const { recordMatchupView } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedLeft = useMemo(() => searchParams.get('a'), [searchParams]);
  const requestedRight = useMemo(() => searchParams.get('b'), [searchParams]);

  useEffect(() => {
    const left = requestedLeft ? candidates.find((candidate) => candidate.id === requestedLeft) ?? null : null;
    const right = requestedRight ? candidates.find((candidate) => candidate.id === requestedRight) ?? null : null;
    if (left || right) {
      setPair(left, right);
    }
  }, [requestedLeft, requestedRight, setPair]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (leftCandidate) params.set('a', leftCandidate.id);
    if (rightCandidate) params.set('b', rightCandidate.id);
    setSearchParams(params, { replace: true });
  }, [leftCandidate, rightCandidate, setSearchParams]);

  useEffect(() => {
    if (leftCandidate && rightCandidate) {
      recordMatchupView(leftCandidate.id, rightCandidate.id);
    }
  }, [leftCandidate, rightCandidate, recordMatchupView]);

  return (
    <div className="min-h-screen fighting-game-bg-compare pb-24 lg:grid lg:h-screen lg:grid-rows-[auto_1fr_auto]">
      <div className="container mx-auto px-4 pt-4">
        <CompareActionBar />
        <TopicDifferences leftCandidate={leftCandidate} rightCandidate={rightCandidate} />
      </div>
      <CompareView />
      <CandidatePicker />
    </div>
  );
};

export default Index;
