// Accessibility helpers
export const ARIA_LABELS = {
  CANDIDATE_COMPARE: (candidateName: string) => `Seleccionar a ${candidateName} para comparar`,
  CANDIDATE_PROFILE_LINK: (candidateName: string) => `Ver perfil completo de ${candidateName}`,
  SOCIAL_PLATFORM_LINK: (candidateName: string, platform: string) => `Ver perfil de ${candidateName} en ${platform}`,
  CANDIDATE_SECTION: (section: string, candidateName: string) => `${section} de ${candidateName}`,
  VS_INDICATOR: (leftName: string, rightName: string) => `Comparando ${leftName} contra ${rightName}`,
  PLAYER_INDICATOR: (side: string, number: string) => `Candidato ${number} del lado ${side}`,
} as const;

// Screen reader text for better accessibility
export const SR_ONLY_TEXT = {
  LOADING: 'Cargando contenido...',
  EXTERNAL_LINK: '(abre en ventana nueva)',
  REQUIRED_FIELD: '(campo requerido)',
  OPTIONAL_FIELD: '(campo opcional)',
  NAVIGATION_MENU: 'Menú de navegación',
} as const;

// Focus management helpers
export const FOCUS_CLASSES = {
  FOCUS_VISIBLE: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  FOCUS_WITHIN: 'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
} as const;

// Keyboard navigation constants
export const KEYBOARD = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
} as const;