import { useCallback, useEffect, useMemo, useState } from 'react';
import Joyride, { CallBackProps, EVENTS, STATUS, Step, ACTIONS } from 'react-joyride';

type CompassTourProps = {
  // When this value changes, the tour restarts regardless of localStorage
  restartKey?: number;
};

const LS_KEY = 'ppp_compass_tour_seen_v1';

export default function CompassTour({ restartKey }: CompassTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Define steps with stable selectors present in the page
  const steps: Step[] = useMemo(
    () => [
      {
        target: '#x-axis-select',
        content:
          'Comienza aquí. Elige el tema que quieres analizar en el eje horizontal del mapa.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '#y-axis-select',
        content:
          'Ahora, selecciona el tema para el eje vertical, completando tu perspectiva.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="candidate-point"]',
        content:
          'Cada punto representa un candidato. Su ubicación muestra su postura en los ejes seleccionados.',
        placement: 'top',
      },
      {
        target: 'body',
        content:
          'Toca un punto para ver un resumen y acceder a su perfil completo (botón “Ver Perfil”).',
        placement: 'center',
      },
    ],
    []
  );

  // Auto-run only on first visit
  useEffect(() => {
    const seen = localStorage.getItem(LS_KEY);
    if (!seen) {
      // delay a bit to ensure DOM is ready
      const t = setTimeout(() => {
        setStepIndex(0);
        setRun(true);
      }, 300);
      return () => clearTimeout(t);
    }
  }, []);

  // External restart (from Help button)
  useEffect(() => {
    if (restartKey !== undefined) {
      // allow UI to render first
      const t = setTimeout(() => {
        localStorage.removeItem(LS_KEY);
        setRun(false);
        setStepIndex(0);
        // next tick start
        setTimeout(() => setRun(true), 50);
      }, 50);
      return () => clearTimeout(t);
    }
  }, [restartKey]);

  const ensureTargetInView = useCallback((index: number) => {
    const targetSel = steps[index]?.target as string | undefined;
    if (!targetSel) return;
    const el = document.querySelector(targetSel) as HTMLElement | null;
    if (!el) return;
    // center the target in viewport to avoid jumping to unknown positions
    try {
      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    } catch {
      // some browsers may not support options; fallback
      el.scrollIntoView();
    }
  }, [steps]);

  const handleCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;
    const finished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
    if (finished) {
      localStorage.setItem(LS_KEY, '1');
      setRun(false);
    }
    // Manage step index locally
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      if (action === ACTIONS.NEXT) {
        const next = (index ?? 0) + 1;
        setStepIndex(next);
        ensureTargetInView(next);
      } else if (action === ACTIONS.PREV) {
        const prev = Math.max(0, (index ?? 1) - 1);
        setStepIndex(prev);
        ensureTargetInView(prev);
      }
    }
  };

  // On (re)start or stepIndex changes, make sure the target is centered
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => ensureTargetInView(stepIndex), 100);
    return () => clearTimeout(t);
  }, [run, stepIndex, ensureTargetInView]);

  // Listen to axis changes to auto-advance steps without leaving the tour
  useEffect(() => {
    const onAxisChanged = (e: Event) => {
      const axis = (e as CustomEvent).detail?.axis as 'x' | 'y' | undefined;
      if (!run || axis === undefined) return;
      // If user selected x-axis at step 0, go to step 1; if y-axis at step 1, go to step 2
      if (stepIndex === 0 && axis === 'x') {
        const next = 1;
        setStepIndex(next);
        ensureTargetInView(next);
      } else if (stepIndex === 1 && axis === 'y') {
        const next = 2;
        setStepIndex(next);
        ensureTargetInView(next);
      }
    };
    window.addEventListener('ppp-tour-axis-changed', onAxisChanged as EventListener);
    return () => window.removeEventListener('ppp-tour-axis-changed', onAxisChanged as EventListener);
  }, [run, stepIndex, ensureTargetInView]);

  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep={false}
      disableScrolling
  // react-joyride auto scroll is handled by scrollToFirstStep and built-in behavior
      disableScrollParentFix={false}
  spotlightClicks
      spotlightPadding={10}
      hideCloseButton
      disableOverlayClose
      locale={{
        back: 'Anterior',
        close: 'Finalizar',
        last: 'Finalizar',
        next: 'Siguiente',
        open: 'Abrir',
        skip: 'Saltar tour',
      }}
      styles={{
        options: {
          arrowColor: 'hsl(var(--background))',
          backgroundColor: 'hsl(var(--background))',
          overlayColor: 'rgba(0,0,0,0.55)',
          primaryColor: 'hsl(var(--accent))',
          textColor: 'hsl(var(--foreground))',
          zIndex: 1000,
        },
        tooltipTitle: {
          fontWeight: 700,
        },
      }}
      callback={handleCallback}
    />
  );
}
