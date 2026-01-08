ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "documentation" text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "mode" text DEFAULT 'tool' NOT NULL;
--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "last_compiled_at" timestamp;
