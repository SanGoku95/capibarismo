import { useCompareStore } from '@/store/useCompareStore';
import { CandidateFullBody } from '../candidate/CandidateFullBody';
import { CandidateFactSheet } from './ComparePanelDesktop';
import { CandidateComparisonGrid } from './ComparePanelMobile';
import { useState } from 'react';

export function CompareView() {
  const { leftCandidate, rightCandidate } = useCompareStore();
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="w-full h-full p-4">
      <div className="h-full">
        <div className="lg:hidden h-full">
          <CandidateComparisonGrid leftCandidate={leftCandidate} rightCandidate={rightCandidate} />
        </div>

        <div className="hidden lg:block lg:h-full">
          <div className="grid lg:grid-cols-4 lg:gap-4 lg:h-full">
            <div className="flex items-center justify-center">
              <CandidateFullBody candidate={leftCandidate} side="left" />
            </div>
            <div className="flex items-start pt-8">
              <CandidateFactSheet
                candidate={leftCandidate}
                side="left"
                openSection={openSection}
                setOpenSection={setOpenSection}
              />
            </div>
            <div className="flex items-start pt-8">
              <CandidateFactSheet
                candidate={rightCandidate}
                side="right"
                openSection={openSection}
                setOpenSection={setOpenSection}
              />
            </div>
            <div className="flex items-center justify-center">
              <CandidateFullBody candidate={rightCandidate} side="right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
