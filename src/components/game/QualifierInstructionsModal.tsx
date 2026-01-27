import { Button } from '@/components/ui/button';
import { X, Zap, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QualifierInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QualifierInstructionsModal({ isOpen, onClose }: QualifierInstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-b from-card/95 to-card w-full max-w-2xl rounded-2xl border-4 border-primary/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-primary/20 border-b-4 border-primary/50 p-6 relative">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-8 h-8 text-accent animate-pulse" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white pixel-font">
                    FASE 1: FILTRO
                  </h2>
                </div>
                <p className="text-white/70 text-sm sm:text-base">
                  Selecciona quiénes pasarán a la batalla final
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Instructions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-accent font-bold pixel-font">1</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Revisa a cada candidato</h3>
                      <p className="text-white/70 text-sm">
                        Verás los 36 candidatos uno por uno. Cada uno tendrá su foto, partido político e ideología.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-green-500 font-bold pixel-font">2</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Decide: ¿VA o NO VA?</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-600 rounded px-2 py-1 text-white font-bold text-xs">VA</div>
                          <span className="text-white/70">→ Pasa a la batalla (click derecho o tecla →)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-destructive rounded px-2 py-1 text-white font-bold text-xs">NO VA</div>
                          <span className="text-white/70">→ Eliminado (click izquierdo o tecla ←)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Timer Automático</h3>
                      <p className="text-white/70 text-sm">
                        <span className="text-orange-500 font-bold">⚠️ Tienes 5 segundos</span> para decidir. 
                        Si no seleccionas nada, el candidato será automáticamente <span className="text-destructive font-bold">eliminado (NO VA)</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-primary font-bold pixel-font">3</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Mínimo 3 candidatos</h3>
                      <p className="text-white/70 text-sm">
                        Necesitas seleccionar al menos 3 candidatos para poder continuar a la fase de batalla.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Atajos de teclado:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <kbd className="px-3 py-2 bg-white/10 rounded border border-white/20 text-white font-bold min-w-[40px] text-center">←</kbd>
                      <span className="text-white/70 text-sm">NO VA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-3 py-2 bg-white/10 rounded border border-white/20 text-white font-bold min-w-[40px] text-center">→</kbd>
                      <span className="text-white/70 text-sm">VA</span>
                    </div>
                  </div>
                </div>

                {/* Start button */}
                <Button
                  onClick={onClose}
                  size="lg"
                  className="w-full pixel-font bg-primary hover:bg-primary/80 text-white font-bold text-lg h-14"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  ¡COMENZAR!
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
