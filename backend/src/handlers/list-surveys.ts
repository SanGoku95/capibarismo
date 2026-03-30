import type { Request, Response } from 'express';
import { PostgreSurveyRepository } from '@/repositories/survey.js';
import { ListSurveysService } from '@/services/list-surveys.js';
import { db } from '@/db/client.js';

export interface ListSurveysQuery {
  page?: string;
  pageSize?: string;
}

export class ListSurveysHandler {
  constructor(private listSurveysService: ListSurveysService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      if (page < 1) {
        res.status(400).json({
          success: false,
          error: 'page must be greater than 0'
        });
        return;
      }

      if (pageSize < 1 || pageSize > 100) {
        res.status(400).json({
          success: false,
          error: 'pageSize must be between 1 and 100'
        });
        return;
      }

      const result = await this.listSurveysService.execute(page, pageSize);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}

export function createListSurveysHandler(): ListSurveysHandler {
  const surveyRepository = new PostgreSurveyRepository(db);
  const listSurveysService = new ListSurveysService(surveyRepository);
  return new ListSurveysHandler(listSurveysService);
}
