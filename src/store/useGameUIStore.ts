import { create } from 'zustand';

interface GameUIState {
  // Overlay state
  candidateInfoOpen: boolean;
  selectedCandidateId: string | null;
  
  // Keyboard help
  showKeyboardHelp: boolean;
  
  // Effects toggle
  reducedMotion: boolean;
  retroEffects: boolean;
  
  // Completion modal
  completionModalOpen: boolean;
  
  // Actions
  openCandidateInfo: (candidateId: string) => void;
  closeCandidateInfo: () => void;
  toggleKeyboardHelp: () => void;
  setReducedMotion: (enabled: boolean) => void;
  toggleRetroEffects: () => void;
  openCompletionModal: () => void;
  closeCompletionModal: () => void;
}

export const useGameUIStore = create<GameUIState>((set) => ({
  // Initial state
  candidateInfoOpen: false,
  selectedCandidateId: null,
  showKeyboardHelp: false,
  reducedMotion: false,
  retroEffects: true,
  completionModalOpen: false,
  
  // Actions
  openCandidateInfo: (candidateId) => 
    set({ candidateInfoOpen: true, selectedCandidateId: candidateId }),
  
  closeCandidateInfo: () => 
    set({ candidateInfoOpen: false, selectedCandidateId: null }),
  
  toggleKeyboardHelp: () => 
    set((state) => ({ showKeyboardHelp: !state.showKeyboardHelp })),
  
  setReducedMotion: (enabled) => 
    set({ reducedMotion: enabled }),
  
  toggleRetroEffects: () => 
    set((state) => ({ retroEffects: !state.retroEffects })),
  
  openCompletionModal: () => 
    set({ completionModalOpen: true }),
  
  closeCompletionModal: () => 
    set({ completionModalOpen: false }),
}));
