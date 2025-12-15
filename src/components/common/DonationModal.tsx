import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 group"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors pointer-events-none" strokeWidth={2.5} />
        </button>

        {/* Yape Header with gradient */}
        <div className="bg-gradient-to-br from-[#742283] to-[#5a1a68] px-6 py-6 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative z-10">
            <svg viewBox="0 0 120 40" className="h-9 mx-auto drop-shadow-lg" fill="white">
              <text x="10" y="30" fontSize="32" fontWeight="bold" fontFamily="Arial, sans-serif">Yape</text>
            </svg>
            <p className="text-white/90 text-sm mt-3 font-sans font-medium" id="donation-modal-title">
              Escanea para yapear
            </p>
          </div>
        </div>

        {/* QR Code with better spacing and styling */}
        <div className="p-6 sm:p-8 bg-white">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl shadow-inner border border-gray-200/50">
            <img 
              src="/qr_capi.png"
              alt="QR Code de Yape para @capibarismo"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-900 font-bold text-xl font-sans tracking-tight">
              @capibarismo
            </p>
            <p className="text-gray-600 text-sm font-sans leading-relaxed">
              Escanea el código desde tu app Yape
            </p>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-5 text-center border-t border-gray-200">
          <p className="text-sm text-gray-700 font-sans font-medium">
            Gracias por apoyar este proyecto 💜
          </p>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Tu contribución hace la diferencia
          </p>
        </div>
      </div>
    </div>
  );
}