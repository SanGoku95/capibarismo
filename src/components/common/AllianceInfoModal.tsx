import { X, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { usePostHog } from '@/lib/posthog';

interface AllianceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AllianceInfoModal({ isOpen, onClose }: AllianceInfoModalProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (isOpen) {
      posthog?.capture('alliance_info_modal_view', { partner: 'decide.pe' });
    }
  }, [isOpen, posthog]);

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
      aria-labelledby="alliance-modal-title"
    >
      <div
        className="relative w-full max-w-sm bg-black/90 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-white/70" strokeWidth={2} />
        </button>

        <div className="p-7 space-y-6">
          {/* Logos */}
          <div className="flex items-center justify-center gap-4">
            <picture>
              <source srcSet="/capi_logo.webp" type="image/webp" />
              <img src="/capi_logo.png" alt="Capibarismo" className="h-12 w-12" />
            </picture>
            <span className="text-white/30 font-bold text-2xl select-none">✕</span>
            <img
              src="https://decide.pe/reverseLogo.svg"
              alt="decide.pe"
              className="h-10 w-auto"
            />
          </div>

          {/* Body */}
          <div className="text-center space-y-3">
            <h2
              id="alliance-modal-title"
              className="text-white font-semibold text-base leading-snug"
            >
              Juega con tus candidatos ideales
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-sans">
              Descubre el modo <span className="text-white font-bold">batalla rápida</span> gracias a nuestra colaboración con{' '}
              <span className="text-red-400 font-medium">decide.pe</span>
            </p>
          </div>

          {/* Steps */}
          <ol className="space-y-2 text-sm text-white/70 font-sans">
            {[
              'Visita el Electómetro',
              'Descubre quienés son los candidatos que mejor se alinean con tus ideas',
              <>Presiona sobre <strong className="text-white font-bold">MODO BATALLA</strong> para volver y luchar con tu Top 4</>,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-red-700/40 border border-red-700/60 text-red-400 text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <a
            href="https://decide.pe"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              posthog?.capture('alliance_decide_pe_click', { source: 'info_modal' });
              onClose();
            }}
            className="group flex items-center justify-between w-full rounded-xl bg-red-700/80 hover:bg-red-700 border border-red-600/60 hover:border-red-500 text-white px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/60"
          >
            <span>Ir a decide.pe</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
