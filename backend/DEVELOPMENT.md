# Development Guide

Guidelines and best practices for developing the Survey Extractor service.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Code Organization](#code-organization)
- [Development Workflow](#development-workflow)
- [Adding Features](#adding-features)
- [Database Changes](#database-changes)
- [Testing](#testing)
- [Debugging](#debugging)
- [Code Style](#code-style)

## Architecture Overview

### Layered Architecture

The service follows a clean layered architecture with dependency injection:

```
┌─────────────────────────────────────┐
│   Handler Layer (HTTP)              │  ← Express routes, request/response mapping
├─────────────────────────────────────┤
│   Service Layer (Business Logic)    │  ← Use cases, orchestration
├─────────────────────────────────────┤
│   Repository Layer (Data Access)    │  ← Database operations
└─────────────────────────────────────┘
         │              │
    ┌────┴────┐    ┌────┴────┐
    │ Shared  │    │ Models  │
    │Services │    │         │
    └─────────┘    └─────────┘
```

### Key Principles

1. **Dependency Injection**: All dependencies passed via constructor
2. **Interface-based**: Repositories use interfaces for testability
3. **Single Responsibility**: Each module has one clear purpose
4. **Strategy Pattern**: Handler delegates to source-specific processors

## Code Organization

### Directory Structure

```
src/
├── handlers/           # HTTP request handlers
│   └── process-survey.ts
├── services/           # Business logic
│   ├── process-ipsos-survey.ts
│   └── shared/         # Reusable services
│       ├── pdf-extractor.ts
│       ├── text-to-json.ts
│       ├── url-fetch.ts
│       └── log/
├── repositories/       # Data access layer
│   ├── survey.ts
│   └── pdf-extract.ts
├── models/             # Domain models
│   └── index.ts
├── db/                 # Database configuration
│   ├── schema.ts
│   ├── client.ts
│   └── migrate.ts
└── config/             # Configuration
    └── openapi.ts
```

### Module Boundaries

| Layer | Depends On | Never Imports |
|-------|-----------|---------------|
| Handler | Service, Models | Repository, DB |
| Service | Repository, Shared, Models | Handler, DB |
| Repository | DB, Models | Service, Handler |
| Shared | - | Service, Repository, Handler |

## Development Workflow

### 1. Start Development Server

```bash
# With auto-reload on file changes
pnpm dev
```

The server watches for changes and automatically restarts.

### 2. Make Changes

Edit files in `src/`. Changes trigger automatic reload.

**Example**: Add logging to a service

```typescript
// src/services/process-ipsos-survey.ts
this.logger.info('processing survey', {
  source: 'ipsos',
  url: request.pdfUrl
});
```

Save → Server reloads → Test immediately.

### 3. Test Changes

```bash
# Manual testing
curl -X POST http://localhost:3001/api/surveys/ipsos/process \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/test.pdf"}'
```

### 4. Check Database

```bash
# Open Drizzle Studio
pnpm db:studio
```

Inspect `surveys` and `pdf_extracts` tables.

## Adding Features

### Adding a New Survey Source (e.g., "datum")

#### Step 1: Create Service

Create `src/services/process-datum-survey.ts`:

```typescript
import type { ISurveyRepository } from '@/repositories/survey.js';
import type { IPDFExtractRepository } from '@/repositories/pdf-extract.js';
import type { PDFExtractorService } from '@/services/shared/pdf-extractor.js';
import type { TextToJsonService } from '@/services/shared/text-to-json.js';
import type { URLFetchService } from '@/services/shared/url-fetch.js';
import type { ILogger } from '@/services/shared/log/logger.interface.js';
import type { Survey, PDFExtract } from '@/models/index.js';
import { randomUUID } from 'crypto';

export interface ProcessDatumRequest {
  pdfUrl: string;
}

export interface ProcessDatumResponse {
  success: boolean;
  survey?: Survey<DatumEncuesta>;
  error?: string;
}

export interface DatumEncuesta {
  // Define your datum-specific structure
  registroId: string;
  pregunta: string;
  opciones: Array<{ texto: string; porcentaje: number }>;
}

export class ProcessDatumSurveyService {
  constructor(
    private surveyRepository: ISurveyRepository,
    private pdfExtractRepository: IPDFExtractRepository,
    private pdfExtractor: PDFExtractorService,
    private textToJson: TextToJsonService,
    private urlFetch: URLFetchService,
    private logger: ILogger
  ) {}

  async process(request: ProcessDatumRequest): Promise<ProcessDatumResponse> {
    // Implementation similar to ProcessIpsosSurveyService
    // but with Datum-specific schema and validation
  }
}
```

#### Step 2: Register in Handler

Update `src/handlers/process-survey.ts`:

```typescript
import { ProcessDatumSurveyService } from '@/services/process-datum-survey.js';

export function createProcessSurveyHandler(): ProcessSurveyHandler {
  // ... existing setup ...

  const datumService = new ProcessDatumSurveyService(
    surveyRepository,
    pdfExtractRepository,
    pdfExtractor,
    textToJson,
    urlFetch,
    logger
  );
  processors.set('datum', datumService);

  // ... rest of setup ...
}
```

#### Step 3: Update OpenAPI Spec

Update `src/config/openapi.ts`:

```typescript
schema: {
  type: 'string',
  enum: ['ipsos', 'datum']  // Add 'datum'
}
```

#### Step 4: Test

```bash
curl -X POST http://localhost:3001/api/surveys/datum/process \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/datum-survey.pdf"}'
```

### Adding a Shared Service

Create reusable services in `src/services/shared/`:

```typescript
// src/services/shared/email-notifier.ts
import type { ILogger } from './log/logger.interface.js';

export class EmailNotifierService {
  constructor(
    private logger: ILogger,
    private apiKey: string
  ) {}

  async notify(to: string, subject: string, body: string): Promise<void> {
    this.logger.info('sending email', { to, subject });
    // Implementation
  }
}
```

Inject into services that need it:

```typescript
export class ProcessIpsosSurveyService {
  constructor(
    // ... existing dependencies ...
    private emailNotifier: EmailNotifierService
  ) {}

  async process(request: ProcessIpsosRequest): Promise<ProcessIpsosResponse> {
    const result = await this.extractAndValidate();
    await this.emailNotifier.notify('admin@example.com', 'New survey', 'Survey processed');
    return result;
  }
}
```

## Database Changes

### Modifying Schema

#### Step 1: Update Schema

Edit `src/db/schema.ts`:

```typescript
export const surveys = pgTable('surveys', {
  id: uuid('id').primaryKey(),
  source: text('source').notNull(),
  sourceUrl: text('source_url').notNull(),
  content: text('content').notNull(),
  data: jsonb('data').notNull(),
  status: text('status').notNull().default('pending'), // New field
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});
```

#### Step 2: Generate Migration

```bash
pnpm db:generate
```

This creates a new migration file in `drizzle/`.

#### Step 3: Review Migration

```bash
cat drizzle/0001_*.sql
```

Verify the SQL looks correct.

#### Step 4: Apply Migration

```bash
pnpm db:migrate
```

#### Step 5: Update Types

Update `src/models/index.ts`:

```typescript
export interface Survey<T = any> {
  id: string;
  source: string;
  sourceUrl: string;
  content: string;
  data: T;
  status?: string;  // Add optional field
  createdAt: Date;
  updatedAt: Date;
}
```

### Rolling Back Migrations

If you need to undo a migration:

1. **Manual rollback**: Write reverse SQL and run via `psql`
2. **Drop and recreate**:
   ```bash
   # WARNING: Destroys all data
   pnpm db:push --force
   ```

## Testing

### Manual Testing

#### Test with Mock PDF

Create a simple test PDF or use online service:

```bash
# Example: Download a sample PDF
curl -o test.pdf https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf

# Upload to temporary hosting (e.g., file.io, tmpfiles.org)
# Then test with that URL
```

#### Test Error Handling

```bash
# Invalid source
curl -X POST http://localhost:3001/api/surveys/invalid/process \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/test.pdf"}'

# Missing pdfUrl
curl -X POST http://localhost:3001/api/surveys/ipsos/process \
  -H "Content-Type: application/json" \
  -d '{}'

# Invalid URL
curl -X POST http://localhost:3001/api/surveys/ipsos/process \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "not-a-url"}'
```

### Database Testing

```bash
# Check if survey was saved
pnpm db:studio

# Or query directly
psql "$DATABASE_URL" -c "SELECT id, source, created_at FROM surveys ORDER BY created_at DESC LIMIT 5;"
```

## Debugging

### Viewing Logs

The service uses structured logging. All logs include metadata:

```
ℹ️  processing survey [source=ipsos url=https://...]
ℹ️  using cached pdf extract
✅ survey saved [id=550e8400-... source=ipsos]
```

### Debug Mode

Add more detailed logging:

```typescript
this.logger.debug('extracted text', {
  length: extractedText.length,
  preview: extractedText.substring(0, 100)
});
```

### Inspecting API Responses

Use verbose curl:

```bash
curl -v -X POST http://localhost:3001/api/surveys/ipsos/process \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/test.pdf"}'
```

### Database Queries

```sql
-- View recent surveys
SELECT id, source, created_at
FROM surveys
ORDER BY created_at DESC
LIMIT 10;

-- View cached extracts
SELECT source_url, created_at
FROM pdf_extracts
ORDER BY created_at DESC;

-- Check survey data structure
SELECT id, source, data->>'nroDeRegistro' as registro
FROM surveys
WHERE source = 'ipsos';
```

## Code Style

### TypeScript Conventions

- **Interfaces**: Use PascalCase (`Survey`, `ProcessIpsosRequest`)
- **Types**: Use PascalCase for public types
- **Functions**: Use camelCase (`processIpsos`, `extractText`)
- **Constants**: Use UPPER_SNAKE_CASE (`DATABASE_URL`, `API_KEY`)

### File Naming

- **Services**: `kebab-case.ts` (`process-ipsos-survey.ts`)
- **Types**: Defined in the file that uses them
- **Interfaces**: Export from repository/service files

### Import Order

```typescript
// 1. Node.js built-ins
import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';

// 2. External packages
import { z } from 'zod';

// 3. Internal modules (use @ alias)
import type { ISurveyRepository } from '@/repositories/survey.js';
import type { ILogger } from '@/services/shared/log/logger.interface.js';
import type { Survey } from '@/models/index.js';
```

### Dependency Injection Pattern

Always use constructor injection:

```typescript
// ✅ Good
export class MyService {
  constructor(
    private repository: IRepository,
    private logger: ILogger
  ) {}
}

// ❌ Bad
export class MyService {
  private repository = new Repository();
  private logger = new Logger();
}
```

### Error Handling

Always return structured responses:

```typescript
try {
  const result = await this.process();
  return { success: true, survey: result };
} catch (error) {
  this.logger.error('processing failed', {
    error: error instanceof Error ? error.message : 'unknown',
    stack: error instanceof Error ? error.stack : undefined
  });
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error occurred'
  };
}
```

## Performance Considerations

### PDF Extraction Caching

The service caches extracted PDF text:

- **First request**: Downloads PDF → Extracts text → Caches → Processes
- **Subsequent requests**: Uses cached text → Processes immediately

To clear cache:

```sql
DELETE FROM pdf_extracts WHERE source_url = 'https://...';
```

### AI API Costs

Monitor your AI API usage:

- **Mistral OCR**: ~$0.10 per page (estimate)
- **OpenAI GPT-4**: ~$0.01 per 1K tokens

Cache aggressively to minimize costs.

## Common Patterns

### Adding Validation

Use Zod for runtime validation:

```typescript
import { z } from 'zod';

const mySchema = z.object({
  field: z.string().min(1),
  count: z.number().int().min(0)
});

// Validate
const validated = mySchema.parse(data);
```

### Extending Logger

Add custom log methods:

```typescript
export interface ILogger {
  info(msg: string, metadata?: Record<string, any>): void;
  warning(msg: string, metadata?: Record<string, any>): void;
  error(msg: string, metadata?: Record<string, any>): void;
  debug(msg: string, metadata?: Record<string, any>): void;
  metric(name: string, value: number, metadata?: Record<string, any>): void; // New
}
```

## Next Steps

- **API Documentation**: http://localhost:3001/docs
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Architecture**: [README.md](README.md#architecture)
