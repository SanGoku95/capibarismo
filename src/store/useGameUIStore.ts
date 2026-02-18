import { create } from 'zustand';

interface GameUIState {
  // Overlay state
  candidateInfoOpen: boolean;
  selectedCandidateId: string | null;
  compareCandidateIds: string[]; // All candidates in current match for comparison

  // Keyboard help
  showKeyboardHelp: boolean;

  // Effects toggle
  reducedMotion: boolean;

  // Actions
  openCandidateInfo: (candidateId: string, allCandidateIds?: string[]) => void;
  closeCandidateInfo: () => void;
  toggleKeyboardHelp: () => void;
  setReducedMotion: (enabled: boolean) => void;
}

export const useGameUIStore = create<GameUIState>((set) => ({
  // Initial state
  candidateInfoOpen: false,
  selectedCandidateId: null,
  compareCandidateIds: [],
  showKeyboardHelp: false,
  reducedMotion: false,

  // Actions
  openCandidateInfo: (candidateId, allCandidateIds = []) =>
    set({ 
      candidateInfoOpen: true, 
      selectedCandidateId: candidateId,
      compareCandidateIds: allCandidateIds.length > 0 ? allCandidateIds : [candidateId]
    }),

  closeCandidateInfo: () =>
    set({ candidateInfoOpen: false, selectedCandidateId: null, compareCandidateIds: [] }),

  toggleKeyboardHelp: () =>
    set((state) => ({ showKeyboardHelp: !state.showKeyboardHelp })),

  setReducedMotion: (enabled) =>
    set({ reducedMotion: enabled }),
}));
