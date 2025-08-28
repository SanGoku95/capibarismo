// Social platform icon mappings
export const SOCIAL_PLATFORM_TYPES = {
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  WEB: 'web',
} as const;

// Candidate sides for comparison
export const CANDIDATE_SIDES = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

// Player indicators
export const PLAYER_INDICATORS = {
  [CANDIDATE_SIDES.LEFT]: { 
    label: 'P1', 
    number: '1',
    bgColor: 'bg-team-left',
    badgeColor: 'bg-team-left text-team-left-foreground',
    borderColor: 'border-l-team-left',
    panelColor: 'candidate-panel-left',
  },
  [CANDIDATE_SIDES.RIGHT]: { 
    label: 'P2', 
    number: '2',
    bgColor: 'bg-team-right',
    badgeColor: 'bg-team-right text-team-right-foreground',
    borderColor: 'border-l-team-right',
    panelColor: 'candidate-panel-right',
  },
} as const;

// Common CSS classes
export const UI_CLASSES = {
  LOADING_SPINNER: "animate-spin rounded-full border-b-2 border-primary",
  CARD_BORDER: "border-l-4 fighting-game-card",
  ROUNDED_FULL_IMG: "rounded-full object-cover shadow-md",
  TRUNCATE_TEXT: "truncate",
  BREAK_WORDS: "break-words",
  GRID_TWO_COLS: "grid grid-cols-2 gap-4 md:gap-6",
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export type SocialPlatformType = typeof SOCIAL_PLATFORM_TYPES[keyof typeof SOCIAL_PLATFORM_TYPES];
export type CandidateSide = typeof CANDIDATE_SIDES[keyof typeof CANDIDATE_SIDES];