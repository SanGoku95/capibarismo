# Quick Start Guide

Get the Survey Extractor service running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- API keys ready (Mistral, OpenAI, Neon database)

## 1. Install Dependencies

```bash
cd services/surveys
pnpm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
MISTRAL_API_KEY=your-mistral-key
OPENAI_API_KEY=sk-proj-your-openai-key
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require
AUTH_TOKEN=your-secret-token
PORT=3001
NODE_ENV=development
```

## 3. Set Up Database

```bash
pnpm db:push
```

## 4. Start Server

```bash
pnpm dev
```

You should see:
```
ℹ️  server running [url=http://localhost:3001]
ℹ️  api docs available [url=http://localhost:3001/docs]
```

## 5. Test API

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","service":"capibarismo-survey-extractor","timestamp":"..."}
```

## 6. View API Documentation

Open in browser: **http://localhost:3001/docs**

## Next Steps

- **List surveys**: `GET /api/surveys` (public endpoint)
- **Process a survey**: `POST /api/surveys/{source}/process` where `{source}` is `ipsos`, `datum`, or `cpi` (requires `Authorization` header)
- **Detailed setup**: [SETUP.md](SETUP.md)
- **Development guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Common Commands

```bash
pnpm dev              # Start dev server with auto-reload
pnpm build            # Build for production
pnpm db:studio        # Open database GUI
pnpm db:generate      # Generate new migration
pnpm db:migrate       # Run migrations
```

## Need Help?

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Review [SETUP.md](SETUP.md) for detailed setup instructions
- See [README.md](README.md) for architecture overview
