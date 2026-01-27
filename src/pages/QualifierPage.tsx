import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QualifierCard } from '@/components/game/QualifierCard';
import { QualifierInstructionsModal } from '@/components/game/QualifierInstructionsModal';
import { CandidateInfoOverlay } from '@/components/game/CandidateInfoOverlay';
import { Button } from '@/components/ui/button';
import { useGameUIStore } from '@/store/useGameUIStore';
import { listCandidates } from '@/data';
import { ChevronLeft, Zap } from 'lucide-react';
import { useSEO } from '@/lib/useSEO';

const MINIMUM_QUALIFIED = 3; // Minimum candidates needed for versus mode
const AUTO_REJECT_TIMEOUT = 3000; // 5 seconds

export function QualifierPage() {
  const navigate = useNavigate();
  const { 
    setQualifiedCandidates, 
    completeQualifier,
    closeCandidateInfo 
  } = useGameUIStore();

  useSEO({
    title: '¿Quién Va? - Filtro de Candidatos | Elecciones Perú 2026',
    description: 'Selecciona los candidatos presidenciales que pasarán a la batalla final. Sistema de filtrado rápido para las elecciones de Perú 2026.',
    type: 'website',
  });

  const allCandidates = listCandidates();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [swipeDirection, setSwipeDirection] = useState<'accept' | 'reject' | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCandidate = allCandidates[currentIndex];
  const isComplete = currentIndex >= allCandidates.length;

  // Reset state on mount if starting fresh
  useEffect(() => {
    if (currentIndex === 0 && accepted.size === 0) {
      setAccepted(new Set());
      setCurrentIndex(0);
    }
  }, []);

  // Auto-reject timer - starts after instructions are closed
  useEffect(() => {
    // Don't run timer if instructions are showing, game is complete, or no candidate
    if (showInstructions || isComplete || !currentCandidate) {
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      handleReject();
    }, AUTO_REJECT_TIMEOUT);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, showInstructions, isComplete, currentCandidate]);

  // Prefetch next candidate image
  useEffect(() => {
    if (currentIndex < allCandidates.length - 1) {
      const nextCandidate = allCandidates[currentIndex + 1];
      if (nextCandidate.fullBody) {
        const img = new Image();
        img.src = nextCandidate.fullBody;
      }
    }
  }, [currentIndex, allCandidates]);

  const handleAccept = () => {
    if (!currentCandidate) return;
    
    // Clear timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setSwipeDirection('accept');
    setAccepted(prev => new Set([...prev, currentCandidate.id]));
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  const handleReject = () => {
    // Clear timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setSwipeDirection('reject');
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  const handleFinish = () => {
    const acceptedArray = Array.from(accepted);
    
    if (acceptedArray.length < MINIMUM_QUALIFIED) {
      alert(`Necesitas seleccionar al menos ${MINIMUM_QUALIFIED} candidatos para continuar.`);
      return;
    }

    setQualifiedCandidates(acceptedArray);
    completeQualifier();
    navigate('/jugar');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAccepted(new Set());
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isComplete || showInstructions) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleReject();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleAccept();
      } else if (e.key === 'Escape') {
        closeCandidateInfo();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isComplete, showInstructions, closeCandidateInfo]);

  if (isComplete) {
    return (
      <div className="min-h-screen fighting-game-bg flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-card/90 backdrop-blur-sm p-8 rounded-2xl border-4 border-primary/50 shadow-2xl">
            <Zap className="w-20 h-20 mx-auto mb-6 text-accent animate-pulse" />
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 pixel-font">
              ¡FILTRO COMPLETO!
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-6">
              Has seleccionado <span className="text-accent font-bold">{accepted.size}</span> candidato{accepted.size !== 1 ? 's' : ''}
            </p>

            {accepted.size < MINIMUM_QUALIFIED ? (
              <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-4 mb-6">
                <p className="text-white font-semibold">
                  ⚠️ Necesitas al menos {MINIMUM_QUALIFIED} candidatos para continuar
                </p>
              </div>
            ) : (
              <div className="bg-green-600/20 border-2 border-green-600 rounded-lg p-4 mb-6">
                <p className="text-white font-semibold">
                  ✅ ¡Listos para la batalla!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="pixel-font"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                REINICIAR
              </Button>
              
              <Button
                onClick={handleFinish}
                disabled={accepted.size < MINIMUM_QUALIFIED}
                size="lg"
                className="pixel-font bg-primary hover:bg-primary/80 text-white font-bold"
              >
                <Zap className="w-5 h-5 mr-2" />
                ¡A LA ARENA!
              </Button>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-white/60 hover:text-white"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
        
        <CandidateInfoOverlay />
      </div>
    );
  }

  return (
    <div className="min-h-screen fighting-game-bg flex flex-col">
      {/* Header */}
      <div className="w-full bg-black/60 backdrop-blur-sm border-b-4 border-primary/50 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white pixel-font mb-1">
              ¿QUIÉN VA?
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Seleccionados: <span className="text-accent font-bold">{accepted.size}</span> / {allCandidates.length}
            </p>
          </div>

          <div className="w-[100px]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <AnimatePresence mode="wait">
          {currentCandidate && (
            <QualifierCard
              key={currentCandidate.id}
              candidate={currentCandidate}
              onAccept={handleAccept}
              onReject={handleReject}
              index={currentIndex}
              total={allCandidates.length}
              swipeDirection={swipeDirection}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard hint */}
      <div className="w-full bg-black/60 backdrop-blur-sm border-t-2 border-white/10 p-3">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-white/50">
            <span className="hidden sm:inline">
              Teclas: <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd> NO VA · <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd> VA
            </span>
            <span className="sm:hidden">
              Mínimo {MINIMUM_QUALIFIED} candidatos para continuar
            </span>
          </p>
        </div>
      </div>

      <CandidateInfoOverlay />
      
      <QualifierInstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
    </div>
  );
}

export default QualifierPage;
