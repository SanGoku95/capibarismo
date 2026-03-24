import type { ReactNode } from 'react';
import { findCandidateBase } from '@/data';

// =============================================================================
// Config
// =============================================================================

export interface AllianceConfig {
  /** Display name used in alt text and aria labels */
  name: string;
  /** Logo rendered next to the Capibarismo logo. Use an <img> once an asset is available. */
  logo: ReactNode;
  /** Main body copy — can include JSX for styled highlights */
  description: ReactNode;
  /** Secondary line above the candidate grid. Defaults to a generic message. */
  subtext?: string;
  /** CTA button label. Defaults to "¡A LUCHAR!" */
  ctaLabel?: string;
}

/**
 * Add a new entry here whenever a partner website integrates the ?ref= redirect.
 * Key = the value of the ?ref= query param.
 */
export const ALLIANCE_CONFIGS: Record<string, AllianceConfig> = {
  dpe: {
    name: 'decide.pe',
    logo: (
        // Check CORS
      <img src="https://decide.pe/reverseLogo.svg" alt="decide.pe" className="h-12" />
    ),
    description: (
      <>
        Fuiste redirigido desde{' '}
        <span className="text-red-700 font-semibold">decide.pe</span>{' '}
        con una lista de candidatos para competir.
      </>
    ),
  },
};

// =============================================================================
// Component
// =============================================================================

interface AllianceModalProps {
  config: AllianceConfig;
  candidateIds: string[];
  /** Always called when the user chooses to start the semifinal with these candidates. */
  onStart: () => void;
  /**
   * When provided, a "keep current tournament" secondary button is shown.
   * Pass this only when an active non-semifinal tournament already exists.
   */
  onKeepCurrent?: () => void;
}

export function AllianceModal({ config, candidateIds, onStart, onKeepCurrent }: AllianceModalProps) {
  const candidates = candidateIds.map((id) => findCandidateBase(id)).filter(Boolean);
  const subtext = config.subtext ?? 'Estos son los 4 candidatos que obtuviste allí:';
  const ctaLabel = config.ctaLabel ?? '¡A LUCHAR!';

  return (
    <div className="min-h-screen fighting-game-bg flex flex-col items-center justify-center p-6">
      <div className="bg-black/85 border border-white/20 rounded-xl p-8 max-w-md w-full space-y-6">

        {/* Logos */}
        <div className="flex items-center justify-center gap-5">
          <picture>
            <source srcSet="/capi_logo.webp" type="image/webp" />
            <img src="/capi_logo.png" alt="Capibarismo" className="h-16 w-16" />
          </picture>
          <span className="text-white/30 font-bold text-3xl select-none">✕</span>
          {config.logo}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Body */}
        <div className="space-y-2 text-center">
          <p className="text-white/80 text-base leading-relaxed">
            {config.description}
          </p>
          <p className="text-white/50 text-sm">{subtext}</p>
        </div>

        {/* Candidates grid */}
        <div className="grid grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                {candidate.headshot ? (
                  <img
                    src={encodeURI(candidate.headshot)}
                    alt={candidate.nombre}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/30 text-sm">?</div>
                )}
              </div>
              <p className="text-white text-sm text-center font-medium leading-tight line-clamp-2">
                {candidate.nombre}
              </p>
              {candidate.partido && (
                <p className="text-white/40 text-xs text-center leading-tight line-clamp-1">
                  {candidate.partido}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 border-2 border-white/20 hover:border-white/50 rounded shadow-[0_4px_0_rgb(0,0,0,0.5)] hover:shadow-[0_2px_0_rgb(0,0,0,0.5)] hover:translate-y-[2px] transition-all uppercase tracking-wider"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.55rem, 2vw, 0.75rem)' }}
          >
            {ctaLabel}
          </button>
          {onKeepCurrent && (
            <button
              onClick={onKeepCurrent}
              className="w-full bg-transparent hover:bg-white/5 text-white/50 hover:text-white/80 font-bold py-3 border border-white/15 hover:border-white/30 rounded transition-all uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.45rem, 2vw, 0.6rem)' }}
            >
              CONTINUAR MI TORNEO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}