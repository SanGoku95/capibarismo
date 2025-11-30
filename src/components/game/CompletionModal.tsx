import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';
import { Link } from 'react-router-dom';
import { getSessionId } from '@/hooks/useGameAPI';

interface CompletionModalProps {
  onContinue?: () => void;
}

export function CompletionModal({ onContinue }: CompletionModalProps) {
  const { completionModalOpen, closeCompletionModal } = useGameUIStore();
  const sessionId = getSessionId();
  
  return (
    <Dialog open={completionModalOpen} onOpenChange={(open) => !open && closeCompletionModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Tu ranking está listo!</DialogTitle>
        </DialogHeader>
        
        <p>Has completado suficientes comparaciones.</p>
        
        <DialogFooter>
          <Button onClick={closeCompletionModal} asChild>
            <Link to={`/ranking?mode=personal&sessionId=${sessionId}`}>Ver mi ranking</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
