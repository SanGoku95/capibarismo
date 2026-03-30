CREATE TABLE IF NOT EXISTS "pdf_extracts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source_url" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pdf_extracts_source_url_unique" UNIQUE("source_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "surveys" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"source_url" text NOT NULL,
	"content" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
