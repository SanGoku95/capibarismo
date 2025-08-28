import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';

const Index = () => {
  return (
    <div className="min-h-screen fighting-game-bg-compare lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
      <CompareView />
      <CandidatePicker />
    </div>
  );
};

export default Index;
