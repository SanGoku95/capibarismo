import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { surveys } from '@/db/schema.js';
import { desc, count } from 'drizzle-orm';
import type { Survey } from '@/models/index.js';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ISurveyRepository {
  save(survey: Survey<any>): Promise<void>;
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<Survey<any>>>;
}

export class PostgreSurveyRepository implements ISurveyRepository {
  constructor(private db: NeonHttpDatabase<any>) {}

  async save(survey: Survey<any>): Promise<void> {
    await this.db.insert(surveys).values({
      id: survey.id,
      source: survey.source,
      sourceUrl: survey.sourceUrl,
      content: survey.content,
      data: survey.data,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt
    });
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<PaginatedResult<Survey<any>>> {
    const offset = (page - 1) * pageSize;

    const [results, totalCount] = await Promise.all([
      this.db
        .select()
        .from(surveys)
        .orderBy(desc(surveys.createdAt))
        .limit(pageSize)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(surveys)
    ]);

    const total = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(Number(total) / pageSize);

    return {
      data: results,
      total: Number(total),
      page,
      pageSize,
      totalPages
    };
  }
}
