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

export interface NSE {
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  E?: number;
}

export interface Genero {
  masculino?: number;
  femenino?: number;
}

export interface Edad {
  '18-25'?: number;
  '26-42'?: number;
  '43-mas'?: number;
}

export interface CandidatoConDatos {
  nombre: string;
  total: number;
  lima?: number;
  interior?: number;
  urbano?: number;
  rural?: number;
  norte?: number;
  centro?: number;
  sur?: number;
  oriente?: number;
  nse?: NSE;
  genero?: Genero;
  edad?: Edad;
}

export interface Resultado {
  fecha: string;
  candidatos: CandidatoConDatos[];
}

export interface IpsosEncuestaSimple {
  nroDeRegistro: string;
  muestra: number;
  lugares?: string;
  margenError?: string;
  porcentajeNivelConfianza?: number;
  universo?: string;
  fechaAplicacion?: string;
  resultados: Resultado[];
}

export interface ProcessIpsosRequest {
  pdfUrl: string;
}

export interface ProcessIpsosResponse {
  success: boolean;
  survey?: Survey<IpsosEncuestaSimple>;
  error?: string;
}

const candidatoConDatosSchema = z.object({
  nombre: z.string(),
  total: z.number().min(0).max(100),
  lima: z.number().min(0).max(100).optional(),
  interior: z.number().min(0).max(100).optional(),
  urbano: z.number().min(0).max(100).optional(),
  rural: z.number().min(0).max(100).optional(),
  norte: z.number().min(0).max(100).optional(),
  centro: z.number().min(0).max(100).optional(),
  sur: z.number().min(0).max(100).optional(),
  oriente: z.number().min(0).max(100).optional(),
  nse: z.object({
    A: z.number().min(0).max(100).optional(),
    B: z.number().min(0).max(100).optional(),
    C: z.number().min(0).max(100).optional(),
    D: z.number().min(0).max(100).optional(),
    E: z.number().min(0).max(100).optional()
  }).optional(),
  genero: z.object({
    masculino: z.number().min(0).max(100).optional(),
    femenino: z.number().min(0).max(100).optional()
  }).optional(),
  edad: z.object({
    '18-25': z.number().min(0).max(100).optional(),
    '26-42': z.number().min(0).max(100).optional(),
    '43-mas': z.number().min(0).max(100).optional()
  }).optional()
});

const ipsosSchemaSimple = z.object({
  nroDeRegistro: z.string(),
  muestra: z.number().int().min(1),
  lugares: z.string().optional(),
  margenError: z.string().optional(),
  porcentajeNivelConfianza: z.number().min(0).max(100).optional(),
  universo: z.string().optional(),
  fechaAplicacion: z.string().optional(),
  resultados: z.array(z.object({
    fecha: z.string(),
    candidatos: z.array(candidatoConDatosSchema)
  }))
});

export class ProcessIpsosSurveyService {
  constructor(
    private surveyRepository: ISurveyRepository,
    private pdfExtractRepository: IPDFExtractRepository,
    private pdfExtractor: PDFExtractorService,
    private textToJson: TextToJsonService,
    private urlFetch: URLFetchService,
    private logger: ILogger
  ) {}

  async process(request: ProcessIpsosRequest): Promise<ProcessIpsosResponse> {
    try {
      const tempDir = join(__dirname, '../../temp');
      const pdfPath = await this.urlFetch.downloadPDF(request.pdfUrl, tempDir);

      const extractedText = await this.extractOrLoadText(request.pdfUrl, pdfPath);
      const validatedData = await this.convertAndValidate(extractedText);

      const survey: Survey<IpsosEncuestaSimple> = {
        id: randomUUID(),
        source: 'ipsos',
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

  private async convertAndValidate(text: string): Promise<IpsosEncuestaSimple> {
    const schemaPath = join(__dirname, './data/ipsos_schema_simple.json');
    const schemaContent = await readFile(schemaPath, 'utf-8');
    const jsonSchema = JSON.parse(schemaContent);

    const structuredData = await this.textToJson.convert<IpsosEncuestaSimple>(
      text,
      jsonSchema,
      'ipsos_encuesta_simple',
      this.buildExtractionPrompt()
    );

    return ipsosSchemaSimple.parse(structuredData);
  }

  private buildExtractionPrompt(): string {
    return `You are an expert at extracting structured survey data from IPSOS Peru election polls.

Extract all available information from the text and format it according to the JSON schema provided.

IMPORTANT - Output format structure:
- Root level: metadata fields (nroDeRegistro, muestra, lugares, margenError, porcentajeNivelConfianza, universo, fechaAplicacion)
- "resultados": array of measurements by date
- Each result has "fecha" (YYYY-MM-DD format) and "candidatos" (array)
- "candidatos": array of objects, each with:
  - "nombre": full name of candidate
  - "total": national percentage
  - Optional geographic data: lima, interior, urbano, rural, norte, centro, sur, oriente
  - Optional "nse": object with A, B, C, D, E percentages
  - Optional "genero": object with masculino, femenino percentages
  - Optional "edad": object with "18-25", "26-42", "43-mas" percentages

Guidelines:
- Extract ALL candidates mentioned in results
- Include all measurement dates found in the document
- Nest all demographic data inside each candidate object in the candidatos array
- Use exact percentages from the document (numbers only, no % symbol)
- For dates, use YYYY-MM-DD format (e.g., "2026-02-20")
- Omit optional fields if not found in document
- Be precise with numbers and ensure consistency
- If a candidate appears in multiple tables with different breakdowns, consolidate all their data into ONE object
- Geographic regions: lima, interior, urbano, rural, norte, centro, sur, oriente
- NSE levels: A, B, C, D, E (capital letters)
- Gender: masculino, femenino
- Age groups: "18-25", "26-42", "43-mas" (as strings with quotes)`;
  }
}
