# Ranking Game (Jugar)

This feature implements a high-performance pairwise comparison game where users choose between two candidates to build a personalized ranking.

## ⚡ Key Features

### Performance & UX
- **Optimistic UI**: The interface updates instantly (0ms latency) by calculating results locally while syncing with the server in the background.
- **Background Sync**: Uses Vercel's `waitUntil` pattern to handle storage operations without blocking the user.
- **Local Pair Generation**: The client generates new pairs instantly without waiting for a server roundtrip.

### Game Mechanics
- **Pairwise Comparisons**: Users choose between two candidates shown side-by-side.
- **Elo Rating System**: 
  - **Server**: Calculates precise ratings using full history.
  - **Client**: Approximates ratings for immediate HUD feedback.
- **Smart History**: Tracks "seen pairs" locally to prevent repeating comparisons in the same session.
- **Session Tracking**: Anonymous sessions tracked via `localStorage` and synced to the cloud.

### User Interface
- **VS Screen**: Fighting game aesthetic with full-body candidate images.
- **Keyboard Controls**: 
  - `←` / `→`: Select left/right candidate.
  - `ESC`: Close overlays.
- **Retro Effects**: Optional CRT/scanline effects (toggleable).
- **Accessibility**: Respects `prefers-reduced-motion`.

## 🏗️ Architecture

### Frontend (`/src`)
The game uses a **Local-First** approach to ensure responsiveness.

- **State Management**: 
  - `useGameAPI.ts`: Manages game logic. Uses **TanStack Query** for optimistic updates.
  - `useGameUIStore.ts`: **Zustand** store for UI preferences (effects, modals).
- **Components**:
  - `VSScreen.tsx`: Main comparison view.
  - `GameHUD.tsx`: Real-time progress bar and win counter.
  - `CandidateInfoOverlay.tsx`: Detailed candidate stats.

### Backend (`/api`)
Serverless functions optimized for Vercel.

- **Endpoints**:
  - `POST /api/game/vote`: **Fire-and-forget**. Receives vote, returns 200 OK immediately, saves to Blob storage in background.
  - `GET /api/game/state`: Calculates full session statistics (comparisons, progress) from storage.
  - `GET /api/ranking/global`: Aggregates global rankings.
- **Storage Strategy (Inbox Pattern)**:
  - Uses **Vercel Blob** for persistence.
  - **Writes**: Saves individual vote files to `inbox/` to prevent write conflicts during rapid voting.
  - **Reads**: Aggregates user history from `sessions/{id}.json`.

## 💾 Data Storage

The project uses **Vercel Blob** as a serverless file system.

| Data Type | Path | Description |
|-----------|------|-------------|
| **User History** | `sessions/{sessionId}.json` | Array of all votes by a user. |
| **Vote Inbox** | `inbox/{timestamp}-{id}.json` | Individual votes for global aggregation. |
| **Global Stats** | `global/ratings-snapshot.json` | Pre-calculated global rankings (cached). |

## 🛠️ Development

### Local Development
**Note**: API endpoints require Vercel credentials.

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Run dev server: `vercel dev`

### Configuration
- `BLOB_READ_WRITE_TOKEN`: Required for storage (automatically set on Vercel).

## 📊 Analytics & Limits

- **Rate Limiting**: The API handles rapid-fire voting via the Inbox pattern, but client-side logic prevents accidental double-taps.
- **Progress**: The game targets **20 comparisons** as the "completion" threshold for a stable ranking.
