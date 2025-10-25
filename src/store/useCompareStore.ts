import { create } from 'zustand';
import type { CandidateBase } from '@/data/types';

type Slot = 'left' | 'right';

const computeNextSlot = (
  leftCandidate: CandidateBase | null,
  rightCandidate: CandidateBase | null,
): Slot => {
  if (!leftCandidate && !rightCandidate) return 'left';
  if (!leftCandidate) return 'left';
  if (!rightCandidate) return 'right';
  return 'left';
};

interface CompareState {
  leftCandidate: CandidateBase | null;
  rightCandidate: CandidateBase | null;
  nextSlotToReplace: Slot;
  setLeftCandidate: (candidate: CandidateBase | null) => void;
  setRightCandidate: (candidate: CandidateBase | null) => void;
  selectCandidate: (candidate: CandidateBase) => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  leftCandidate: null,
  rightCandidate: null,
  nextSlotToReplace: 'left',

  setLeftCandidate: (candidate) =>
    set((state) => ({
      leftCandidate: candidate,
      nextSlotToReplace: computeNextSlot(candidate, state.rightCandidate),
    })),
  setRightCandidate: (candidate) =>
    set((state) => ({
      rightCandidate: candidate,
      nextSlotToReplace: computeNextSlot(state.leftCandidate, candidate),
    })),

  selectCandidate: (candidate) =>
    set((state) => {
      const { leftCandidate, rightCandidate, nextSlotToReplace } = state;

      // If candidate is already selected, remove them
      if (leftCandidate?.id === candidate.id) {
        return { leftCandidate: null, nextSlotToReplace: 'left' };
      }
      if (rightCandidate?.id === candidate.id) {
        return { rightCandidate: null, nextSlotToReplace: 'right' };
      }

      if (!leftCandidate && !rightCandidate) {
        return { leftCandidate: candidate, nextSlotToReplace: 'right' };
      }

      if (!leftCandidate) {
        return { leftCandidate: candidate, nextSlotToReplace: 'right' };
      }

      if (!rightCandidate) {
        return { rightCandidate: candidate, nextSlotToReplace: 'left' };
      }

      if (nextSlotToReplace === 'left') {
        return { leftCandidate: candidate, nextSlotToReplace: 'right' };
      }

      return { rightCandidate: candidate, nextSlotToReplace: 'left' };
    }),
}));