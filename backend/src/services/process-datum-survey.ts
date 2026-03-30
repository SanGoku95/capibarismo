import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import type { ISurveyRepository } from '@/repositories/survey.js';
import type { IPDFExtractRepository } from '@/repositories/pdf-extract.js';
import type { PDFExtractorService } from '@/services/shared/pdf-extractor.js';
import type { TextToJsonService } from '@/services/shared/text-to-json.js';
import type { URLFetchService } from '@/services/shared/url-fetch.js';
import type { ILogger } from '@/services/shared/log/logger.interface.js';
import type { Survey, PDFExtract } from '@/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Sexo {
  hombre?: number;
  mujer?: number;
}

export interface Region {
  lima_callao?: number;
  norte?: number;
  centro?: number;
  sur?: number;
  oriente?: number;
}

export interface Zona {
  urbana?: number;
  rural?: number;
}

export interface CandidatoDatum {
  nombre: string;
  total: number;
  sexo?: Sexo;
  region?: Region;
  zona?: Zona;
}

export interface ResultadoDatum {
  fecha: string;
  candidatos: CandidatoDatum[];
}

export interface DatumEncuesta {
  nroDeRegistro: string;
  muestra: number;
  lugares?: string;
  margenError?: string;
  porcentajeNivelConfianza?: number;
  universo?: string;
  fechaAplicacion?: string;
  resultados: ResultadoDatum[];
}

export interface ProcessDatumRequest {
  pdfUrl: string;
}

export interface ProcessDatumResponse {
  success: boolean;
  survey?: Survey<DatumEncuesta>;
  error?: string;
}

const candidatoDatumSchema = z.object({
  nombre: z.string(),
  total: z.number().min(0).max(100),
  sexo: z.object({
    hombre: z.number().min(0).max(100).optional(),
    mujer: z.number().min(0).max(100).optional()
  }).optional(),
  region: z.object({
    lima_callao: z.number().min(0).max(100).optional(),
    norte: z.number().min(0).max(100).optional(),
    centro: z.number().min(0).max(100).optional(),
    sur: z.number().min(0).max(100).optional(),
    oriente: z.number().min(0).max(100).optional()
  }).optional(),
  zona: z.object({
    urbana: z.number().min(0).max(100).optional(),
    rural: z.number().min(0).max(100).optional()
  }).optional()
});

const datumSchema = z.object({
  nroDeRegistro: z.string(),
  muestra: z.number().int().min(1),
  lugares: z.string().optional(),
  margenError: z.string().optional(),
  porcentajeNivelConfianza: z.number().min(0).max(100).optional(),
  universo: z.string().optional(),
  fechaAplicacion: z.string().optional(),
  resultados: z.array(z.object({
    fecha: z.string(),
    candidatos: z.array(candidatoDatumSchema)
  }))
});

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
    try {
      const tempDir = join(__dirname, '../../temp');
      const pdfPath = await this.urlFetch.downloadPDF(request.pdfUrl, tempDir);

      const extractedText = await this.extractOrLoadText(request.pdfUrl, pdfPath);
      const validatedData = await this.convertAndValidate(extractedText);

      const survey: Survey<DatumEncuesta> = {
        id: randomUUID(),
        source: 'datum',
        sourceUrl: request.pdfUrl,
        content: extractedText,
        data: validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.surveyRepository.save(survey);
      await this.pdfExtractRepository.delete(request.pdfUrl);

      this.logger.info('survey saved', { id: survey.id, source: survey.source });

      return { success: true, survey };
    } catch (error) {
      this.logger.error('extraction failed', {
        error: error instanceof Error ? error.message : 'unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async extractOrLoadText(sourceUrl: string, pdfPath: string): Promise<string> {
    const cached = await this.pdfExtractRepository.get(sourceUrl);

    if (cached) {
      this.logger.info('using cached pdf extract');
      return cached.content;
    }

    const extractedText = await this.pdfExtractor.extractText(pdfPath);

    const pdfExtract: PDFExtract = {
      id: randomUUID(),
      sourceUrl,
      content: extractedText,
      createdAt: new Date()
    };

    await this.pdfExtractRepository.save(pdfExtract);

    return extractedText;
  }

  private async convertAndValidate(text: string): Promise<DatumEncuesta> {
    const schemaPath = join(__dirname, './data/datum_schema.json');
    const schemaContent = await readFile(schemaPath, 'utf-8');
    const jsonSchema = JSON.parse(schemaContent);

    const structuredData = await this.textToJson.convert<DatumEncuesta>(
      text,
      jsonSchema,
      'datum_encuesta',
      this.buildExtractionPrompt()
    );

    return datumSchema.parse(structuredData);
  }

  private buildExtractionPrompt(): string {
    return `You are an expert at extracting structured survey data from Datum Peru election polls.

Extract all available information from the text and format it according to the JSON schema provided.

IMPORTANT - The data appears under the section:
"Intención de voto por candidato, para las elecciones presidenciales"
With the question: "Si este domingo se realizaran las elecciones presidenciales y se presentan las siguientes personas como posibles candidatos, ¿por cuál de ellos votaría para elegir al presidente de la república?"

Output format structure:
- Root level: metadata fields (nroDeRegistro, muestra, lugares, margenError, porcentajeNivelConfianza, universo, fechaAplicacion)
- "resultados": array of measurements by date
- Each result has "fecha" (YYYY-MM-DD format) and "candidatos" (array)
- "candidatos": array of objects, each with:
  - "nombre": full name of candidate
  - "total": national percentage
  - Optional "sexo": object with hombre, mujer percentages
  - Optional "region": object with lima_callao, norte, centro, sur, oriente percentages
  - Optional "zona": object with urbana, rural percentages

Guidelines:
- Extract ALL candidates mentioned in results
- Include all measurement dates found in the document
- Nest all demographic data inside each candidate object in the candidatos array
- Use exact percentages from the document (numbers only, no % symbol)
- For dates, use YYYY-MM-DD format (e.g., "2026-02-20")
- Omit optional fields if not found in document
- Be precise with numbers and ensure consistency
- If a candidate appears in multiple tables with different breakdowns, consolidate all their data into ONE object
- For "sexo": use "hombre" and "mujer" (lowercase)
- For "region": use "lima_callao", "norte", "centro", "sur", "oriente" (lowercase with underscore)
- For "zona": use "urbana" and "rural" (lowercase)
- Datum surveys only include sexo, region, and zona breakdowns (no NSE or edad data)`;
  }
}
