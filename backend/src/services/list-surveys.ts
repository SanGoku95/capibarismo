import type { ISurveyRepository, PaginatedResult } from '@/repositories/survey.js';

export interface SurveyDTO {
  id: string;
  source: string;
  sourceUrl: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export class ListSurveysService {
  constructor(private surveyRepository: ISurveyRepository) {}

  async execute(page: number = 1, pageSize: number = 10): Promise<PaginatedResult<SurveyDTO>> {
    const result = await this.surveyRepository.findAll(page, pageSize);

    return {
      ...result,
      data: result.data.map(survey => ({
        id: survey.id,
        source: survey.source,
        sourceUrl: survey.sourceUrl,
        data: survey.data,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt
      }))
    };
  }
}
