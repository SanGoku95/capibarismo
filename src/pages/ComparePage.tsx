import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';
import { CompareActionBar } from '@/components/compare/CompareActionBar';
import { TopicDifferencePills } from '@/components/compare/TopicDifferencePills';
import { MatchupEmptyState } from '@/components/compare/MatchupEmptyState';
import { useCompareStore } from '@/store/useCompareStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useSavedStore } from '@/store/useSavedStore';
import { trendingMatchups, pickRandomMatchup } from '@/data/matchups';
import { candidates } from '@/data/candidates';
import { shareOrCopy } from '@/lib/share';

const ComparePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trendingIndex, setTrendingIndex] = useState(0);

  const {
    leftCandidate,
    rightCandidate,
    pinnedSide,
    setPinnedSide,
    setCandidatesByIds,
  } = useCompareStore((state) => ({
    leftCandidate: state.leftCandidate,
    rightCandidate: state.rightCandidate,
    pinnedSide: state.pinnedSide,
    setPinnedSide: state.setPinnedSide,
    setCandidatesByIds: state.setCandidatesByIds,
  }));

  const lastMatchCandidates = useOnboardingStore((state) => state.lastMatchCandidates);
  const saveMatchup = useSavedStore((state) => state.saveMatchup);
  const setResumeCompare = useSavedStore((state) => state.setResumeCompare);

  useEffect(() => {
    const a = searchParams.get('a');
    const b = searchParams.get('b');
    if (a || b) {
      setCandidatesByIds(a, b);
    }
  }, [searchParams, setCandidatesByIds]);

  useEffect(() => {
    if (leftCandidate || rightCandidate) {
      setResumeCompare({ left: leftCandidate?.id ?? null, right: rightCandidate?.id ?? null });
      return;
    }
    if (lastMatchCandidates.length >= 2) {
      setCandidatesByIds(lastMatchCandidates[0], lastMatchCandidates[1]);
    } else {
      const fallback = trendingMatchups[0].candidates;
      setCandidatesByIds(fallback[0], fallback[1]);
    }
  }, [leftCandidate, rightCandidate, lastMatchCandidates, setCandidatesByIds, setResumeCompare]);

  const handleTogglePin = (side: 'left' | 'right') => {
    setPinnedSide(pinnedSide === side ? null : side);
  };

  const updateSearchParams = (leftId: string | null, rightId: string | null) => {
    const params = new URLSearchParams();
    if (leftId) params.set('a', leftId);
    if (rightId) params.set('b', rightId);
    navigate({ pathname: '/compare', search: params.toString() }, { replace: true });
  };

  const handleNextMatchup = () => {
    const nextIndex = (trendingIndex + 1) % trendingMatchups.length;
    setTrendingIndex(nextIndex);
    const next = trendingMatchups[nextIndex];
    setCandidatesByIds(next.candidates[0], next.candidates[1]);
    updateSearchParams(next.candidates[0], next.candidates[1]);
  };

  const handleRandom = () => {
    if (pinnedSide === 'left' && leftCandidate) {
      const pool = candidates.filter((candidate) => candidate.id !== leftCandidate.id);
      const random = pool[Math.floor(Math.random() * pool.length)];
      setCandidatesByIds(leftCandidate.id, random.id);
      updateSearchParams(leftCandidate.id, random.id);
      return;
    }
    if (pinnedSide === 'right' && rightCandidate) {
      const pool = candidates.filter((candidate) => candidate.id !== rightCandidate.id);
      const random = pool[Math.floor(Math.random() * pool.length)];
      setCandidatesByIds(random.id, rightCandidate.id);
      updateSearchParams(random.id, rightCandidate.id);
      return;
    }
    const random = pickRandomMatchup();
    setCandidatesByIds(random.candidates[0], random.candidates[1]);
    updateSearchParams(random.candidates[0], random.candidates[1]);
  };

  const handleShare = async () => {
    if (!leftCandidate || !rightCandidate) return;
    const url = `${window.location.origin}/compare?a=${leftCandidate.id}&b=${rightCandidate.id}`;
    await shareOrCopy({
      title: 'Comparativa electoral',
      text: `Estoy comparando a ${leftCandidate.nombre} vs ${rightCandidate.nombre}. ¿Cuál prefieres?`,
      url,
    });
  };

  const handleSave = () => {
    if (!leftCandidate || !rightCandidate) return;
    saveMatchup([leftCandidate.id, rightCandidate.id], 'Comparación guardada');
  };

  const showEmptyState = !leftCandidate && !rightCandidate;

  const emptyStateMatchups = useMemo(() => trendingMatchups, []);

  return (
    <div className="min-h-screen fighting-game-bg-compare pb-24 lg:pb-10">
      <CompareActionBar
        leftCandidate={leftCandidate}
        rightCandidate={rightCandidate}
        pinnedSide={pinnedSide}
        onTogglePin={handleTogglePin}
        onRandom={handleRandom}
        onShare={handleShare}
        onSave={handleSave}
        onNextMatchup={handleNextMatchup}
      />

      {showEmptyState ? (
        <MatchupEmptyState
          matchups={emptyStateMatchups}
          onSelect={(leftId, rightId) => {
            setCandidatesByIds(leftId, rightId);
            updateSearchParams(leftId, rightId);
          }}
          onRandom={handleRandom}
        />
      ) : (
        <>
          <TopicDifferencePills leftCandidate={leftCandidate} rightCandidate={rightCandidate} />
          <div className="lg:grid lg:grid-rows-[1fr_auto] lg:min-h-[70vh]">
            <CompareView />
          </div>
        </>
      )}

      <CandidatePicker />
    </div>
  );
};

export default ComparePage;
