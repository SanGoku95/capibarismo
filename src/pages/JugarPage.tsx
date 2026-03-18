import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { VSScreen } from '@/components/game/VSScreen';
import { GameHUD } from '@/components/game/GameHUD';
import { CandidateInfoOverlay } from '@/components/game/CandidateInfoOverlay';
import { BracketTreePage } from '@/components/tournament/BracketTreePage';
import { PickFromThree } from '@/components/tournament/PickFromThree';
import { PodiumScreen } from '@/components/tournament/PodiumScreen';
import { DecidePeModal } from '@/components/tournament/DecidePeModal';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useTournamentStore } from '@/store/useTournamentStore';
import {
  getCurrentMatch,
  getMatchProgress,
  getEliminatedInRound,
  getAdvancingFromRound,
} from '@/services/tournamentService';
import { ROUND_CONFIG } from '@/lib/tournamentConstants';
import { findCandidateBase } from '@/data';
import { useTrackJugarView } from '@/lib/posthog';

// Auto-show overlay delay (ms) — brief bracket flash before match
const AUTO_SHOW_DELAY = 1600;
const AUTO_SHOW_DELAY_DESKTOP = 900;
// Round transition auto-advance delay (ms)
const TRANSITION_DELAY = 3000;
const TRANSITION_DELAY_DESKTOP = 1500;
// Desktop breakpoint (matches BracketTree's isMobile threshold)
const DESKTOP_BREAKPOINT = 1500;

export function JugarPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Capture initial params once — before any effect or render side-effect changes them.
  // Using lazy useState so the values are frozen at component mount time.
  const [initialSemifinalParam] = useState(() => searchParams.get('semifinal'));
  const [initialRefParam] = useState(() => searchParams.get('ref'));

  // Clean up the URL immediately after mount so params never linger in the address bar.
  useEffect(() => {
    if (initialSemifinalParam || initialRefParam) {
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    state: tournament,
    startNewTournament,
    startSemifinalTournament,
    submitVote,
    advanceFromRoundTransition,
    goToBracketPreview,
    startPlaying,
    resetTournament,
  } = useTournamentStore();

  const { setReducedMotion, reducedMotion } = useGameUIStore();

  // Referral modal: ?ref=dpe + valid ?semifinal= param
  const [refModalIds, setRefModalIds] = useState<string[] | null>(null);
  const refChecked = useRef(false);

  useEffect(() => {
    if (refChecked.current) return;
    refChecked.current = true;

    if (initialRefParam !== 'dpe' || !initialSemifinalParam) return;

    const ids = initialSemifinalParam.split(',').map((s) => s.trim());
    if (ids.length === 4 && ids.every((id) => findCandidateBase(id))) {
      setRefModalIds(ids);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Conflict: existing tournament + incoming ?semifinal= param
  const [pendingSemifinalIds, setPendingSemifinalIds] = useState<string[] | null>(null);
  const conflictChecked = useRef(false);

  useEffect(() => {
    if (conflictChecked.current) return;
    conflictChecked.current = true;

    if (!initialSemifinalParam || !tournament) return;
    // Already running a semifinal tournament — no conflict
    if (tournament.bracket.rounds[0].matches.length === 0) return;

    const ids = initialSemifinalParam.split(',').map((s) => s.trim());
    if (ids.length === 4 && ids.every((id) => findCandidateBase(id))) {
      setPendingSemifinalIds(ids);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Overlay state for match screen
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [userViewingBracket, setUserViewingBracket] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // Track if user just entered playing from preview (for overview zoom)
  const [showBracketOverview, setShowBracketOverview] = useState(false);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT;

  useTrackJugarView({ sessionId: tournament?.id ?? 'none' });

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);

  const currentMatch = tournament ? getCurrentMatch(tournament) : null;
  const phase = tournament?.phase;

  // Preload candidate images for the current match before the overlay appears.
  // This fills the browser cache during the AUTO_SHOW_DELAY window so images
  // are ready the moment the overlay renders, eliminating black frames.
  useEffect(() => {
    if (!currentMatch) return;

    const imgs: HTMLImageElement[] = [];
    currentMatch.candidates.forEach((id) => {
      const c = findCandidateBase(id);
      if (!c) return;

      const mainSrc = c.fullBody || c.headshot;
      if (mainSrc) {
        const img = new window.Image();
        img.src = encodeURI(mainSrc);
        imgs.push(img);
      }
      if (c.partyIcon) {
        const img = new window.Image();
        img.src = encodeURI(c.partyIcon);
        imgs.push(img);
      }
    });

    return () => { imgs.forEach((img) => { img.src = ''; }); };
  }, [tournament?.currentRound, tournament?.currentMatchIndex]);

  // Auto-show match overlay after brief bracket flash
  useEffect(() => {
    if (phase !== 'playing-pick-three' && phase !== 'playing-1v1') return;
    if (userViewingBracket) return;

    // Longer delay when showing overview first (1.2s left + 1.2s right + 0.8s zoom = ~3.2s)
    // On desktop the full bracket is already visible, so use shorter delays
    const autoShowDelay = isDesktop ? AUTO_SHOW_DELAY_DESKTOP : AUTO_SHOW_DELAY;
    const delay = showBracketOverview
      ? (reducedMotion ? 800 : isDesktop ? 1200 : 3500)
      : (reducedMotion ? 300 : autoShowDelay);

    autoTimerRef.current = setTimeout(() => {
      setOverlayVisible(true);
      setShowBracketOverview(false);
    }, delay);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [phase, tournament?.currentRound, tournament?.currentMatchIndex, userViewingBracket, reducedMotion, showBracketOverview]);

  // User manually views bracket
  const handleViewBracket = useCallback(() => {
    setOverlayVisible(false);
    setUserViewingBracket(true);
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
  }, []);

  // User returns from bracket view
  const handleContinueFromBracket = useCallback(() => {
    setUserViewingBracket(false);
    setOverlayVisible(true);
  }, []);

  // Referral modal: shown first, before any conflict check
  if (refModalIds) {
    return (
      <DecidePeModal
        candidateIds={refModalIds}
        onContinue={() => setRefModalIds(null)}
      />
    );
  }

  // Conflict modal: existing tournament vs incoming semifinal param
  if (pendingSemifinalIds) {
    return (
      <div className="min-h-screen fighting-game-bg flex flex-col items-center justify-center p-6">
        <div className="bg-black/80 border border-white/20 rounded-xl p-6 max-w-sm w-full space-y-5">
          <h2
            className="text-center text-white font-bold text-[10px] uppercase tracking-wider leading-relaxed"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            TORNEO EN CURSO
          </h2>
          <p className="text-white/60 text-sm text-center leading-relaxed">
            Ya tienes un torneo activo. ¿Quieres continuar o iniciar el modo semifinal?
          </p>
          <div className="space-y-3 pt-1">
            <button
              onClick={() => setPendingSemifinalIds(null)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 border-2 border-white/20 hover:border-white/50 rounded shadow-[0_4px_0_rgb(0,0,0,0.5)] hover:shadow-[0_2px_0_rgb(0,0,0,0.5)] hover:translate-y-[2px] transition-all uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.45rem, 2vw, 0.65rem)' }}
            >
              CONTINUAR MI TORNEO
            </button>
            <button
              onClick={() => {
                startSemifinalTournament(pendingSemifinalIds);
                setPendingSemifinalIds(null);
              }}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 border-2 border-white/20 hover:border-white/50 rounded shadow-[0_4px_0_rgb(0,0,0,0.5)] hover:shadow-[0_2px_0_rgb(0,0,0,0.5)] hover:translate-y-[2px] transition-all uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.45rem, 2vw, 0.65rem)' }}
            >
              INICIAR TORNEO RAPIDO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No tournament → create one (normal or semifinal) and go to bracket preview
  if (!tournament) {
    if (initialSemifinalParam) {
      const ids = initialSemifinalParam.split(',').map((s) => s.trim());
      if (ids.length === 4 && ids.every((id) => findCandidateBase(id))) {
        startSemifinalTournament(ids);
      } else {
        startNewTournament();
        goToBracketPreview();
      }
    } else {
      startNewTournament();
      goToBracketPreview();
    }
    return null;
  }

  // Legacy: skip onboarding phase if somehow still in it
  if (tournament.phase === 'onboarding') {
    goToBracketPreview();
    return null;
  }

  const progress = getMatchProgress(tournament);

  // Phase-based rendering
  switch (tournament.phase) {
    case 'bracket-preview':
      return (
        <>
          <BracketTreePage
            bracket={tournament.bracket}
            currentRound={tournament.currentRound}
            currentMatchIndex={tournament.currentMatchIndex}
            onAction={() => { startPlaying(); setOverlayVisible(true); }}
            mode="preview"
            showOverviewFirst={false}
          />
          <CandidateInfoOverlay />
        </>
      );

    case 'playing-pick-three': {
      if (!currentMatch) return null;

      const roundConfig = ROUND_CONFIG[tournament.currentRound];

      return (
        <>
          {/* Bracket is the main view */}
          <BracketTreePage
            bracket={tournament.bracket}
            currentRound={tournament.currentRound}
            currentMatchIndex={tournament.currentMatchIndex}
            onAction={handleContinueFromBracket}
            mode="viewing"
            showOverviewFirst={showBracketOverview}
          />

          {/* Pick-from-three as auto-showing overlay */}
          <AnimatePresence>
            {overlayVisible && (
              <motion.div
                initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="fixed inset-0 z-40 fighting-game-bg flex flex-col"
              >
                <GameHUD
                  roundLabel={progress.roundLabel}
                  arcadeRoundLabel={progress.arcadeRoundLabel}
                  matchLabel={progress.matchLabel}
                  overallProgress={progress.overallPercent}
                  onViewBracket={handleViewBracket}
                  onNewGame={resetTournament}
                />
                <div className="flex-1 relative overflow-y-auto">
                  <PickFromThree
                    candidateIds={currentMatch.candidates}
                    onSelect={(winnerId) => {
                      submitVote(winnerId);
                      setOverlayVisible(false);
                      setUserViewingBracket(false);
                    }}
                    groupIndex={tournament.currentMatchIndex}
                    totalGroups={roundConfig?.matchCount}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CandidateInfoOverlay />
        </>
      );
    }

    case 'playing-1v1': {
      if (!currentMatch) return null;

      const candidateA = findCandidateBase(currentMatch.candidates[0]);
      const candidateB = findCandidateBase(currentMatch.candidates[1]);

      if (!candidateA || !candidateB) return null;

      const pair = {
        pairId: currentMatch.id,
        a: {
          id: candidateA.id,
          nombre: candidateA.nombre,
          ideologia: candidateA.ideologia ?? undefined,
          fullBody: candidateA.fullBody,
          headshot: candidateA.headshot,
          partyIcon: candidateA.partyIcon,
          partido: candidateA.partido,
        },
        b: {
          id: candidateB.id,
          nombre: candidateB.nombre,
          ideologia: candidateB.ideologia ?? undefined,
          fullBody: candidateB.fullBody,
          headshot: candidateB.headshot,
          partyIcon: candidateB.partyIcon,
          partido: candidateB.partido,
        },
      };

      return (
        <>
          {/* Bracket is the main view */}
          <BracketTreePage
            bracket={tournament.bracket}
            currentRound={tournament.currentRound}
            currentMatchIndex={tournament.currentMatchIndex}
            onAction={handleContinueFromBracket}
            mode="viewing"
            showOverviewFirst={showBracketOverview}
          />

          {/* VS Screen as auto-showing overlay */}
          <AnimatePresence>
            {overlayVisible && (
              <motion.div
                initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="fixed inset-0 z-40 fighting-game-bg flex flex-col"
              >
                <GameHUD
                  roundLabel={progress.roundLabel}
                  arcadeRoundLabel={progress.arcadeRoundLabel}
                  matchLabel={progress.matchLabel}
                  overallProgress={progress.overallPercent}
                  onViewBracket={handleViewBracket}
                  onNewGame={resetTournament}
                />
                <div className="flex-1 relative overflow-hidden">
                  <VSScreen
                    pair={pair}
                    onVote={(winner) => {
                      const winnerId = winner === 'A' ? candidateA.id : candidateB.id;
                      submitVote(winnerId);
                      setOverlayVisible(false);
                      setUserViewingBracket(false);
                    }}
                    roundLabel={progress.arcadeRoundLabel}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CandidateInfoOverlay />
        </>
      );
    }

    case 'round-transition': {
      const completedRound = tournament.currentRound;
      const eliminated = getEliminatedInRound(tournament, completedRound);
      const advancing = getAdvancingFromRound(tournament, completedRound);

      return (
        <>
          <BracketTreePage
            bracket={tournament.bracket}
            currentRound={tournament.currentRound}
            currentMatchIndex={tournament.currentMatchIndex}
            onAction={advanceFromRoundTransition}
            mode="transition"
            completedRoundIndex={completedRound}
            eliminatedCount={eliminated.length}
            advancingCount={advancing.length}
            autoAdvanceDelay={reducedMotion ? 1500 : isDesktop ? TRANSITION_DELAY_DESKTOP : TRANSITION_DELAY}
          />
          <CandidateInfoOverlay />
        </>
      );
    }

    case 'podium': {
      if (!tournament.podium) return null;

      const isSemifinalTournament = tournament.bracket.rounds[0].matches.length === 0;

      return (
        <>
          <PodiumScreen
            podium={tournament.podium}
            onPlayAgain={resetTournament}
            onPlayFull={isSemifinalTournament ? () => {
              startNewTournament();
              goToBracketPreview();
            } : undefined}
          />
          <CandidateInfoOverlay />
        </>
      );
    }

    default:
      return null;
  }
}
