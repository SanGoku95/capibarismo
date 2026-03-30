import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const surveys = pgTable('surveys', {
  id: uuid('id').primaryKey(),
  source: text('source').notNull(),
  sourceUrl: text('source_url').notNull(),
  content: text('content').notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const pdfExtracts = pgTable('pdf_extracts', {
  id: uuid('id').primaryKey(),
  sourceUrl: text('source_url').notNull().unique(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});
