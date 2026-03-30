# Setup Guide

Complete step-by-step guide to set up the Survey Extractor service from scratch.

## Prerequisites

- **Node.js**: 20.x or higher ([Download](https://nodejs.org/))
- **pnpm**: Package manager ([Install](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Neon Account**: PostgreSQL database ([Sign up](https://neon.tech))
- **Mistral API Key**: For PDF OCR ([Get API key](https://console.mistral.ai/))
- **OpenAI API Key**: For text-to-JSON conversion ([Get API key](https://platform.openai.com/api-keys))

## Step 1: Clone and Install

```bash
# Navigate to the surveys service directory
cd services/surveys

# Install dependencies
pnpm install
```

**Expected output:**
```
dependencies:
+ @mistralai/mistralai 1.14.1
+ @neondatabase/serverless 0.10.4
+ drizzle-orm 0.37.0
...
Done in 5s
```

## Step 2: Set Up Neon Database

### 2.1 Create Neon Project

1. Go to [Neon Console](https://console.neon.tech)
2. Click **"New Project"**
3. Configure:
   - **Name**: `capibarismo-surveys` (or your preference)
   - **Region**: Choose closest to your location
   - **PostgreSQL Version**: 16 (default)
4. Click **"Create Project"**

### 2.2 Get Connection String

1. In your project dashboard, click **"Connection Details"**
2. Copy the connection string (should look like):
   ```
   postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require
   ```
3. Save this for the next step

## Step 3: Configure Environment Variables

### 3.1 Copy Environment Template

```bash
cp .env.example .env
```

### 3.2 Fill in Environment Variables

Open `.env` and replace placeholder values:

```bash
# AI API Configuration
MISTRAL_API_KEY=your-actual-mistral-api-key-here
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require

# Authentication
AUTH_TOKEN=your-secret-token-here

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Important**:
- Never commit `.env` to version control (it's in `.gitignore`)
- Use real API keys (not the example placeholders)
- Ensure `DATABASE_URL` includes `?sslmode=require`

## Step 4: Set Up Database Schema

You have two options:

### Option A: Using Migrations (Recommended for Production)

```bash
# 1. Generate migration files (if not already present)
pnpm db:generate

# 2. Apply migrations to database
pnpm db:migrate
```

**Expected output:**
```
Running migrations...
Migrations completed!
```

### Option B: Push Schema Directly (Quick for Development)

```bash
pnpm db:push
```

**Expected output:**
```
[✓] Pushing schema...
[✓] Done!
```

### 4.1 Verify Database Setup

Open Drizzle Studio to inspect your database:

```bash
pnpm db:studio
```

This opens a GUI at `https://local.drizzle.studio`. You should see:
- `surveys` table (7 columns)
- `pdf_extracts` table (4 columns)

## Step 5: Start Development Server

```bash
pnpm dev
```

**Expected output:**
```
ℹ️  server running [url=http://localhost:3001]
ℹ️  api docs available [url=http://localhost:3001/docs]
```

## Step 6: Verify Installation

### 6.1 Health Check

```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "capibarismo-survey-extractor",
  "timestamp": "2026-02-28T12:00:00.000Z"
}
```

### 6.2 API Documentation

Open browser: http://localhost:3001/docs

You should see Scalar API documentation with:
- `GET /api/surveys` - List all processed surveys (paginated)
- `POST /api/surveys/{source}/process` - Extract survey data from PDF (requires authentication)
  - `{source}` can be `ipsos`, `datum`, or `cpi`
- `GET /health` - Health check endpoint

### 6.3 Test List Endpoint (Optional)

```bash
curl http://localhost:3001/api/surveys?page=1&pageSize=10
```

**Expected response:**
```json
{
  "success": true,
  "data": [],
  "total": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
```

### 6.4 Test Extraction (Optional)

```bash
curl -X POST http://localhost:3001/api/surveys/ipsos/process \
  -H "Authorization: Bearer your-secret-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://example.com/test-survey.pdf"
  }'
```

**Note**: This requires:
- A valid PDF URL from a supported source (IPSOS, Datum, or CPI)
- Replace `ipsos` in the URL with `datum` or `cpi` for other sources
- The `AUTH_TOKEN` value set in your `.env` file

See [DEVELOPMENT.md](DEVELOPMENT.md) for testing strategies.

## Troubleshooting

### Issue: `DATABASE_URL environment variable not set`

**Solution**: Ensure `.env` file exists and contains `DATABASE_URL`

```bash
# Verify .env exists
ls -la .env

# Check content
cat .env | grep DATABASE_URL
```

### Issue: `MISTRAL_API_KEY environment variable not set`

**Solution**: Add valid Mistral API key to `.env`

Get your key: https://console.mistral.ai/

### Issue: `pnpm: command not found`

**Solution**: Install pnpm globally

```bash
npm install -g pnpm
```

### Issue: Database connection timeout

**Solutions**:
1. Check Neon dashboard - ensure database is not suspended
2. Verify connection string format includes `?sslmode=require`
3. Check firewall/network settings
4. Try from Neon console directly:
   ```bash
   psql "postgresql://username:password@ep-xxx.region.neon.tech/dbname?sslmode=require"
   ```

### Issue: Port 3001 already in use

**Solution**: Change port in `.env`

```bash
PORT=3002
```

Then restart server.

### Issue: TypeScript errors after install

**Solution**: Ensure Node.js version is 20.x or higher

```bash
node -v  # Should show v20.x.x or higher
```

If older, update Node.js: https://nodejs.org/

## Next Steps

Once setup is complete:

1. **Read the API Documentation**: http://localhost:3001/docs
2. **Review Development Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
3. **Understand the Architecture**: [README.md](README.md#architecture)
4. **Test with Real Data**: See [TESTING.md](TESTING.md) (if available)

## Quick Reference

```bash
# Common commands
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Run production build

# Database commands
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema (dev only)
pnpm db:studio        # Open Drizzle Studio

# Check versions
node -v               # Node.js version
pnpm -v               # pnpm version
```

## Support

- **Issues**: Report bugs at GitHub Issues
- **Documentation**: See [README.md](README.md)
- **API Reference**: http://localhost:3001/docs (when running)
