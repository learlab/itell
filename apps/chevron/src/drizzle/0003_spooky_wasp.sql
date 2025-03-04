ALTER TABLE "users" ADD COLUMN "onboarding_finished" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "offboarding_finished" boolean DEFAULT false NOT NULL;