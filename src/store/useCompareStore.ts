import { create } from 'zustand';
import { Candidate } from '../data/candidates';

interface CompareState {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  setLeftCandidate: (candidate: Candidate | null) => void;
  setRightCandidate: (candidate: Candidate | null) => void;
  selectCandidate: (candidate: Candidate) => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  leftCandidate: null,
  rightCandidate: null,
  
  setLeftCandidate: (candidate) => set({ leftCandidate: candidate }),
  setRightCandidate: (candidate) => set({ rightCandidate: candidate }),
  
  selectCandidate: (candidate) => {
    const { leftCandidate, rightCandidate } = get();
    
    // If candidate is already selected, remove them
    if (leftCandidate?.id === candidate.id) {
      set({ leftCandidate: null });
      return;
    }
    if (rightCandidate?.id === candidate.id) {
      set({ rightCandidate: null });
      return;
    }
    
    // If both slots are empty, assign to left
    if (!leftCandidate && !rightCandidate) {
      set({ leftCandidate: candidate });
      return;
    }
    
    // If left is empty, assign to left
    if (!leftCandidate) {
      set({ leftCandidate: candidate });
      return;
    }
    
    // If right is empty, assign to right
    if (!rightCandidate) {
      set({ rightCandidate: candidate });
      return;
    }
    
    // If both slots are full, replace the right one
    set({ rightCandidate: candidate });
  },
}));