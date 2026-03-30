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

export interface Ambito {
  lima_metropolitana_lima_provincias_callao?: number;
  interior_del_pais?: number;
}

export interface MacrozonasCPI {
  costa_y_sierra_norte?: number;
  costa_sur?: number;
  sierra_centro_y_sur?: number;
  oriente?: number;
}

export interface Area {
  urbano?: number;
  rural?: number;
}

export interface Sexo {
  hombres?: number;
  mujeres?: number;
}

export interface GrupoDeEdad {
  '18_24'?: number;
  '25_39'?: number;
  '40_70'?: number;
}

export interface CandidatoCPI {
  nombre: string;
  peru_urbano_rural: number;
  ambito?: Ambito;
  macrozonas_cpi?: MacrozonasCPI;
  area?: Area;
  sexo?: Sexo;
  grupo_de_edad?: GrupoDeEdad;
}

export interface ResultadoCPI {
  fecha: string;
  candidatos: CandidatoCPI[];
}

export interface CPIEncuesta {
  nroDeRegistro: string;
  muestra: number;
  lugares?: string;
  margenError?: string;
  porcentajeNivelConfianza?: number;
  universo?: string;
  fechaAplicacion?: string;
  resultados: ResultadoCPI[];
}

export interface ProcessCPIRequest {
  pdfUrl: string;
}

export interface ProcessCPIResponse {
  success: boolean;
  survey?: Survey<CPIEncuesta>;
  error?: string;
}

const candidatoCPISchema = z.object({
  nombre: z.string(),
  peru_urbano_rural: z.number().min(0).max(100),
  ambito: z.object({
    lima_metropolitana_lima_provincias_callao: z.number().min(0).max(100).optional(),
    interior_del_pais: z.number().min(0).max(100).optional()
  }).optional(),
  macrozonas_cpi: z.object({
    costa_y_sierra_norte: z.number().min(0).max(100).optional(),
    costa_sur: z.number().min(0).max(100).optional(),
    sierra_centro_y_sur: z.number().min(0).max(100).optional(),
    oriente: z.number().min(0).max(100).optional()
  }).optional(),
  area: z.object({
    urbano: z.number().min(0).max(100).optional(),
    rural: z.number().min(0).max(100).optional()
  }).optional(),
  sexo: z.object({
    hombres: z.number().min(0).max(100).optional(),
    mujeres: z.number().min(0).max(100).optional()
  }).optional(),
  grupo_de_edad: z.object({
    '18_24': z.number().min(0).max(100).optional(),
    '25_39': z.number().min(0).max(100).optional(),
    '40_70': z.number().min(0).max(100).optional()
  }).optional()
});

const cpiSchema = z.object({
  nroDeRegistro: z.string(),
  muestra: z.number().int().min(1),
  lugares: z.string().optional(),
  margenError: z.string().optional(),
  porcentajeNivelConfianza: z.number().min(0).max(100).optional(),
  universo: z.string().optional(),
  fechaAplicacion: z.string().optional(),
  resultados: z.array(z.object({
    fecha: z.string(),
    candidatos: z.array(candidatoCPISchema)
  }))
});

export class ProcessCPISurveyService {
  constructor(
    private surveyRepository: ISurveyRepository,
    private pdfExtractRepository: IPDFExtractRepository,
    private pdfExtractor: PDFExtractorService,
    private textToJson: TextToJsonService,
    private urlFetch: URLFetchService,
    private logger: ILogger
  ) {}

  async process(request: ProcessCPIRequest): Promise<ProcessCPIResponse> {
    try {
      const tempDir = join(__dirname, '../../temp');
      const pdfPath = await this.urlFetch.downloadPDF(request.pdfUrl, tempDir);

      const extractedText = await this.extractOrLoadText(request.pdfUrl, pdfPath);
      const validatedData = await this.convertAndValidate(extractedText);

      const survey: Survey<CPIEncuesta> = {
        id: randomUUID(),
        source: 'cpi',
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

  private async convertAndValidate(text: string): Promise<CPIEncuesta> {
    const schemaPath = join(__dirname, './data/cpi_schema.json');
    const schemaContent = await readFile(schemaPath, 'utf-8');
    const jsonSchema = JSON.parse(schemaContent);

    const structuredData = await this.textToJson.convert<CPIEncuesta>(
      text,
      jsonSchema,
      'cpi_encuesta',
      this.buildExtractionPrompt()
    );

    return cpiSchema.parse(structuredData);
  }

  private buildExtractionPrompt(): string {
    return `You are an expert at extracting structured survey data from CPI Peru election polls.

Extract all available information from the text and format it according to the JSON schema provided.

IMPORTANT - The data appears under the section:
"PERÚ: ELECCIONES GENERALES 2026"
"INTENCIÓN DE VOTO PRESIDENCIAL"
"RESPUESTA ASISTIDA CON TARJETA DE CANDIDATOS"

Question 3: "En esta tarjeta, que le pido por favor la lea detenidamente, figuran en orden Alfabético, según apellido, los candidatos presidenciales inscritos ante el Jurado Nacional de Elecciones (JNE), para las elecciones de abril de este año, con sus respectivos partidos políticos, ¿Si las elecciones presidenciales fueran mañana, por cuál de estos candidatos votaría usted para presidente del Perú?"

Output format structure:
- Root level: metadata fields (nroDeRegistro, muestra, lugares, margenError, porcentajeNivelConfianza, universo, fechaAplicacion)
- "resultados": array of measurements by date
- Each result has "fecha" (YYYY-MM-DD format) and "candidatos" (array)
- "candidatos": array of objects, each with:
  - "nombre": full name of candidate
  - "peru_urbano_rural": total percentage for Peru urban and rural combined
  - Optional "ambito": object with lima_metropolitana_lima_provincias_callao, interior_del_pais
  - Optional "macrozonas_cpi": object with costa_y_sierra_norte, costa_sur, sierra_centro_y_sur, oriente
  - Optional "area": object with urbano, rural
  - Optional "sexo": object with hombres, mujeres
  - Optional "grupo_de_edad": object with 18_24, 25_39, 40_70

Guidelines:
- Extract ALL candidates mentioned in results
- Include all measurement dates found in the document
- Nest all demographic data inside each candidate object in the candidatos array
- Use exact percentages from the document (numbers only, no % symbol)
- For dates, use YYYY-MM-DD format (e.g., "2026-02-20")
- Omit optional fields if not found in document
- Be precise with numbers and ensure consistency
- If a candidate appears in multiple tables with different breakdowns, consolidate all their data into ONE object
- For "ambito": use "lima_metropolitana_lima_provincias_callao" and "interior_del_pais" (lowercase with underscores)
- For "macrozonas_cpi": use "costa_y_sierra_norte", "costa_sur", "sierra_centro_y_sur", "oriente" (lowercase with underscores)
- For "area": use "urbano" and "rural" (lowercase)
- For "sexo": use "hombres" and "mujeres" (lowercase)
- For "grupo_de_edad": use "18_24", "25_39", "40_70" (as property names with underscores)
- CPI surveys include comprehensive demographic breakdowns across multiple dimensions`;
  }
}
