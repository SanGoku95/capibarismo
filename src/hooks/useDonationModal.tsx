/**
 * Shared hook for managing donation modal state.
 * Used by HomePage and VSScreen to avoid code duplication.
 */

import { useState } from 'react';
import { DonationModal } from '@/components/common/DonationModal';

export function useDonationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // Component to render the modal
  const Modal = () => (
    <DonationModal isOpen={isOpen} onClose={close} />
  );

  return {
    isOpen,
    open,
    close,
    Modal,
  };
}
