import { CompareView } from '@/components/CompareViewLayout';
import { CandidatePicker } from '@/components/CandidatePicker';

const Index = () => {
  return (
    <div className="min-h-screen fighting-game-bg lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
      <CompareView />
      <CandidatePicker />
    </div>
  );
};

export default Index;
