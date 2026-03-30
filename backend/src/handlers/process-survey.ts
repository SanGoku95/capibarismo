import type { Request, Response } from 'express';
import { Mistral } from '@mistralai/mistralai';
import OpenAI from 'openai';
import { ProcessIpsosSurveyService } from '@/services/process-ipsos-survey.js';
import { ProcessDatumSurveyService } from '@/services/process-datum-survey.js';
import { ProcessCPISurveyService } from '@/services/process-cpi-survey.js';
import { PDFExtractorService } from '@/services/shared/pdf-extractor.js';
import { TextToJsonService } from '@/services/shared/text-to-json.js';
import { URLFetchService } from '@/services/shared/url-fetch.js';
import { ConsoleLogger } from '@/services/shared/log/console-logger.js';
import { PostgreSurveyRepository } from '@/repositories/survey.js';
import { PostgrePDFExtractRepository } from '@/repositories/pdf-extract.js';
import { db } from '@/db/client.js';

export interface SurveyProcessRequest {
  pdfUrl: string;
}

export interface SurveyProcessResponse {
  success: boolean;
  survey?: any;
  error?: string;
}

export interface SurveyProcessor {
  process(request: SurveyProcessRequest): Promise<SurveyProcessResponse>;
}

export class ProcessSurveyHandler {
  constructor(private processors: Map<string, SurveyProcessor>) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const source = req.params.source;
      const processor = this.processors.get(source);

      if (!processor) {
        res.status(400).json({
          success: false,
          error: `Unsupported source: ${source}. Supported sources: ${Array.from(this.processors.keys()).join(', ')}`
        });
        return;
      }

      const pdfUrl = req.body?.pdfUrl;
      if (!pdfUrl) {
        res.status(400).json({
          success: false,
          error: 'pdfUrl is required in request body'
        });
        return;
      }

      const result = await processor.process({ pdfUrl });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Survey data extracted successfully',
          survey: result.survey
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Extraction failed'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}

export function createProcessSurveyHandler(): ProcessSurveyHandler {
  const mistralApiKey = process.env.MISTRAL_API_KEY;
  if (!mistralApiKey) {
    throw new Error('MISTRAL_API_KEY environment variable not set');
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const mistralClient = new Mistral({ apiKey: mistralApiKey });
  const openaiClient = new OpenAI({ apiKey: openaiApiKey });
  const logger = new ConsoleLogger();

  const pdfExtractor = new PDFExtractorService(mistralClient, logger);
  const textToJson = new TextToJsonService(openaiClient, logger);
  const urlFetch = new URLFetchService(logger);

  const processors = new Map<string, SurveyProcessor>();

  const surveyRepository = new PostgreSurveyRepository(db);
  const pdfExtractRepository = new PostgrePDFExtractRepository(db);

  const ipsosService = new ProcessIpsosSurveyService(
    surveyRepository,
    pdfExtractRepository,
    pdfExtractor,
    textToJson,
    urlFetch,
    logger
  );
  processors.set('ipsos', ipsosService);

  const datumService = new ProcessDatumSurveyService(
    surveyRepository,
    pdfExtractRepository,
    pdfExtractor,
    textToJson,
    urlFetch,
    logger
  );
  processors.set('datum', datumService);

  const cpiService = new ProcessCPISurveyService(
    surveyRepository,
    pdfExtractRepository,
    pdfExtractor,
    textToJson,
    urlFetch,
    logger
  );
  processors.set('cpi', cpiService);

  return new ProcessSurveyHandler(processors);
}
