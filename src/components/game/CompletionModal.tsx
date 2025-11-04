import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';
import { Trophy, TrendingUp, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompletionModalProps {
  onContinue: () => void;
}

export function CompletionModal({ onContinue }: CompletionModalProps) {
  const { completionModalOpen, closeCompletionModal } = useGameUIStore();
  
  const handleContinue = () => {
    closeCompletionModal();
    onContinue();
  };
  
  return (
    <Dialog open={completionModalOpen} onOpenChange={(open) => !open && closeCompletionModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">¡Tu ranking está listo!</DialogTitle>
          <DialogDescription className="text-center">
            Has completado suficientes comparaciones para generar un ranking estable.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Puedes continuar jugando para mejorar la precisión de tu ranking personal,
            o ver los resultados ahora.
          </p>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleContinue} variant="outline" className="w-full sm:w-auto">
            <TrendingUp className="w-4 h-4 mr-2" />
            Seguir jugando
          </Button>
          <Button onClick={closeCompletionModal} asChild className="w-full sm:w-auto">
            <Link to="/ranking?view=session">
              Ver mi ranking
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
