# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Capibarismo** is a civic engagement platform for Peru's presidential elections that gamifies candidate comparison using a 90s fighting game aesthetic. Users vote in 1v1 candidate matchups to build personal rankings and explore detailed candidate information.

**Core Philosophy: "Game Feel"**
- **The Punch** (<100ms): Voting must feel instant and visceral (requires optimistic UI updates)
- **The Flow** (<1s): Transitions must maintain user engagement without interruption
- **The Reach**: Optimized for 3G networks in rural Peru (high latency tolerance)

## Common Commands

### Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server at http://localhost:8080
npm run build            # Production build (validates data, generates sitemap)
npm run build:dev        # Development build (for testing)
npm run preview          # Preview production build locally
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking (no emit)
npm test                 # Run Vitest tests
npm test:watch           # Watch mode for tests
npm test:coverage        # Generate coverage report
npm test:ui              # Visual test UI
```

### Load Testing
```bash
npm run loadtest:smoke           # Quick test (5 users, 1 min)
npm run loadtest:baseline        # Normal load (10-50 users, 5 min)
npm run loadtest:peak            # Peak traffic simulation (1k users, 15 min)
npm run loadtest:peru            # Peru-specific network profiles

# Test specific network conditions
NETWORK_PROFILE=rural npm run loadtest:peru      # 3G rural
NETWORK_PROFILE=urban npm run loadtest:peru      # 4G urban
NETWORK_PROFILE=congested npm run loadtest:peru  # Peak hours
```

### Data & Validation
```bash
npm run generate:sitemap     # Generate sitemap.xml
tsx scripts/validate-data.ts # Validate candidate data structure
```

## Architecture Overview

### Frontend Stack
- **React 18** + **TypeScript** + **Vite** (with SWC for fast refresh)
- **Routing**: React Router with lazy-loaded pages
- **State Management**:
  - Zustand for UI state (`useGameUIStore`, `useCompareStore`)
  - TanStack Query for API calls (with aggressive caching)
  - localStorage/sessionStorage for session persistence
- **Styling**: Tailwind CSS + shadcn/ui components
- **Analytics**: PostHog (optional, graceful degradation if not configured)

### Backend (Vercel Serverless)
Located in `/api/` directory:
- **POST /api/game/vote** - Records user votes (fire-and-forget, optimized for write throughput)
- **GET /api/ranking/personal** - Calculates personalized rankings from vote history
- **Storage**: Dual adapter pattern (in-memory for dev, Vercel Blob for production)

### Key Directories
```
/api/                  # Vercel serverless functions
/src/
  /pages/              # Route-level components (lazy-loaded)
  /components/         # Feature-organized UI components
    /game/             # Core voting experience (VSScreen, CandidateCard, etc.)
    /compare/          # Side-by-side comparison tool
    /political-compass/ # 2D political visualization
    /ui/               # shadcn/ui design system primitives
  /hooks/              # Custom React hooks (game logic, API integration)
  /store/              # Zustand state stores
  /services/           # Business logic (session management, pair generation)
  /data/               # Candidate data and type definitions
    /domains/          # Structured candidate information (education, income, etc.)
  /lib/                # Utilities, constants, helpers
/scripts/              # Build and validation scripts
/load-tests/           # k6 performance test scenarios
```

## Critical Architectural Patterns

### 1. Optimistic UI Updates
**Location**: `src/hooks/useOptimisticVote.ts`

Votes must feel instant (<100ms "The Punch"). The hook:
1. Immediately increments local vote count
2. Fires async API mutation (doesn't wait)
3. Rolls back on error with user notification

When working with vote functionality, never introduce blocking await calls that delay UI feedback.

### 2. Session Management (Factory Pattern)
**Location**: `src/services/sessionService.ts`

Uses dependency injection for testability:
```typescript
createSessionService(localStorage, sessionStorage)
```

Manages:
- Session ID (nanoid-based, persisted across page loads)
- Vote count tracking
- Seen pairs (prevents duplicate matchups)
- Local Elo ratings (for smart pair selection)
- Candidate appearance tracking

When testing, inject mock storage adapters rather than mocking individual functions.

### 3. Smart Pair Generation Algorithm
**Location**: `src/services/pairGenerationService.ts`

Four-tier fallback strategy:
1. **Coverage Phase**: Prioritize unseen candidates (fair exposure)
2. **Adaptive Phase**: Match candidates with similar Elo ratings (better discrimination)
3. **Random Pairing**: Exploratory matchups
4. **Fallback**: Guaranteed pair generation, resets seen pairs if exhausted

When modifying, preserve the fallback chain to prevent infinite loops.

### 4. Dual Storage Adapters
**Location**: `api/storage.ts`

- **Development**: In-memory Map (fast, zero config, resets on restart)
- **Production**: Vercel Blob Storage (durable, one JSON file per vote)

Environment variables:
- `BLOB_READ_WRITE_TOKEN` (required for production)
- `VITE_USE_API` (toggle mock data in frontend)

### 5. Normalized Pair IDs
Used throughout codebase to prevent duplicate directional pairs:
```typescript
createPairId(aId, bId) → [aId, bId].sort().join('-')
```
This ensures "candidate-A vs candidate-B" = "candidate-B vs candidate-A"

### 6. Component Composition
Components follow shadcn/ui patterns:
```tsx
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

Prefer composition over prop drilling. Use Zustand stores for cross-component state rather than passing callbacks through multiple layers.

## Development Workflows

### Adding New Candidates

1. Add candidate data to `/src/data/domains/base.ts`
2. Add supplementary data to domain files (education, income, etc.)
3. Add profile images to `/public/candidates/`
   - `{id}-headshot.webp` (profile photo)
   - `{id}-fullbody.webp` (optional, for fighting game view)
4. Run `tsx scripts/validate-data.ts` to ensure data integrity
5. Political compass positions in `/src/data/domains/compass.ts`

### Modifying Game Logic

**Critical files**:
- `src/hooks/useGameAPI.ts` - Pair fetching
- `src/hooks/useOptimisticVote.ts` - Vote submission
- `src/services/pairGenerationService.ts` - Smart pairing algorithm
- `src/lib/gameConstants.ts` - Tunable parameters

**Important constants** (in `gameConstants.ts`):
```typescript
PRELIMINARY_GOAL = 15    // First completion tier
RECOMMENDED_GOAL = 30    // Second completion tier
ELO_K = 32              // Rating change sensitivity
INITIAL_ELO = 1200      // Starting rating
```

### Working with State

**UI State** (Zustand):
- `useGameUIStore` - Modal visibility, preferences, completion state
- `useCompareStore` - Comparison tool candidate selection

**Persisted State** (via sessionService):
- Vote count, seen pairs, local Elo ratings (localStorage)
- Completion tier shown (sessionStorage)

**Server State** (TanStack Query):
- Candidate pairs, ranking data
- Aggressive caching (5min stale time)

### Testing Strategy

**Unit Tests**: Hooks, services, utilities
**Component Tests**: React Testing Library
**Load Tests**: k6 scripts in `/load-tests/`

Mock setup in `src/test/setup.ts` handles:
- `window.matchMedia()` for responsive behavior
- `IntersectionObserver` for lazy loading

When writing tests for session logic, use the factory pattern:
```typescript
const mockStorage = createMockStorage();
const service = createSessionService(mockStorage, mockStorage);
```

### Performance Considerations

**Code Splitting**:
- Pages are lazy-loaded via React.lazy()
- Manual chunks configured in `vite.config.ts` for vendor libraries
- Political compass is split into separate chunk (large SVG library)

**Image Optimization**:
- Use WebP format for all candidate images
- Lazy load images (built-in browser loading="lazy")
- Preload images for next pair while current pair is displayed

**Bundle Analysis**:
```bash
npm run build
npx vite-bundle-analyzer dist/
```

## Environment Variables

See `ENVIRONMENT.md` for detailed configuration guide.

**Development** (`.env.local`):
```bash
VITE_USE_API=false           # Use mock data (no API calls)
VITE_POSTHOG_KEY=            # Optional: analytics
USE_PROD_API=true            # Optional: proxy to production API
```

**Production** (Vercel Dashboard):
```bash
VITE_POSTHOG_KEY=phc_xxx     # PostHog analytics key
BLOB_READ_WRITE_TOKEN=xxx    # Required: Vercel Blob storage
```

**Important**: `VITE_*` variables are embedded in client bundle (public). Never put secrets in them.

## Facts Protocol (Data Integrity)

This project follows strict fact verification standards:

1. **All candidate data must be traceable to primary sources**
2. **Sources documented in** `/src/data/candidateSources.ts`
3. **Official JNE data preferred** (Jurado Nacional de Elecciones)
4. When adding/modifying candidate information:
   - Include source URLs
   - Add verification timestamps
   - Cite official documents when available
   - Flag unverified claims clearly

## Code Style Conventions

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Services: `camelCase.ts`
- Types: `types.ts` or `camelCase.ts`

### Import Order
1. External libraries (React, etc.)
2. Internal utilities (`@/lib/...`)
3. Components (`@/components/...`)
4. Types and data (`@/data/...`)

### TypeScript
- Use `@/` alias for absolute imports (configured in tsconfig)
- Strict mode disabled (`strictNullChecks: false`)
- Prefer interfaces for public APIs, types for unions/intersections

### Component Patterns
- Use `cn()` utility for conditional Tailwind classes
- Destructure props with defaults
- Export named components (not default exports for components)
- Colocate component-specific utilities in same file

## Git Workflow

**Branch naming**:
- `feature/description` for new features
- `fix/description` for bug fixes
- `refactor/description` for code improvements

**Commit messages**: Use conventional format
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `docs:` - Documentation
- `test:` - Testing
- `perf:` - Performance improvements

**Pre-commit hooks** (Husky):
- Data validation runs on pre-commit
- Build must succeed before push

## Deployment

**Platform**: Vercel

**Build configuration** (`vercel.json`):
- Rewrites `/api/*` to serverless functions
- Single-page app fallback to `index.html`

**Build process**:
1. Data validation (`scripts/validate-data.ts`)
2. Sitemap generation (`scripts/generate-sitemap.js`)
3. Vite production build
4. Deploy to Vercel

**Environment setup**:
- Set `BLOB_READ_WRITE_TOKEN` in Vercel dashboard (required)
- Set `VITE_POSTHOG_KEY` for analytics (optional)
- Node.js 20.x required (specified in package.json engines)

## Troubleshooting Common Issues

### Development server won't start
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: `node -v` (should be 20.x)
- Port conflict: `npm run dev -- --port 3000`

### API routes failing locally
- Set `USE_PROD_API=true` in `.env.local` to proxy to production
- Or set `BLOB_READ_WRITE_TOKEN` for local Blob storage testing

### Tests failing
- Ensure `jsdom` environment is configured in `vitest.config.ts`
- Check that mocks in `src/test/setup.ts` are loaded
- Clear test cache: `npx vitest --clearCache`

### Build failing
- Run `tsx scripts/validate-data.ts` to check candidate data
- Check for TypeScript errors: `npm run typecheck`
- Verify all images referenced in data exist in `/public/candidates/`

### Performance degradation
- Run load tests: `npm run loadtest:smoke`
- Check bundle size: Build and analyze with `vite-bundle-analyzer`
- Verify lazy loading is working: Check Network tab in DevTools
- Ensure optimistic updates aren't awaiting API responses

## Additional Documentation

- `README.md` - Project overview and quick start
- `ENVIRONMENT.md` - Environment variables reference
- `dev.md` - Comprehensive developer documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/load-testing.md` - Load testing strategy
- `CODE_OF_CONDUCT.md` - Facts protocol and community guidelines
