import { eq } from 'drizzle-orm';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { pdfExtracts } from '@/db/schema.js';
import type { PDFExtract } from '@/models/index.js';

export interface IPDFExtractRepository {
  save(extract: PDFExtract): Promise<void>;
  get(sourceUrl: string): Promise<PDFExtract | null>;
  delete(sourceUrl: string): Promise<void>;
}

export class PostgrePDFExtractRepository implements IPDFExtractRepository {
  constructor(private db: NeonHttpDatabase<any>) {}

  async save(extract: PDFExtract): Promise<void> {
    await this.db
      .insert(pdfExtracts)
      .values({
        id: extract.id,
        sourceUrl: extract.sourceUrl,
        content: extract.content,
        createdAt: extract.createdAt
      })
      .onConflictDoUpdate({
        target: pdfExtracts.sourceUrl,
        set: {
          content: extract.content,
          createdAt: extract.createdAt
        }
      });
  }

  async get(sourceUrl: string): Promise<PDFExtract | null> {
    const result = await this.db
      .select()
      .from(pdfExtracts)
      .where(eq(pdfExtracts.sourceUrl, sourceUrl))
      .limit(1);

    return result[0] || null;
  }

  async delete(sourceUrl: string): Promise<void> {
    await this.db
      .delete(pdfExtracts)
      .where(eq(pdfExtracts.sourceUrl, sourceUrl));
  }
}
