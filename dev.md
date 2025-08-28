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

### Component Organization

```
src/components/
├── ui/                 # Base design system components (shadcn/ui)
├── candidate/          # Candidate-specific components
├── compare/            # Comparison functionality
├── political-compass/  # Political positioning visualization
├── events/            # News and events display
├── layout/            # Layout and navigation components
├── common/            # Shared utilities and components
└── marketing/         # Landing page components
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

## State Management

### Zustand Store Design

We use Zustand for its simplicity and minimal boilerplate:

```tsx
interface CompareState {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  setLeftCandidate: (candidate: Candidate | null) => void;
  setRightCandidate: (candidate: Candidate | null) => void;
  selectCandidate: (candidate: Candidate) => void; // Smart selection logic
}
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

## Deployment

### Build Process

```bash
# Production build
npm run build

# Development build with source maps
npm run build:dev
```

### Environment Configuration

Create `.env` files for different environments:

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false

# .env.production
VITE_API_URL=https://api.presidentialpunch.pe
VITE_ENABLE_ANALYTICS=true
```

### Static Hosting

The app is built as a static SPA and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── [component]-[hash].js
└── images/
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Issue**: TypeScript errors during build
```bash
error TS2307: Cannot find module '@/components/ui/button'
```

**Solution**: Check absolute import configuration in `vite.config.ts` and `tsconfig.json`

#### 2. Hot Reload Not Working

**Issue**: Changes not reflecting in browser

**Solutions**:
- Check if files are saved
- Restart dev server
- Clear browser cache
- Check for syntax errors

#### 3. Style Issues

**Issue**: Tailwind classes not applying

**Solutions**:
- Verify Tailwind CSS is imported in `src/index.css`
- Check if custom CSS variables are defined
- Inspect element to see if classes are being purged

### Development Tools

#### Browser Extensions
- React Developer Tools
- TanStack Query DevTools
- Tailwind CSS IntelliSense (VS Code)

#### VS Code Setup

Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer

### Performance Monitoring

Monitor bundle sizes and performance:

```bash
# Check bundle size
npm run build
ls -la dist/assets/

# Lighthouse audit
npx lighthouse http://localhost:8080 --view
```

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