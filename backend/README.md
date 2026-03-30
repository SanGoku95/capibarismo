# Survey Extractor

Extract structured survey data from Peru election poll PDFs (IPSOS, Datum, CPI) using AI (Mistral OCR + OpenAI).

## 📚 Documentation

- **[Quick Start](QUICKSTART.md)** - Get running in 5 minutes
- **[Setup Guide](SETUP.md)** - Detailed installation instructions
- **[Development Guide](DEVELOPMENT.md)** - Architecture, patterns, and best practices
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions
- **[API Documentation](http://localhost:3001/docs)** - Interactive API reference (when server is running)

## Tech Stack

- **Runtime**: Node.js 20+ with TypeScript ES modules
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **AI**: Mistral OCR for PDF extraction, OpenAI for text-to-JSON conversion
- **Package Manager**: pnpm

## Architecture

Layered architecture with dependency injection:

- **Handler Layer**: Maps HTTP requests to service DTOs and responses back to HTTP
- **Service Layer**: Business logic, orchestrates repositories and shared services
- **Repository Layer**: Data access with interface-based abstraction
- **Shared Services**: Reusable utilities (PDF extraction, text-to-JSON, URL fetching, logging)
- **Models**: Domain entities (Survey, PDFExtract)

### Project Structure

```
/
  index.ts              # Server entry point
  routes.ts             # Express routes
  drizzle.config.ts     # Drizzle ORM configuration
  /handlers
    process-survey.ts          # Generic handler with strategy pattern
    list-surveys.ts            # List surveys handler
  /services
    process-ipsos-survey.ts    # IPSOS-specific processor
    process-datum-survey.ts    # Datum-specific processor
    process-cpi-survey.ts      # CPI-specific processor
    /shared
      pdf-extractor.ts         # Mistral OCR service
      text-to-json.ts          # OpenAI conversion service
      url-fetch.ts             # PDF download service
      /log
        logger.interface.ts    # Logger interface
        console-logger.ts      # Console logger implementation
  /repositories
    survey.ts           # Survey repository (PostgreSQL)
    pdf-extract.ts      # PDF extract cache repository (PostgreSQL)
  /models
    survey.ts           # Survey domain model
    pdf-extract.ts      # PDF extract domain model
  /db
    schema.ts           # Drizzle schema definitions
    client.ts           # Database client
    migrate.ts          # Migration runner
  /config
    openapi.ts          # OpenAPI 3.1 specification
```

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment template
cp .env.example .env
# Edit .env with your API keys and database URL

# 3. Set up database
pnpm db:push

# 4. Start server
pnpm dev
```

Server runs at `http://localhost:3001` • API docs at `http://localhost:3001/docs`

👉 **See [QUICKSTART.md](QUICKSTART.md)** for step-by-step guide or **[SETUP.md](SETUP.md)** for detailed setup instructions.

## API Usage

### List Surveys

**Endpoint**: `GET /api/surveys`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10, max: 100)

**Example**:
```bash
curl http://localhost:3001/api/surveys?page=1&pageSize=10
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "source": "ipsos",
      "sourceUrl": "https://example.com/survey.pdf",
      "data": { "nroDeRegistro": "123-2024-JNE", "muestra": 1200, "resultados": [...] },
      "createdAt": "2026-02-28T12:00:00.000Z",
      "updatedAt": "2026-02-28T12:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

### Extract Survey Data

**Endpoint**: `POST /api/surveys/{source}/process`

**Authentication**: Required via `Authorization` header

**Parameters**:
- `source` (path): Survey source (`ipsos`, `datum`, or `cpi`)

**Headers**:
- `Authorization`: Bearer token (set via `AUTH_TOKEN` environment variable)
- `Content-Type`: application/json

**Request Body**:
```json
{
  "pdfUrl": "https://example.com/survey.pdf"
}
```

**Example**:
```bash
curl -X POST http://localhost:3001/api/surveys/ipsos/process \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://www.ipsos.com/sites/default/files/ct/news/documents/2024-01/Peru_Poll_Results.pdf"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Survey data extracted successfully",
  "survey": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "source": "ipsos",
    "sourceUrl": "https://example.com/survey.pdf",
    "content": "Extracted text...",
    "data": {
      "nroDeRegistro": "123-2024-JNE",
      "muestra": 1200,
      "resultados": [...]
    },
    "createdAt": "2026-02-28T12:00:00.000Z",
    "updatedAt": "2026-02-28T12:00:00.000Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Missing authorization header
- `403 Forbidden`: Invalid authorization token

### Supported Survey Sources

The system supports three major Peru polling firms with different data schemas:

| Source | Endpoint | Data Fields |
|--------|----------|-------------|
| **IPSOS** | `/ipsos/process` | • Total, Lima, Interior, Urbano, Rural<br>• Regiones: Norte, Centro, Sur, Oriente<br>• NSE: A, B, C, D, E<br>• Género: Masculino, Femenino<br>• Edad: 18-25, 26-42, 43+ |
| **Datum** | `/datum/process` | • Total<br>• Sexo: Hombre, Mujer<br>• Región: Lima/Callao, Norte, Centro, Sur, Oriente<br>• Zona: Urbana, Rural |
| **CPI** | `/cpi/process` | • Perú Urbano y Rural<br>• Ámbito: Lima Metropolitana/Provincias/Callao, Interior<br>• Macrozonas: Costa y Sierra Norte, Costa Sur, Sierra Centro y Sur, Oriente<br>• Área: Urbano, Rural<br>• Sexo: Hombres, Mujeres<br>• Grupos de Edad: 18-24, 25-39, 40-70 |

Each source uses a specialized processor that extracts data according to the polling firm's specific format and terminology.

## Database Scripts

```bash
pnpm db:generate    # Generate migration files from schema
pnpm db:migrate     # Run migrations
pnpm db:push        # Push schema directly (dev only)
pnpm db:studio      # Open Drizzle Studio GUI
```

## How It Works

### 2-Step Extraction Process

1. **PDF → Text** (Mistral OCR):
   - Downloads PDF from URL
   - Extracts text using Mistral's OCR API (preserves tables)
   - Caches extracted text in `pdf_extracts` table

2. **Text → JSON** (OpenAI):
   - Sends extracted text + JSON schema to OpenAI GPT-4
   - Validates response with Zod
   - Saves structured data in `surveys` table

### Caching Strategy

PDF text extraction is cached by `sourceUrl` to:
- Reduce AI API costs
- Speed up repeated processing
- Allow text correction without re-extraction

Cache is automatically deleted after successful survey creation.

## Development

See **[DEVELOPMENT.md](DEVELOPMENT.md)** for comprehensive development guide including:

- Architecture patterns and principles
- Adding new survey sources
- Database schema changes
- Testing strategies
- Debugging techniques
- Code style conventions

### Quick Reference

```bash
pnpm dev              # Start dev server with auto-reload
pnpm build            # Build for production
pnpm db:studio        # Open database GUI
pnpm db:generate      # Generate migration from schema
pnpm db:migrate       # Run pending migrations
pnpm db:push          # Push schema directly (dev only)
```

## Production Deployment

```bash
pnpm build          # Compile TypeScript
pnpm start          # Run production server
```

**Important**:
- Set `NODE_ENV=production` in production environment
- Ensure all environment variables are configured
- Run `pnpm db:migrate` before starting server
- Use proper logging and monitoring

## Troubleshooting

Having issues? Check **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for solutions to common problems:

- Environment setup issues
- Database connection problems
- API errors
- AI service issues
- Build and deployment problems

## Contributing

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for architecture and patterns
2. Follow existing code style and conventions
3. Add tests for new features
4. Update documentation as needed
5. Submit pull request with clear description

## Support

- **Documentation**: See guides in this directory
- **API Reference**: http://localhost:3001/docs (when running)
- **Issues**: Report bugs via GitHub Issues

