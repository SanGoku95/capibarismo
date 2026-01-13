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
      <DialogContent className="pointer-events-auto" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>¡Felicitaciones! Has completado el juego</DialogTitle>
        </DialogHeader>

        <p>Has completado todas las comparaciones. ¡Es hora de ver tu ranking personal!</p>

        <DialogFooter>
          <Button onClick={handleViewRanking} size="lg">
            Ver mi ranking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
