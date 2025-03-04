ALTER TABLE "constructed_responses_feedback" RENAME TO "feedbacks";--> statement-breakpoint
ALTER TABLE "feedbacks" DROP CONSTRAINT "constructed_responses_feedback_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "feedbacks" ALTER COLUMN "text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "consent_given" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "data" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "feedbacks" DROP COLUMN IF EXISTS "page_slug";--> statement-breakpoint
ALTER TABLE "feedbacks" DROP COLUMN IF EXISTS "chunk_slug";--> statement-breakpoint
ALTER TABLE "feedbacks" DROP COLUMN IF EXISTS "tags";