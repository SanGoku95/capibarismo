import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompletionTier } from '@/services/sessionService';

// Game phases
export type GamePhase = 'QUALIFIER' | 'VERSUS' | 'RESULTS';

interface GameUIState {
  // Overlay state
  candidateInfoOpen: boolean;
  selectedCandidateId: string | null;
  
  // Keyboard help
  showKeyboardHelp: boolean;
  
  // Effects toggle
  reducedMotion: boolean;
  
  // Completion modal - now tracks which tier
  completionModalOpen: boolean;
  completionTier: CompletionTier;
  
  // Game Phase Management
  gamePhase: GamePhase;
  qualifiedCandidateIds: string[];
  hasCompletedQualifier: boolean;
  
  // Actions
  openCandidateInfo: (candidateId: string) => void;
  closeCandidateInfo: () => void;
  toggleKeyboardHelp: () => void;
  setReducedMotion: (enabled: boolean) => void;
  openCompletionModal: (tier: CompletionTier) => void;
  closeCompletionModal: () => void;
  
  // Qualifier Actions
  setQualifiedCandidates: (candidateIds: string[]) => void;
  completeQualifier: () => void;
  resetGamePhase: () => void;
  setGamePhase: (phase: GamePhase) => void;
}

export const useGameUIStore = create<GameUIState>()(
  persist(
    (set) => ({
      // Initial state
      candidateInfoOpen: false,
      selectedCandidateId: null,
      showKeyboardHelp: false,
      reducedMotion: false,
      completionModalOpen: false,
      completionTier: 'none',
      
      // Game phase state
      gamePhase: 'QUALIFIER',
      qualifiedCandidateIds: [],
      hasCompletedQualifier: false,
      
      // Actions
      openCandidateInfo: (candidateId) => 
        set({ candidateInfoOpen: true, selectedCandidateId: candidateId }),
      
      closeCandidateInfo: () => 
        set({ candidateInfoOpen: false, selectedCandidateId: null }),
      
      toggleKeyboardHelp: () => 
        set((state) => ({ showKeyboardHelp: !state.showKeyboardHelp })),
      
      setReducedMotion: (enabled) => 
        set({ reducedMotion: enabled }),
      
      openCompletionModal: (tier) => 
        set({ completionModalOpen: true, completionTier: tier }),
      
      closeCompletionModal: () => 
        set({ completionModalOpen: false }),
      
      // Qualifier Actions
      setQualifiedCandidates: (candidateIds) =>
        set({ qualifiedCandidateIds: candidateIds }),
      
      completeQualifier: () =>
        set({ 
          gamePhase: 'VERSUS',
          hasCompletedQualifier: true,
        }),
      
      resetGamePhase: () =>
        set({ 
          gamePhase: 'QUALIFIER',
          qualifiedCandidateIds: [],
          hasCompletedQualifier: false,
        }),
      
      setGamePhase: (phase) =>
        set({ gamePhase: phase }),
    }),
    {
      name: 'game-ui-storage',
      partialize: (state) => ({
        gamePhase: state.gamePhase,
        qualifiedCandidateIds: state.qualifiedCandidateIds,
        hasCompletedQualifier: state.hasCompletedQualifier,
      }),
    }
  )
);
