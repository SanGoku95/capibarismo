import { create } from 'zustand';
import type { CompletionTier } from '@/services/sessionService';

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
  
  // Actions
  openCandidateInfo: (candidateId: string) => void;
  closeCandidateInfo: () => void;
  toggleKeyboardHelp: () => void;
  setReducedMotion: (enabled: boolean) => void;
  openCompletionModal: (tier: CompletionTier) => void;
  closeCompletionModal: () => void;
}

export const useGameUIStore = create<GameUIState>((set) => ({
  // Initial state
  candidateInfoOpen: false,
  selectedCandidateId: null,
  showKeyboardHelp: false,
  reducedMotion: false,
  completionModalOpen: false,
  completionTier: 'none',
  
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
}));
