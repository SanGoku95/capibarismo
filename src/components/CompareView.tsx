
import { useCompareStore } from '@/store/useCompareStore';
import { CandidateFullBody } from './CandidateFullBody';
import { CandidateFactSheet } from './CompareViewDesktop';
import { CandidateComparisonGrid } from './CompareViewMobile';

export function CompareView() {
  const { leftCandidate, rightCandidate } = useCompareStore();

  return (
    <div className="w-full h-full p-4">
      <div className="h-full">
        {/* Mobile: Side-by-side comparison with scrollable spec grid */}
        <div className="lg:hidden h-full">
          <CandidateComparisonGrid leftCandidate={leftCandidate} rightCandidate={rightCandidate} />
        </div>

        {/* Desktop: 4-column grid with full body images */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4 lg:h-full">
          <div className="flex items-center justify-center">
            <CandidateFullBody candidate={leftCandidate} side="left" />
          </div>
          <div>
            <CandidateFactSheet candidate={leftCandidate} side="left" />
          </div>
          <div>
            <CandidateFactSheet candidate={rightCandidate} side="right" />
          </div>
          <div className="flex items-center justify-center">
            <CandidateFullBody candidate={rightCandidate} side="right" />
          </div>
        </div>
      </div>
    </div>
  );
}
