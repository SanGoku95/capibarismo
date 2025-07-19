
import { useCompareStore } from '@/store/useCompareStore';
import { CandidateFullBody } from './CandidateFullBody';
import { CandidateFactSheet } from './CandidateFactSheet';

export function CompareView() {
  const { leftCandidate, rightCandidate } = useCompareStore();

  return (
    <div className="w-full h-full p-4">
      <div className="h-full">
        {/* Mobile: Only fact sheets, no full body images */}
        <div className="lg:hidden space-y-4">
          <CandidateFactSheet candidate={leftCandidate} side="left" />
          <CandidateFactSheet candidate={rightCandidate} side="right" />
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
