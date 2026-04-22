CREATE TABLE "direct_conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"participant_one_id" text NOT NULL,
	"participant_two_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "direct_message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "direct_conversation" ADD CONSTRAINT "direct_conversation_participant_one_id_user_id_fk" FOREIGN KEY ("participant_one_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_conversation" ADD CONSTRAINT "direct_conversation_participant_two_id_user_id_fk" FOREIGN KEY ("participant_two_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_conversation_id_direct_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."direct_conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "direct_conversation_participants_idx" ON "direct_conversation" USING btree ("participant_one_id","participant_two_id");--> statement-breakpoint
CREATE INDEX "direct_conversation_participant_one_idx" ON "direct_conversation" USING btree ("participant_one_id");--> statement-breakpoint
CREATE INDEX "direct_conversation_participant_two_idx" ON "direct_conversation" USING btree ("participant_two_id");--> statement-breakpoint
CREATE INDEX "direct_message_conversation_idx" ON "direct_message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "direct_message_sender_idx" ON "direct_message" USING btree ("sender_id");