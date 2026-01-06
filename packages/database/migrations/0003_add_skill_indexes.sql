ALTER TABLE "skills" ALTER COLUMN "created_by" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "agent_skills" DROP CONSTRAINT IF EXISTS "agent_skills_agent_id_agents_id_fk";
--> statement-breakpoint
ALTER TABLE "agent_skills" DROP CONSTRAINT IF EXISTS "agent_skills_skill_id_skills_skill_id_fk";
--> statement-breakpoint
ALTER TABLE "skill_executions" DROP CONSTRAINT IF EXISTS "skill_executions_skill_id_skills_skill_id_fk";
--> statement-breakpoint
ALTER TABLE "skill_executions" DROP CONSTRAINT IF EXISTS "skill_executions_agent_id_agents_id_fk";
--> statement-breakpoint
ALTER TABLE "skill_executions" DROP CONSTRAINT IF EXISTS "skill_executions_execution_id_executions_id_fk";
--> statement-breakpoint
ALTER TABLE "skills" DROP CONSTRAINT IF EXISTS "skills_created_by_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_skills" ADD CONSTRAINT "agent_skills_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_skills" ADD CONSTRAINT "agent_skills_skill_id_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("skill_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill_executions" ADD CONSTRAINT "skill_executions_skill_id_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("skill_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill_executions" ADD CONSTRAINT "skill_executions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skill_executions" ADD CONSTRAINT "skill_executions_execution_id_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."executions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skill_executions_skill_id" ON "skill_executions" ("skill_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skill_executions_agent_id" ON "skill_executions" ("agent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skill_executions_execution_id" ON "skill_executions" ("execution_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skill_executions_created_at" ON "skill_executions" ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_skills_agent_id" ON "agent_skills" ("agent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_skills_skill_id" ON "agent_skills" ("skill_id");
