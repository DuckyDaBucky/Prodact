CREATE TABLE "recommendation_run" (
	"id" text PRIMARY KEY NOT NULL,
	"source_product_id" text NOT NULL,
	"provider" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "target_product" (
	"product_id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"product_description" text,
	"rating" numeric(3, 2),
	"reviews_count" integer,
	"initial_price" numeric(10, 2),
	"final_price" numeric(10, 2),
	"currency" text,
	"seller_name" text,
	"breadcrumbs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"product_specifications" jsonb,
	"shipping_returns_policy" text,
	"amount_of_stars" jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"find_alternative" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"summary_of_reviews" text,
	"primary_category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recommendation_run" ADD CONSTRAINT "recommendation_run_source_product_id_target_product_product_id_fk" FOREIGN KEY ("source_product_id") REFERENCES "public"."target_product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recommendation_run_sourceProductId_idx" ON "recommendation_run" USING btree ("source_product_id");--> statement-breakpoint
CREATE INDEX "target_product_primaryCategory_idx" ON "target_product" USING btree ("primary_category");--> statement-breakpoint
CREATE INDEX "target_product_finalPrice_idx" ON "target_product" USING btree ("final_price");--> statement-breakpoint
CREATE INDEX "target_product_rating_idx" ON "target_product" USING btree ("rating");