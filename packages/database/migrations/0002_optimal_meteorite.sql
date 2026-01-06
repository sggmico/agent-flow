CREATE TABLE IF NOT EXISTS "agent_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"agent_id" integer NOT NULL,
	"skill_id" text NOT NULL,
	"config" jsonb,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill_id" text NOT NULL,
	"agent_id" integer,
	"execution_id" integer,
	"input" jsonb NOT NULL,
	"output" jsonb,
	"error" text,
	"status" text DEFAULT 'success',
	"duration" integer,
	"actual_cost" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"parameters" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"returns" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"handler" text NOT NULL,
	"handler_type" text DEFAULT 'builtin' NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"estimated_cost" jsonb DEFAULT '{}'::jsonb,
	"version" text DEFAULT '1.0.0',
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"created_by" integer NOT NULL,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_skill_id_unique" UNIQUE("skill_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_skills" ADD CONSTRAINT "agent_skills_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_skills" ADD CONSTRAINT "agent_skills_skill_id_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("skill_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill_executions" ADD CONSTRAINT "skill_executions_skill_id_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("skill_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill_executions" ADD CONSTRAINT "skill_executions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill_executions" ADD CONSTRAINT "skill_executions_execution_id_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."executions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
