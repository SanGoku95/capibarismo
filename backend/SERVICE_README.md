# IPSOS Survey Extractor Service

A TypeScript-based Express.js service that extracts structured survey data from IPSOS PDFs using OpenAI's GPT-4, validates against a JSON schema, and saves the results.

## Architecture

This service follows a clean layered architecture:

```
┌─────────────────┐
│  Handler Layer  │  Maps HTTP ↔ DTOs, handles Express requests
├─────────────────┤
│  Service Layer  │  Business logic, PDF extraction, OpenAI integration
├─────────────────┤
│ Repository Layer│  Data persistence (file system)
└─────────────────┘
```

### Layer Responsibilities

- **Handler Layer** (`src/handlers/`): Maps HTTP requests to service DTOs and service responses to HTTP responses
- **Service Layer** (`src/services/`): Contains business logic for PDF extraction, OpenAI API calls, and validation
- **Repository Layer** (`src/repositories/`): Manages data persistence using the repository pattern with dependency injection

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Language**: TypeScript (ES modules)
- **AI**: OpenAI GPT-4 with structured outputs
- **Validation**: Zod (schema validation)
- **PDF Processing**: pdf-parse
- **Development**: tsx (hot reload)
- **Package Manager**: pnpm

## Project Structure

```
services/surveys/
├── src/
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # API route definitions
│   ├── handlers/
│   │   └── extract-ipsos.ts      # HTTP request handler
│   ├── services/
│   │   └── extract-ipsos.ts      # Extraction business logic
│   ├── repositories/
│   │   └── ipsos.ts              # File storage repository
│   └── types/
│       └── ipsos.ts              # TypeScript interfaces & DTOs
├── output/                       # Generated JSON files (gitignored)
├── ipsos.pdf                     # Sample PDF
├── ipsos_schema.json             # JSON Schema definition
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── .env                          # Environment variables (create from .env.example)
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
NODE_ENV=development
```

## Usage

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

The server will start on `http://localhost:3001`

### Production

Build and start the production server:

```bash
pnpm build
pnpm start
```

## API Endpoints

### POST /api/extract-ipsos

Extract survey data from IPSOS PDF.

**Request:**

```bash
curl -X POST http://localhost:3001/api/extract-ipsos \
  -H "Content-Type: application/json" \
  -d '{}'
```

Optional: Specify a custom PDF path:

```bash
curl -X POST http://localhost:3001/api/extract-ipsos \
  -H "Content-Type: application/json" \
  -d '{"pdfPath": "/path/to/custom.pdf"}'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Survey data extracted successfully",
  "outputPath": "/path/to/output/ipsos-extraction-2026-02-28.json",
  "data": {
    "encuesta": {
      "titulo": "...",
      "fecha": "...",
      ...
    }
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Error message here"
}
```

### GET /health

Health check endpoint.

**Request:**

```bash
curl http://localhost:3001/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "capibarismo-survey-extractor",
  "timestamp": "2026-02-28T10:00:00.000Z"
}
```

## Data Flow

1. **PDF Upload**: Handler receives request (defaults to `./ipsos.pdf`)
2. **Text Extraction**: Service uses pdf-parse to extract text from PDF
3. **AI Processing**: OpenAI GPT-4 structures the data according to `ipsos_schema.json`
4. **Validation**: Zod validates the response against the schema
5. **Persistence**: Repository saves the validated JSON to `output/` directory
6. **Response**: Handler returns success with file path and data

## Schema

The extraction follows the comprehensive IPSOS schema defined in `ipsos_schema.json`, which includes:

- **Ficha Técnica**: Survey metadata (encuestadora, muestra, margen de error, etc.)
- **Resultados**: Three measurement periods with candidate percentages
- **Evolución Histórica**: Historical trend data
- **Desagregado por Ámbito**: Geographic breakdown (Lima vs Interior)
- **Desagregado por Región**: Regional distribution (Norte, Centro, Sur, Oriente, Urbano, Rural)
- **Desagregado por NSE**: Socioeconomic levels (A, B, C, D, E)
- **Desagregado por Género y Edad**: Gender and age group breakdowns

## Development

### Type Safety

All types are defined in `src/types/ipsos.ts` based on the JSON schema. The service uses:

- TypeScript interfaces for data structures
- DTOs for service layer communication
- Zod schemas for runtime validation

### Dependency Injection

Services use constructor injection:

```typescript
const repository = new FileIpsosRepository();
const service = new ExtractIpsosService(repository);
const handler = new ExtractIpsosHandler(service);
```

This makes testing and swapping implementations easy.

### Adding New Extractors

To add support for other survey sources (DATUM, CPI):

1. Create new types in `src/types/datum.ts`
2. Create new repository in `src/repositories/datum.ts`
3. Create new service in `src/services/extract-datum.ts`
4. Create new handler in `src/handlers/extract-datum.ts`
5. Add route in `src/routes.ts`

## Troubleshooting

### "OPENAI_API_KEY environment variable is required"

Make sure you've created a `.env` file and added your OpenAI API key.

### "Failed to parse PDF"

Ensure the PDF file exists at the specified path and is readable.

### Validation errors

If the extracted data doesn't match the schema, check:
1. The PDF contains all required information
2. The OpenAI prompt is specific enough
3. The schema matches the expected data structure

## Cost Considerations

OpenAI API calls can be expensive, especially for large PDFs. Consider:

- Caching results for repeated extractions
- Using smaller models for simpler extractions
- Implementing retry logic with exponential backoff
- Monitoring token usage

## License

Part of the Capibarismo project.
