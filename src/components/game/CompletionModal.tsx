import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNavigate } from 'react-router-dom';
import { getSessionId } from '@/hooks/useGameAPI';
import { useEffect } from 'react';

interface CompletionModalProps {
  onContinue?: () => void;
}

export function CompletionModal({ onContinue }: CompletionModalProps) {
  const { completionModalOpen, closeCompletionModal } = useGameUIStore();
  const sessionId = getSessionId();
  const navigate = useNavigate();

  // Auto-redirect to ranking when modal opens
  useEffect(() => {
    if (completionModalOpen) {
      // Short delay for better UX (user can see the modal briefly)
      const timer = setTimeout(() => {
        closeCompletionModal();
        navigate(`/ranking?mode=personal&sessionId=${sessionId}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [completionModalOpen, sessionId, navigate, closeCompletionModal]);

  return (
    <Dialog open={completionModalOpen} onOpenChange={() => {}}>
      <DialogContent className="pointer-events-auto" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>¡Tu ranking está listo!</DialogTitle>
        </DialogHeader>

        <p>Redirigiendo a tu ranking personal...</p>

        <DialogFooter>
          <Button onClick={() => {
            closeCompletionModal();
            navigate(`/ranking?mode=personal&sessionId=${sessionId}`);
          }}>
            Ver mi ranking ahora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
