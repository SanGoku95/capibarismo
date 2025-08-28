import { useCompareStore } from '@/store/useCompareStore';
import { CandidateFullBody } from '../candidate/CandidateFullBody';
import { CandidateFactSheet } from './ComparePanelDesktop';
import { CandidateComparisonGrid } from './ComparePanelMobile';

export function CompareView() {
  const { leftCandidate, rightCandidate } = useCompareStore();

  return (
    <div className="w-full h-full p-4">
      <div className="h-full">
        {/* Mobile: Side-by-side comparison with scrollable spec grid */}
        <div className="lg:hidden h-full">
          <CandidateComparisonGrid leftCandidate={leftCandidate} rightCandidate={rightCandidate} />
        </div>

        {/* Desktop: Fighting arena layout */}
        <div className="hidden lg:block lg:h-full">          
          <div className="grid lg:grid-cols-4 lg:gap-4 lg:h-full">
            {/* Left fighter */}
            <div className="flex items-center justify-center">
              <CandidateFullBody candidate={leftCandidate} side="left" />
            </div>
            
            {/* Left fighter stats */}
            <div className="flex items-start pt-8">
              <CandidateFactSheet candidate={leftCandidate} side="left" />
            </div>
            
            {/* Right fighter stats */}
            <div className="flex items-start pt-8">
              <CandidateFactSheet candidate={rightCandidate} side="right" />
            </div>
            
            {/* Right fighter */}
            <div className="flex items-center justify-center">
              <CandidateFullBody candidate={rightCandidate} side="right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
