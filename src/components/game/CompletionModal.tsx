import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useNavigate } from 'react-router-dom';
import { getSessionId } from '@/hooks/useGameAPI';
import { PRELIMINARY_GOAL, RECOMMENDED_GOAL } from '@/lib/gameConstants';
import { Trophy, Target } from 'lucide-react';

export function CompletionModal() {
  const { completionModalOpen, completionTier, closeCompletionModal } = useGameUIStore();
  const navigate = useNavigate();

  const handleViewRanking = () => {
    closeCompletionModal();
    navigate(`/ranking?mode=personal&sessionId=${getSessionId()}`);
  };

  const handleContinuePlaying = () => {
    closeCompletionModal();
    // User continues playing on the same page
  };

  const isPreliminary = completionTier === 'preliminary';

  return (
    <Dialog open={completionModalOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="pointer-events-auto max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto">
            {isPreliminary ? (
              <Target className="w-12 h-12 text-yellow-500" />
            ) : (
              <Trophy className="w-12 h-12 text-yellow-500" />
            )}
          </div>
          <DialogTitle className="text-xl text-center">
            {isPreliminary 
              ? '¡Tu ranking borrador está listo!' 
              : '¡Tu ranking está completo!'}
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            {isPreliminary ? (
              <>
                Has completado <strong>{PRELIMINARY_GOAL} comparaciones</strong>. 
                Ya tienes una idea de tus preferencias.
                <br /><br />
                💡 Para un ranking más preciso, te recomendamos llegar a <strong>{RECOMMENDED_GOAL} comparaciones</strong>.
              </>
            ) : (
              <>
                Con <strong>{RECOMMENDED_GOAL} comparaciones</strong>, tu ranking es estadísticamente confiable.
                ¡Descubre quién es tu candidato favorito!
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Custom footer for centered stacked buttons */}
        <div className="flex flex-col gap-3 mt-2">
          <Button onClick={handleViewRanking} size="lg" className="w-full">
            {isPreliminary ? 'Ver ranking borrador' : 'Ver mi ranking final'}
          </Button>
          {isPreliminary && (
            <Button onClick={handleContinuePlaying} variant="outline" size="lg" className="w-full">
              Seguir comparando
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
