import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VSScreen } from '@/components/game/VSScreen';
import { GameHUD } from '@/components/game/GameHUD';
import { CandidateInfoOverlay } from '@/components/game/CandidateInfoOverlay';
import { BracketTreePage } from '@/components/tournament/BracketTreePage';
import { PickFromThree } from '@/components/tournament/PickFromThree';
import { PodiumScreen } from '@/components/tournament/PodiumScreen';
import { RoundIntroModal } from '@/components/tournament/RoundIntroModal';
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
const AUTO_SHOW_DELAY = 1000;
const AUTO_SHOW_DELAY_DESKTOP = 400;
// Round transition auto-advance delay (ms)
const TRANSITION_DELAY = 3000;
const TRANSITION_DELAY_DESKTOP = 1500;
// Desktop breakpoint (matches BracketTree's isMobile threshold)
const DESKTOP_BREAKPOINT = 1500;

export function JugarPage() {
  const {
    state: tournament,
    startNewTournament,
    submitVote,
    advanceFromRoundTransition,
    goToBracketPreview,
    startPlaying,
    resetTournament,
  } = useTournamentStore();

  const { setReducedMotion, reducedMotion } = useGameUIStore();

  // Overlay state for match screen
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [userViewingBracket, setUserViewingBracket] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // Track if user just entered playing from preview (for overview zoom)
  const [showBracketOverview, setShowBracketOverview] = useState(false);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT;
  // Intro modal state: shown before each round starts (auto-dismissing, no extra clicks)
  const [introModal, setIntroModal] = useState<{ round: number; pendingFn: () => void } | null>(null);

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

  // Preload ALL images for the current round upfront — fills browser cache for the entire round
  useEffect(() => {
    if (!tournament) return;
    const roundMatches = tournament.bracket.rounds[tournament.currentRound]?.matches ?? [];
    roundMatches.forEach(match => {
      match.candidates.forEach(candidateId => {
        const candidate = findCandidateBase(candidateId);
        if (candidate?.fullBody) { const img = new Image(); img.src = candidate.fullBody; }
        if (candidate?.headshot)  { const img = new Image(); img.src = candidate.headshot; }
      });
    });
  }, [tournament?.currentRound]);

  // Preload next match images while user is playing (belt-and-suspenders for slow connections)
  useEffect(() => {
    if (!tournament || !currentMatch) return;
    const nextMatch = tournament.bracket.rounds[tournament.currentRound]
      ?.matches[tournament.currentMatchIndex + 1];
    if (!nextMatch) return;
    nextMatch.candidates.forEach(candidateId => {
      const candidate = findCandidateBase(candidateId);
      if (candidate?.fullBody) { const img = new Image(); img.src = candidate.fullBody; }
      if (candidate?.headshot)  { const img = new Image(); img.src = candidate.headshot; }
    });
  }, [tournament?.currentMatchIndex, tournament?.currentRound]);

  // Lock body scroll when match overlay is covering the screen (prevents double scrollbar)
  useEffect(() => {
    document.body.style.overflow = overlayVisible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [overlayVisible]);

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

  // No tournament → create one and go straight to bracket preview
  if (!tournament) {
    startNewTournament();
    goToBracketPreview();
    return null;
  }

  // Legacy: skip onboarding phase if somehow still in it
  if (tournament.phase === 'onboarding') {
    goToBracketPreview();
    return null;
  }

  const progress = getMatchProgress(tournament);

  // Intercept round-transition advance to show intro modal for rounds 0→1 and 1→2
  const completedRound = tournament.phase === 'round-transition' ? tournament.currentRound : -1;
  const handleTransitionAction = useCallback(() => {
    if (completedRound <= 1) {
      setIntroModal({ round: completedRound + 1, pendingFn: advanceFromRoundTransition });
    } else {
      advanceFromRoundTransition();
    }
  }, [completedRound, advanceFromRoundTransition]);

  // Phase-based rendering
  switch (tournament.phase) {
    case 'bracket-preview':
      return (
        <>
          <BracketTreePage
            bracket={tournament.bracket}
            currentRound={tournament.currentRound}
            currentMatchIndex={tournament.currentMatchIndex}
            onAction={() => { setShowBracketOverview(true); startPlaying(); }}
            mode="preview"
          />
          <CandidateInfoOverlay />
          {/* Modal is always rendered in bracket-preview — no useEffect timing gap */}
          <RoundIntroModal
            roundIndex={0}
            onDismiss={() => { startPlaying(); }}
          />
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
                <div className="flex-1 relative overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
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
      const eliminated = getEliminatedInRound(tournament, completedRound);
      const advancing = getAdvancingFromRound(tournament, completedRound);

      return (
        <>
          <BracketTreePage
            bracket={tournament.bracket}
            currentRound={tournament.currentRound}
            currentMatchIndex={tournament.currentMatchIndex}
            onAction={handleTransitionAction}
            mode="transition"
            completedRoundIndex={completedRound}
            eliminatedCount={eliminated.length}
            advancingCount={advancing.length}
            autoAdvanceDelay={reducedMotion ? 1500 : isDesktop ? TRANSITION_DELAY_DESKTOP : TRANSITION_DELAY}
          />
          <CandidateInfoOverlay />
          <AnimatePresence>
            {introModal && (
              <RoundIntroModal
                roundIndex={introModal.round as 0 | 1 | 2}
                onDismiss={() => { const fn = introModal.pendingFn; setIntroModal(null); fn(); }}
              />
            )}
          </AnimatePresence>
        </>
      );
    }

    case 'podium': {
      if (!tournament.podium) return null;

      return (
        <>
          <PodiumScreen
            podium={tournament.podium}
            onPlayAgain={resetTournament}
          />
          <CandidateInfoOverlay />
        </>
      );
    }

    default:
      return null;
  }
}
