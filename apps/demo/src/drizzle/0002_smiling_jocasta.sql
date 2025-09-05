ALTER TABLE "constructed_responses" ALTER COLUMN "score" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "constructed_responses" ADD COLUMN "is_passed" boolean NOT NULL;