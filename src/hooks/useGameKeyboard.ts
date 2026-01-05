/**
 * Hook for handling keyboard controls in the game.
 * Manages keyboard event listeners for voting and closing overlays.
 */

import { useEffect } from 'react';

interface UseGameKeyboardOptions {
  onVoteA: () => void;
  onVoteB: () => void;
  onEscape: () => void;
  enabled?: boolean;
}

export function useGameKeyboard({
  onVoteA,
  onVoteB,
  onEscape,
  enabled = true,
}: UseGameKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if a dialog/modal is open
      if (document.querySelector('[role="dialog"]')) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onVoteA();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onVoteB();
          break;
        case 'Escape':
          onEscape();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onVoteA, onVoteB, onEscape, enabled]);
}
