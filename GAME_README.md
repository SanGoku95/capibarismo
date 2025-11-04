# Ranking Game (Jugar)

This feature implements a pairwise comparison ranking game where users choose between two candidates to build a personalized ranking.

## Features

### Game Mechanics
- **Pairwise Comparisons**: Users choose between two candidates shown side-by-side
- **Elo Rating System**: Rankings calculated using Elo algorithm with uncertainty tracking
- **Smart Pair Selection**: 
  - 70% exploration (high uncertainty candidates)
  - 20% exploitation (close ratings)
  - 10% random
- **Session Tracking**: Anonymous sessions tracked via localStorage
- **Progress Indicator**: Visual progress toward ranking stability

### User Interface
- **VS Screen**: Fighting game aesthetic with full-body candidate images
- **Keyboard Controls**: 
  - `←` / `→`: Select left/right candidate
  - `ESC`: Close overlays
- **Mobile Optimized**: Responsive design, works great on mobile
- **Retro Effects**: Optional CRT/scanline effects (toggleable)
- **Reduced Motion**: Respects `prefers-reduced-motion`

### Anti-Abuse
- **Rate Limiting**: Max 30 votes per minute per session
- **Session Tracking**: Prevents duplicate votes on same pair
- **Vote Timestamps**: Tracked for spam detection

## Architecture

### Frontend (`/src`)
- **Pages**:
  - `JugarPage.tsx`: Main game interface
  - `RankingPage.tsx`: Global rankings display
- **Components** (`/src/components/game`):
  - `VSScreen.tsx`: Two-candidate comparison view
  - `CandidateCard.tsx`: Individual candidate display
  - `GameHUD.tsx`: Progress and stats display
  - `CandidateInfoOverlay.tsx`: Candidate details sheet
  - `CompletionModal.tsx`: Ranking completion dialog
- **Hooks** (`/src/hooks`):
  - `useGameAPI.ts`: TanStack Query hooks for API
- **Store** (`/src/store`):
  - `useGameUIStore.ts`: Zustand store for UI state

### Backend (`/api`)
- **Endpoints**:
  - `GET /api/game/state`: Get session statistics
  - `GET /api/game/nextpair`: Get next pair to compare
  - `POST /api/game/vote`: Submit a vote
  - `GET /api/ranking/global`: Get global rankings
  - `GET /api/candidate/[id]`: Get candidate data
- **Logic**:
  - `storage.ts`: In-memory data storage (replace with Redis for production)
  - `pair-selection.ts`: Pair selection algorithms
  - `candidates-data.ts`: Candidate data for API

## Development

### Local Development
**Note**: API endpoints won't work in local development with `npm run dev` because they're Vercel serverless functions. To test locally:

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel dev`

This will run both the Vite dev server and API endpoints.

### Production Deployment
When deployed to Vercel, the API endpoints will work automatically.

## Data Storage (MVP)

Currently uses in-memory storage which means:
- ✅ Fast and simple
- ❌ Data resets on deployment
- ❌ Not shared across serverless function instances

### Migration to Production Storage

For production, replace `/api/storage.ts` with a Redis or database implementation:

```typescript
// Example with Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export async function getRating(candidateId: string): Promise<Rating> {
  const key = `rating:${candidateId}`;
  const data = await redis.get(key);
  // ... rest of implementation
}
```

## Configuration

### Environment Variables
None required for MVP. For production with Redis:
- `REDIS_URL`: Redis connection URL
- `REDIS_TOKEN`: Redis authentication token

### vercel.json
API routes configured to bypass SPA rewrites:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Analytics Events

The game tracks these events (using Vercel Analytics):
- `home_jugar_click`: User clicks "Jugar" button
- More events can be added for game flow tracking

## Future Enhancements

1. **Persistent Storage**: Migrate to Redis/database
2. **Time Windows**: Implement 7d/1d ranking views
3. **Bradley-Terry**: Batch recalibration for more accurate global rankings
4. **Region/Party Filters**: Filter rankings by metadata
5. **Session Sharing**: Share personal ranking via URL
6. **Authentication**: Optional login for higher weight votes
7. **Leaderboards**: Show most active users
8. **Multiplayer**: Real-time head-to-head matches

## Testing

To test the game flow:
1. Navigate to `/jugar`
2. Click on candidates or use keyboard arrows
3. Complete ~15 comparisons to see progress
4. View `/ranking` for global results

## Security Considerations

- Session IDs stored in localStorage (client-side)
- User agent hashed for anonymization
- Rate limiting prevents spam
- No PII collected
- CORS configured for API endpoints
