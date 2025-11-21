# Deployment Guide

## Quick Start

### 1. Vercel Blob Storage Setup

The ranking game uses Vercel Blob for persistent storage. This is automatically configured when you deploy to Vercel.

```bash
# Deploy to Vercel
vercel deploy --prod
```

Vercel will automatically:
- Create a Blob store for your project
- Add the `BLOB_READ_WRITE_TOKEN` environment variable
- Enable blob storage for all serverless functions

### 2. Verify Deployment

After deployment, verify the game works:

1. Visit `https://your-domain.com/jugar`
2. Make a few votes
3. Check `https://your-domain.com/ranking` to see global rankings
4. Votes should persist across page refreshes

### 3. Monitor Storage

View your blob storage usage in the Vercel dashboard:
- Go to your project
- Click on "Storage" tab
- See all stored blobs under `rankings/`

## Local Development

### Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables (including blob token)
vercel env pull

# Start development server
vercel dev
```

This will:
- Run Vite dev server
- Enable API endpoints
- Use Vercel Blob storage (requires internet)

### Using npm dev (Frontend only)

```bash
npm run dev
```

This runs only the frontend. API endpoints won't work.

## Storage Structure

The game stores data in Vercel Blob:

```
rankings/
├── ratings.json              # All candidate Elo ratings
├── outcomes.json             # All pairwise vote outcomes
└── sessions/
    ├── {sessionId}.json      # Pairs seen by each session
    └── {sessionId}-votes.json # Rate limiting data
```

## Configuration Files

### vercel.json
- Configures Vercel deployment
- Sets up API function runtime and duration
- Adds CORS headers for API endpoints

### vite.config.ts
- Configures Vite build
- Sets up code splitting for optimal bundle sizes
- Configures path aliases

### tsconfig.json
- TypeScript configuration
- References separate configs for app, node, and API

## Scaling Considerations

### Current Setup (Good for MVP)
- Blob storage with 30s cache
- Random pair selection
- Simple rate limiting

### Future Optimizations
1. **Redis Cache**: Add Redis for faster reads
2. **Database**: Move to PostgreSQL for complex queries
3. **Smart Pair Selection**: Re-enable uncertainty and close-rating strategies
4. **Batch Updates**: Combine multiple rating updates

## Troubleshooting

### API endpoints return 500
- Check Vercel logs for error messages
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Ensure blob store is created

### Data not persisting
- Verify deployment has blob storage enabled
- Check Vercel dashboard > Storage tab
- Try redeploying with `vercel deploy --prod`

### Rate limiting too strict
- Adjust `maxVotesPerMinute` in `api/storage.ts`
- Current default: 30 votes per minute

## Support

For issues specific to:
- **Blob Storage**: Check Vercel Blob documentation
- **Deployment**: Check Vercel deployment logs
- **Game Logic**: See `GAME_README.md`
