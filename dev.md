# 🥊 Presidential Punch Peru - Developer Documentation

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Design System & Theme](#design-system--theme)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Data Management](#data-management)
- [Development Workflow](#development-workflow)
- [Code Organization](#code-organization)
- [Performance Considerations](#performance-considerations)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

Presidential Punch Peru is built as a modern Single Page Application (SPA) using React 18 with TypeScript. The application follows a component-based architecture with clear separation of concerns.

### Technology Stack & Rationale

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18** | UI Framework | Modern hooks, concurrent features, excellent ecosystem |
| **TypeScript** | Type Safety | Prevents runtime errors, better DX, self-documenting code |
| **Vite** | Build Tool | Fast HMR, modern bundling, optimized for React |
| **React Router** | Client-side routing | Standard React routing solution, code splitting support |
| **Zustand** | State Management | Lightweight, minimal boilerplate compared to Redux |
| **TanStack Query** | Server State | Caching, synchronization, background updates |
| **shadcn/ui** | Component Library | Customizable, accessible, Tailwind-based |
| **Tailwind CSS** | Styling | Utility-first, consistent design tokens, rapid development |

### Key Architecture Decisions

1. **Component-First Approach**: All UI is built as reusable components with clear interfaces
2. **Domain-Driven Organization**: Components are organized by feature domain (candidate, compare, political-compass)
3. **Separation of Concerns**: Clear boundaries between UI, state, data, and business logic
4. **Performance-First**: Code splitting, lazy loading, optimized bundling
5. **Accessibility**: Built-in a11y support through shadcn/ui components

## Design System & Theme

### 90s Fighting Game Aesthetic

The application uses a distinctive retro gaming theme inspired by 90s fighting games:

#### Color System
```css
/* Primary Theme Colors */
--background: 222 47% 11%;        /* Deep space blue */
--foreground: 210 40% 98%;        /* High contrast white */
--primary: 320 90% 65%;           /* Vibrant magenta */
--secondary: 180 100% 50%;        /* Neon cyan */
--accent: 45 100% 50%;           /* Electric yellow */

/* Team Colors for Political Spectrum */
--team-left: 0 84% 60%;          /* P1 Red (left/progressive) */
--team-right: 217 89% 61%;       /* P2 Blue (right/conservative) */
```

#### Typography
- **Headings**: 'Press Start 2P' (pixel font for retro gaming feel)
- **Body Text**: 'Inter' (modern, readable font for content)
- **Contrast**: High contrast ratios for accessibility

#### UI Elements
- **Chunky Borders**: Sharp corners, defined edges
- **Neon Effects**: Glowing borders and shadows
- **Pixelated Elements**: Retro-style buttons and components
- **Fighting Game HUD**: Status bars, character selection interfaces

### Design Tokens

The design system uses CSS custom properties for consistent theming:

```css
/* Example usage in components */
.candidate-panel-left {
  box-shadow: inset 4px 0 0 hsl(var(--team-left));
}

.section-title {
  color: hsl(var(--accent));
  text-shadow: 2px 2px hsl(var(--background));
  clip-path: polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}
```

## Component Architecture

### Project Structure

```bash
/
├── api/                # Vercel Serverless Functions (Backend)
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # Generic UI (shadcn)
│   │   ├── game/       # Game-specific components
│   │   └── ...
│   ├── hooks/          # Custom logic & API integration
│   ├── store/          # Zustand global state
│   ├── data/           # Static candidate data
│   └── pages/          # Route components
```

### Component Design Patterns

#### 1. Composition over Inheritance
```tsx
// Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Candidate Name</CardTitle>
  </CardHeader>
  <CardContent>
    <CandidateDetails />
  </CardContent>
</Card>
```

#### 2. Props Interface Design
```tsx
interface CandidateAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string; // Allow style overrides
}
```

#### 3. Responsive Components
Components are built mobile-first with responsive behavior:

```tsx
// Example: Different layouts for mobile/desktop
const CompareViewLayout = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? (
    <MobileComparisonGrid />
  ) : (
    <DesktopFightingArena />
  );
};
```

### Key Components Deep Dive

#### CompareView System
The comparison functionality is split across multiple components:

- **ComparePage.tsx**: Top-level page container and routing
- **CompareViewLayout.tsx**: Layout coordinator, handles responsive switching
- **CandidateFullBody.tsx**: Character display for desktop "fighting" view
- **ComparePanelDesktop.tsx**: Detailed information panels with accordions
- **ComparePanelMobile.tsx**: Mobile-optimized comparison grid
- **CandidatePicker.tsx**: Character selection interface

#### Political Compass
- Dynamic SVG-based visualization
- Interactive candidate positioning
- Responsive scaling and touch support

### Key Custom Hooks

We encapsulate business logic and "Game Feel" mechanics in specialized hooks found in `src/hooks/`:

#### Game Logic
- **`useGameAPI`**: The primary "Service Layer". It manages:
  - `sessionId` generation and persistence.
  - `useNextPair`: Fetches the next two candidates to compare.
- **`useOptimisticVote`**: **Core UX Hook**. Implements "The Punch" philosophy.
  - Updates the vote count and UI state *immediately* (optimistically).
  - Sends the API request in the background.
  - Handles rollback if the server request fails.
- **`useGameKeyboard`**: Manages keyboard event listeners (Arrow keys) for desktop play, ensuring accessibility and triggering sound effects.
- **`useGameCompletion`**: Monitors session progress and triggers the "Game Over" / Results modal when the target vote count is reached.

#### Utilities
- **`useItemListSEO`**: Dynamically injects JSON-LD structured data for Search Engine Optimization.

## State Management

### Zustand Store Design

We use Zustand for global UI state that needs to be accessed across components but doesn't require complex reducer logic:

- **`useGameUIStore`**: Manages ephemeral UI state for the active game session:
  - `isInfoOpen`: Controls the candidate details overlay.
  - `reducedMotion`: Syncs with system accessibility settings.
- **`useCompareStore`**: Manages the pairing state in the "Compare" mode (who is Player 1 vs Player 2).

```tsx
// Example: Game UI Store
export const useGameUIStore = create<GameUIState>((set) => ({
  isInfoOpen: false,
  setInfoOpen: (isOpen) => set({ isInfoOpen: isOpen }),
  reducedMotion: false,
  // ...
}));
```

### State Management Principles

1. **Single Source of Truth**: Global state for candidate selection
2. **Immutable Updates**: All state changes create new objects
3. **Smart Selectors**: Logic for candidate slot assignment
4. **Minimal State**: Only store what can't be derived

### TanStack Query Integration

Used for any future server-side data fetching:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000,    // 10 minutes
    },
  },
});
```

## Server & API Architecture

The application uses Vercel Serverless Functions located in the `/api` directory. This acts as our backend layer, handling business logic and storage interactions.

### Endpoints (`/api`)

- **`POST /api/game/vote`**: 
  - Optimized for high-throughput write speed ("Fire-and-forget").
  - Validates session and candidate IDs.
  - Writes vote data to storage.
- **`GET /api/ranking/personal`**:
  - Replays the user's specific vote history.
  - Calculates dynamic ELO ratings on-the-fly.
  - Returns a personalized leaderboard.

### Storage Abstraction (`api/storage.ts`)

We implement a dual-mode storage strategy to facilitate easy development:

1.  **Development**: In-Memory `Map<>`.
    - Fast, zero setup required.
    - Data resets on server restart.
    - Prevents polluting production data with test votes.
2.  **Production**: Vercel Blob Storage.
    - Stores individual JSON files per vote for high concurrency.
    - Durable and auditable.

## Data Management

### Candidate Data Structure

The candidate model is comprehensive and type-safe:

```tsx
interface Candidate {
  id: string;
  nombre: string;
  ideologia: string;
  headshot: string;      // Profile image
  fullBody: string;      // Full character image
  
  proyectoPolitico: {    // Political platform
    titulo: string;
    resumen: string;
    detalles?: DetailSection[];
  };
  
  creenciasClave: Belief[];     // Key beliefs with sources
  trayectoria: Experience[];    // Political trajectory
  presenciaDigital: SocialMedia;
  mapaDePoder: PowerMapping;    // Political alliances
}
```

### Data Organization

- **Static Data**: Stored in `/src/data/` as TypeScript modules
- **Type Safety**: All data structures are typed
- **Source Attribution**: Links to evidence and sources
- **Internationalization Ready**: Structure supports multiple languages

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server

- **URL**: http://localhost:8080
- **Hot Module Replacement**: Instant updates during development
- **Error Overlay**: Clear error messages and stack traces

### Code Quality

#### ESLint Configuration
```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
)
```

### Git Workflow

1. **Feature Branches**: Create branches for each feature
2. **Commit Messages**: Use conventional commit format
3. **Pull Requests**: All changes go through PR review
4. **Continuous Integration**: Automated linting and building

## Code Organization

### File Naming Conventions

- **Components**: PascalCase (`CandidateAvatar.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCompareStore.ts`)
- **Utils**: camelCase (`utils.ts`)
- **Constants**: UPPER_SNAKE_CASE in files, camelCase files (`constants.ts`)

### Import Organization

```tsx
// External libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal utilities
import { cn } from '@/lib/utils';
import { UI_CLASSES } from '@/lib/constants';

// Components
import { Button } from '@/components/ui/button';
import { CandidateAvatar } from '@/components/candidate/CandidateAvatar';

// Types and data
import { Candidate } from '@/data/candidates';
```

### Absolute Imports

We use absolute imports with the `@/` alias:

```tsx
// ✅ Good
import { Button } from '@/components/ui/button';

// ❌ Avoid
import { Button } from '../../components/ui/button';
```

## Performance Considerations

### Code Splitting

#### Route-based Splitting
```tsx
// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
```

#### Manual Chunk Splitting
```javascript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
      'vendor-icons': ['react-icons', 'lucide-react'],
      'political-compass': ['src/components/political-compass/PoliticalCompass.tsx'],
    }
  }
}
```

### Image Optimization

- **Lazy Loading**: All images load lazily by default
- **Responsive Images**: Different sizes for different viewports
- **Format Optimization**: WebP with fallbacks

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/
```

## Load Testing & Performance

We treat performance as a core product feature. The application must adhere to strict "Game Feel" contracts to ensure the voting experience remains visceral and rhythmic.

### UX Performance Standards

| Experience | Definition | Metric (p95) | Rationale |
|------------|------------|--------------|-----------|
| **The Punch** | Instant feedback | < 100ms | Voting must feel visceral. Optimistic UI is required. |
| **The Flow** | Sustained rhythm | < 1000ms | Transitions must not break the user's "voting trance". |
| **The Reach** | Digital inclusion | < 3000ms | Functional on 3G Rural Peru networks (10Mbps/60ms). |

### Running Load Tests

The project uses [k6](https://k6.io/) for load testing.

#### Prerequisites
```bash
brew install k6  # macOS
# or
npm install -g k6
```

#### Available Scenarios

We have defined npm scripts for common testing scenarios:

| Script | Scenario | Users | Duration | Purpose |
|--------|----------|-------|----------|---------|
| `npm run loadtest:smoke` | Smoke Test | 5 | 1m | Quick sanity check |
| `npm run loadtest:baseline` | Baseline | 50 | 5m | Normal operating metrics |
| `npm run loadtest:peak` | Peak Load | 1k | 15m | Simulate election events |
| `npm run loadtest:stress` | Stress Test | 3k+ | 30m | Find breaking points |
| `npm run loadtest:peru` | **Peru Specific** | 50 | 5m | Test with Peru network profiles |

### Peru-Specific Network Profiling

To ensure "The Reach", use the Peru-specific test which simulates local network conditions (latency, bandwidth, packet loss).

```bash
# Test specific network profiles
NETWORK_PROFILE=urban npm run loadtest:peru      # Lima (4G Good)
NETWORK_PROFILE=rural npm run loadtest:peru      # Remote (3G Limited)
NETWORK_PROFILE=congested npm run loadtest:peru  # Peak Hours (7-10 PM)
```

See `load-tests/config.js` for the exact definitions of these network profiles.

---

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow React hooks rules
- Prefer composition over inheritance
- Write self-documenting code
- Add JSDoc for complex functions

### Testing (Future)

When adding tests, consider:
- Unit tests for utilities and hooks
- Component tests for UI components  
- Integration tests for user flows
- E2E tests for critical paths

---

*This documentation is a living document. Please update it as the codebase evolves.*