import { CompareView } from '@/components/CompareView';
import { CandidatePicker } from '@/components/CandidatePicker';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: Vertical flow */}
      <div className="lg:hidden">
        <CandidatePicker />
        <CompareView />
      </div>

      {/* Desktop: Grid layout with fixed height */}
      <div className="hidden lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
        <CompareView />
        <CandidatePicker />
      </div>
    </div>
  );
};

export default Index;
