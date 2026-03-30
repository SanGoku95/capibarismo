# Troubleshooting Guide

Common issues and solutions for the Survey Extractor service.

## Table of Contents

- [Environment Setup Issues](#environment-setup-issues)
- [Database Issues](#database-issues)
- [API Issues](#api-issues)
- [AI Service Issues](#ai-service-issues)
- [Build & Deployment Issues](#build--deployment-issues)

## Environment Setup Issues

### Error: `DATABASE_URL environment variable not set`

**Cause**: Missing or incorrectly loaded `.env` file

**Solutions**:

1. **Verify `.env` file exists**:
   ```bash
   ls -la .env
   ```

2. **Check file content**:
   ```bash
   cat .env | grep DATABASE_URL
   ```

3. **Ensure proper format**:
   ```bash
   DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
   ```
   (No spaces around `=`, no quotes unless value contains spaces)

4. **Restart server** after editing `.env`:
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

### Error: `MISTRAL_API_KEY environment variable not set`

**Cause**: Missing Mistral API key

**Solution**:

1. Get API key from https://console.mistral.ai/
2. Add to `.env`:
   ```bash
   MISTRAL_API_KEY=your-actual-key-here
   ```
3. Restart server

### Error: `OPENAI_API_KEY environment variable not set`

**Cause**: Missing OpenAI API key

**Solution**:

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
3. Restart server

### Error: `Cannot find module '@/...`

**Cause**: TypeScript path alias not resolved

**Solutions**:

1. **Check `tsconfig.json` has paths configured**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Restart TypeScript server** (if using VS Code):
   - Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

3. **Clear build cache**:
   ```bash
   rm -rf dist/
   pnpm build
   ```

### Error: `pnpm: command not found`

**Cause**: pnpm not installed globally

**Solution**:

```bash
npm install -g pnpm

# Verify installation
pnpm -v
```

Alternative: Use npx:
```bash
npx pnpm install
npx pnpm dev
```

## Database Issues

### Error: Connection timeout / Cannot connect to database

**Causes & Solutions**:

1. **Database suspended (Neon)**:
   - Go to Neon console
   - Check if project is active
   - If suspended, click to wake it up

2. **Wrong connection string**:
   - Verify format: `postgresql://user:pass@host.neon.tech/db?sslmode=require`
   - Ensure `?sslmode=require` is present
   - Check username/password for special characters (URL-encode if needed)

3. **Network/firewall issues**:
   ```bash
   # Test connectivity
   ping ep-xxx.region.neon.tech

   # Test PostgreSQL connection
   psql "$DATABASE_URL" -c "SELECT 1;"
   ```

4. **SSL/TLS issues**:
   - Ensure `?sslmode=require` in connection string
   - Update PostgreSQL client libraries:
     ```bash
     pnpm update @neondatabase/serverless
     ```

### Error: `relation "surveys" does not exist`

**Cause**: Database schema not created

**Solution**:

```bash
# Option 1: Run migrations
pnpm db:migrate

# Option 2: Push schema directly
pnpm db:push

# Verify tables exist
pnpm db:studio
```

### Error: Migration fails with "already exists"

**Cause**: Trying to re-run applied migration

**Solutions**:

1. **Check migration status**:
   ```sql
   SELECT * FROM drizzle_migrations;
   ```

2. **Skip to push schema directly**:
   ```bash
   pnpm db:push
   ```

3. **Reset database** (⚠️ destroys data):
   ```bash
   # Drop all tables via Neon console or psql
   psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

   # Recreate schema
   pnpm db:push
   ```

### Error: `duplicate key value violates unique constraint`

**Cause**: Trying to insert duplicate data

**Context**: `pdf_extracts` table has unique constraint on `source_url`

**Expected Behavior**: This is normal - the repository uses `onConflictDoUpdate` to handle duplicates

**If error persists**:
1. Check `PostgrePDFExtractRepository.save()` method has `.onConflictDoUpdate()`
2. Verify schema has unique constraint:
   ```sql
   SELECT constraint_name, constraint_type
   FROM information_schema.table_constraints
   WHERE table_name = 'pdf_extracts';
   ```

## API Issues

### Error: `Cannot POST /api/surveys/ipsos/process`

**Causes & Solutions**:

1. **Server not running**:
   ```bash
   pnpm dev
   ```

2. **Wrong URL**:
   ```bash
   # ✅ Correct
   POST http://localhost:3001/api/surveys/ipsos/process

   # ❌ Wrong
   POST http://localhost:3001/surveys/ipsos/process  # Missing /api
   POST http://localhost:3001/api/survey/ipsos/process  # survey not surveys
   ```

3. **Wrong HTTP method**:
   ```bash
   # ✅ Correct
   curl -X POST ...

   # ❌ Wrong
   curl -X GET ...
   ```

### Error: `pdfUrl is required in request body`

**Cause**: Missing or incorrect request body

**Solutions**:

1. **Ensure Content-Type header**:
   ```bash
   curl -X POST http://localhost:3001/api/surveys/ipsos/process \
     -H "Content-Type: application/json" \
     -d '{"pdfUrl": "https://example.com/survey.pdf"}'
   ```

2. **Verify JSON is valid**:
   ```bash
   # ✅ Valid JSON
   {"pdfUrl": "https://example.com/test.pdf"}

   # ❌ Invalid (missing quotes)
   {pdfUrl: "https://example.com/test.pdf"}
   ```

3. **Check field name** (case-sensitive):
   ```bash
   # ✅ Correct
   {"pdfUrl": "..."}

   # ❌ Wrong
   {"pdfurl": "..."}
   {"pdf_url": "..."}
   ```

### Error: `Unsupported source: xyz`

**Cause**: Invalid source parameter

**Solution**:

Currently only `ipsos` is supported:
```bash
# ✅ Correct
POST /api/surveys/ipsos/process

# ❌ Wrong
POST /api/surveys/datum/process  # Not yet implemented
POST /api/surveys/cpi/process    # Not yet implemented
```

To add new sources, see [DEVELOPMENT.md#adding-a-new-survey-source](DEVELOPMENT.md#adding-a-new-survey-source)

### Error: 500 Internal Server Error

**Diagnosis**:

1. **Check server logs** for error details
2. **Check response body**:
   ```bash
   curl -v -X POST ... | jq
   ```

**Common causes**:

1. **AI API error**: Check API keys and quota
2. **Invalid PDF URL**: Ensure URL is accessible
3. **Validation error**: Check data matches Zod schema

## AI Service Issues

### Error: `Failed to extract text from PDF`

**Causes & Solutions**:

1. **Invalid Mistral API key**:
   - Verify key at https://console.mistral.ai/
   - Check key in `.env` is correct
   - Ensure key has not expired

2. **PDF URL not accessible**:
   ```bash
   # Test URL accessibility
   curl -I "https://example.com/survey.pdf"
   ```

3. **PDF too large**:
   - Mistral has file size limits
   - Consider splitting large PDFs
   - Check Mistral API docs for current limits

4. **API rate limit**:
   - Wait and retry
   - Check Mistral dashboard for rate limits
   - Implement exponential backoff

### Error: `Failed to convert text to JSON`

**Causes & Solutions**:

1. **Invalid OpenAI API key**:
   - Verify key at https://platform.openai.com/api-keys
   - Check billing is active
   - Ensure key has GPT-4 access

2. **Insufficient credits**:
   - Check billing at OpenAI dashboard
   - Add payment method
   - Top up credits

3. **Model not available**:
   - Check if using correct model name
   - Verify account has access to GPT-4

4. **Extraction timeout**:
   - Large PDFs may take longer
   - Consider increasing timeout
   - Split into smaller chunks

### Error: Zod validation fails

**Cause**: Extracted data doesn't match schema

**Diagnosis**:

1. **Check validation error**:
   ```typescript
   try {
     ipsosSchemaSimple.parse(structuredData);
   } catch (error) {
     console.log(error.errors); // Detailed validation errors
   }
   ```

2. **Inspect raw AI response**:
   - Add debug logging in `TextToJsonService`
   - Check if AI returned correct structure

**Solutions**:

1. **Update prompt** in `buildExtractionPrompt()` to be more specific
2. **Update schema** if data structure changed
3. **Add data transformation** before validation

## Build & Deployment Issues

### Error: TypeScript compilation fails

**Solutions**:

1. **Check for type errors**:
   ```bash
   pnpm build
   ```

2. **Ensure all types are correct**:
   - Check `@types/*` packages are installed
   - Verify imports have `.js` extension (ES modules)

3. **Clear build cache**:
   ```bash
   rm -rf dist/ *.tsbuildinfo
   pnpm build
   ```

### Error: Production build crashes on startup

**Diagnosis**:

```bash
NODE_ENV=production pnpm start
```

**Common issues**:

1. **Missing environment variables**:
   - Ensure production `.env` has all required vars
   - Check for hardcoded `development` values

2. **Database connection**:
   - Verify production `DATABASE_URL`
   - Check firewall rules for production environment

3. **Missing dependencies**:
   ```bash
   pnpm install --prod
   ```

### Error: Port already in use

**Solution**:

1. **Change port in `.env`**:
   ```bash
   PORT=3002
   ```

2. **Kill process using port**:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:3001 | xargs kill -9
   ```

## Performance Issues

### Slow PDF extraction

**Solutions**:

1. **Check cache is working**:
   - Look for "using cached pdf extract" in logs
   - Verify `pdf_extracts` table has data

2. **Optimize PDF size**:
   - Compress PDFs before uploading
   - Reduce image quality in PDFs

3. **Monitor AI API latency**:
   - Add timing logs
   - Check Mistral/OpenAI status pages

### High memory usage

**Solutions**:

1. **Limit concurrent requests**:
   - Add request queue
   - Implement rate limiting

2. **Clean up temp files**:
   ```bash
   rm -rf temp/*
   ```

3. **Optimize database queries**:
   - Add indexes if needed
   - Use connection pooling

## Getting Help

If issues persist:

1. **Check logs** for detailed error messages
2. **Review API documentation**: http://localhost:3001/docs
3. **Consult guides**:
   - [SETUP.md](SETUP.md) - Setup instructions
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
   - [README.md](README.md) - Architecture overview
4. **Report bug** with:
   - Error message
   - Steps to reproduce
   - Environment (Node version, OS, etc.)
   - Relevant logs (redact sensitive info)
