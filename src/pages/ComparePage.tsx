import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompareStore } from '@/store/useCompareStore';
import { track } from '@vercel/analytics';
import { candidates } from '@/data/candidates';

const Index = () => {
  const [searchParams] = useSearchParams();
  const { setLeftCandidate, setRightCandidate, leftCandidate, rightCandidate } = useCompareStore();
  const trackedPairRef = useRef<string | null>(null);

  useEffect(() => {
    const aParam = searchParams.get('a');
    const bParam = searchParams.get('b');

    // If URL has parameters, update candidates accordingly
    if (aParam || bParam) {
      if (aParam) {
        const match = candidates.find((candidate) => candidate.id === aParam);
        if (match && (!leftCandidate || leftCandidate.id !== match.id)) {
          setLeftCandidate(match);
          track('compare_candidate_selected', {
            candidateId: match.id,
            slot: 'left',
            source: 'prefill',
          });
        }
      }

      if (bParam) {
        const match = candidates.find((candidate) => candidate.id === bParam);
        if (match && (!rightCandidate || rightCandidate.id !== match.id)) {
          setRightCandidate(match);
          track('compare_candidate_selected', {
            candidateId: match.id,
            slot: 'right',
            source: 'prefill',
          });
        }
      }
    }
    // Only depend on searchParams to react to URL changes, not candidate state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const paramsString = searchParams.toString();
    const key = `${leftCandidate?.id ?? ''}|${rightCandidate?.id ?? ''}|${paramsString}`;
    if (trackedPairRef.current === key) return;
    trackedPairRef.current = key;

    track('compare_view_opened', {
      leftCandidateId: leftCandidate?.id ?? null,
      rightCandidateId: rightCandidate?.id ?? null,
      source: paramsString ? 'query_params' : 'direct',
    });
  }, [searchParams, leftCandidate?.id, rightCandidate?.id]);

  return (
    <div className="min-h-screen fighting-game-bg-compare lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
      <CompareView />
      <CandidatePicker />
    </div>
  );
};

export default Index;
