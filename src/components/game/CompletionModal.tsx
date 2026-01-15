import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNavigate } from 'react-router-dom';
import { getSessionId } from '@/hooks/useGameAPI';

export function CompletionModal() {
  const { completionModalOpen, closeCompletionModal } = useGameUIStore();
  const navigate = useNavigate();

  const handleViewRanking = () => {
    closeCompletionModal();
    navigate(`/ranking?mode=personal&sessionId=${getSessionId()}`);
  };

  return (
    <Dialog open={completionModalOpen} onOpenChange={() => {}}>
      <DialogContent className="pointer-events-auto text-center" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>¡Tu ranking esta listo!</DialogTitle>
        </DialogHeader>

        <p>Has completado suficientes comparaciones.</p>

        <DialogFooter className="flex justify-center">
          <Button onClick={handleViewRanking} size="lg" className="w-full">
            Ver mi ranking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
