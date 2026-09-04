import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_features_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_features_items_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_layout" AS ENUM('grid', 'marquee');
  CREATE TYPE "public"."enum_pages_blocks_stats_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_stats_layout" AS ENUM('bar', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_service_showcase_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_service_showcase_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_service_showcase_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_service_showcase_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_features_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_features_items_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_layout" AS ENUM('grid', 'marquee');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_layout" AS ENUM('bar', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_service_showcase_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_service_showcase_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_service_showcase_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_service_showcase_link_appearance" AS ENUM('default', 'outline');
  ALTER TYPE "public"."enum_pages_blocks_banner_style" ADD VALUE 'promo' BEFORE 'warning';
  ALTER TYPE "public"."enum_pages_blocks_features_layout" ADD VALUE 'linkedCards';
  ALTER TYPE "public"."enum__pages_v_blocks_banner_style" ADD VALUE 'promo' BEFORE 'warning';
  ALTER TYPE "public"."enum__pages_v_blocks_features_layout" ADD VALUE 'linkedCards';
  CREATE TABLE "pages_hero_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"rating" numeric,
  	"photo_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_testimonials_align" DEFAULT 'left',
  	"layout" "enum_pages_blocks_testimonials_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_logo_cloud_align" DEFAULT 'left',
  	"layout" "enum_pages_blocks_logo_cloud_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_stats_align" DEFAULT 'left',
  	"layout" "enum_pages_blocks_stats_layout" DEFAULT 'bar',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_product_showcase_align" DEFAULT 'left',
  	"layout" "enum_pages_blocks_product_showcase_layout" DEFAULT 'grid',
  	"populate_by" "enum_pages_blocks_product_showcase_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 6,
  	"enable_view_all_link" boolean DEFAULT true,
  	"link_type" "enum_pages_blocks_product_showcase_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_product_showcase_link_appearance" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_newsletter_align" DEFAULT 'left',
  	"placeholder" varchar DEFAULT 'you@example.com',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"success_message" varchar DEFAULT 'Thanks for subscribing.',
  	"privacy_note" varchar DEFAULT 'No spam. Unsubscribe any time.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_split_feature_align" DEFAULT 'left',
  	"rich_text" jsonb,
  	"media_id" integer,
  	"image_position" "enum_pages_blocks_split_feature_image_position" DEFAULT 'right',
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_split_feature_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_split_feature_link_appearance" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum_pages_blocks_service_showcase_align" DEFAULT 'left',
  	"populate_by" "enum_pages_blocks_service_showcase_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 3,
  	"enable_view_all_link" boolean DEFAULT true,
  	"link_type" "enum_pages_blocks_service_showcase_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_service_showcase_link_appearance" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"rating" numeric,
  	"photo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_testimonials_align" DEFAULT 'left',
  	"layout" "enum__pages_v_blocks_testimonials_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_logo_cloud_align" DEFAULT 'left',
  	"layout" "enum__pages_v_blocks_logo_cloud_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_stats_align" DEFAULT 'left',
  	"layout" "enum__pages_v_blocks_stats_layout" DEFAULT 'bar',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_product_showcase_align" DEFAULT 'left',
  	"layout" "enum__pages_v_blocks_product_showcase_layout" DEFAULT 'grid',
  	"populate_by" "enum__pages_v_blocks_product_showcase_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 6,
  	"enable_view_all_link" boolean DEFAULT true,
  	"link_type" "enum__pages_v_blocks_product_showcase_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_product_showcase_link_appearance" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_newsletter_align" DEFAULT 'left',
  	"placeholder" varchar DEFAULT 'you@example.com',
  	"button_label" varchar DEFAULT 'Subscribe',
  	"success_message" varchar DEFAULT 'Thanks for subscribing.',
  	"privacy_note" varchar DEFAULT 'No spam. Unsubscribe any time.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_split_feature_align" DEFAULT 'left',
  	"rich_text" jsonb,
  	"media_id" integer,
  	"image_position" "enum__pages_v_blocks_split_feature_image_position" DEFAULT 'right',
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_split_feature_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_split_feature_link_appearance" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"align" "enum__pages_v_blocks_service_showcase_align" DEFAULT 'left',
  	"populate_by" "enum__pages_v_blocks_service_showcase_populate_by" DEFAULT 'collection',
  	"limit" numeric DEFAULT 3,
  	"enable_view_all_link" boolean DEFAULT true,
  	"link_type" "enum__pages_v_blocks_service_showcase_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_service_showcase_link_appearance" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "enable_link" boolean;
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "link_type" "enum_pages_blocks_features_items_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "link_appearance" "enum_pages_blocks_features_items_link_appearance" DEFAULT 'default';
  ALTER TABLE "pages" ADD COLUMN "hero_enable_trust_row" boolean DEFAULT false;
  ALTER TABLE "pages_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "enable_link" boolean;
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "link_type" "enum__pages_v_blocks_features_items_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "link_appearance" "enum__pages_v_blocks_features_items_link_appearance" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_enable_trust_row" boolean DEFAULT false;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "pages_hero_trust_items" ADD CONSTRAINT "pages_hero_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud" ADD CONSTRAINT "pages_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_showcase" ADD CONSTRAINT "pages_blocks_product_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature" ADD CONSTRAINT "pages_blocks_split_feature_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature" ADD CONSTRAINT "pages_blocks_split_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_showcase" ADD CONSTRAINT "pages_blocks_service_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_trust_items" ADD CONSTRAINT "_pages_v_version_hero_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_showcase" ADD CONSTRAINT "_pages_v_blocks_product_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD CONSTRAINT "_pages_v_blocks_split_feature_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD CONSTRAINT "_pages_v_blocks_split_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_showcase" ADD CONSTRAINT "_pages_v_blocks_service_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_trust_items_order_idx" ON "pages_hero_trust_items" USING btree ("_order");
  CREATE INDEX "pages_hero_trust_items_parent_id_idx" ON "pages_hero_trust_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_photo_idx" ON "pages_blocks_testimonials_items" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_cloud_logos_order_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_logos_parent_id_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_logos_image_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_cloud_order_idx" ON "pages_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_parent_id_idx" ON "pages_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_path_idx" ON "pages_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_showcase_order_idx" ON "pages_blocks_product_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_showcase_parent_id_idx" ON "pages_blocks_product_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_showcase_path_idx" ON "pages_blocks_product_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_order_idx" ON "pages_blocks_split_feature" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_parent_id_idx" ON "pages_blocks_split_feature" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_feature_path_idx" ON "pages_blocks_split_feature" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_media_idx" ON "pages_blocks_split_feature" USING btree ("media_id");
  CREATE INDEX "pages_blocks_service_showcase_order_idx" ON "pages_blocks_service_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_showcase_parent_id_idx" ON "pages_blocks_service_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_showcase_path_idx" ON "pages_blocks_service_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_version_hero_trust_items_order_idx" ON "_pages_v_version_hero_trust_items" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_trust_items_parent_id_idx" ON "_pages_v_version_hero_trust_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_photo_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_order_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_parent_id_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_image_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_order_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_parent_id_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_path_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_showcase_order_idx" ON "_pages_v_blocks_product_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_showcase_parent_id_idx" ON "_pages_v_blocks_product_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_showcase_path_idx" ON "_pages_v_blocks_product_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_order_idx" ON "_pages_v_blocks_split_feature" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_parent_id_idx" ON "_pages_v_blocks_split_feature" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_feature_path_idx" ON "_pages_v_blocks_split_feature" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_media_idx" ON "_pages_v_blocks_split_feature" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_service_showcase_order_idx" ON "_pages_v_blocks_service_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_showcase_parent_id_idx" ON "_pages_v_blocks_service_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_showcase_path_idx" ON "_pages_v_blocks_service_showcase" USING btree ("_path");
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items" ADD CONSTRAINT "_pages_v_blocks_features_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_features_items_icon_idx" ON "pages_blocks_features_items" USING btree ("icon_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_blocks_features_items_icon_idx" ON "_pages_v_blocks_features_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_trust_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_cloud_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_cloud" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_product_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_newsletter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_trust_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_cloud" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_product_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_newsletter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_showcase" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_trust_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_product_showcase" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_split_feature" CASCADE;
  DROP TABLE "pages_blocks_service_showcase" CASCADE;
  DROP TABLE "_pages_v_version_hero_trust_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_product_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature" CASCADE;
  DROP TABLE "_pages_v_blocks_service_showcase" CASCADE;
  ALTER TABLE "pages_blocks_features_items" DROP CONSTRAINT "pages_blocks_features_items_icon_id_media_id_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_services_fk";
  
  ALTER TABLE "_pages_v_blocks_features_items" DROP CONSTRAINT "_pages_v_blocks_features_items_icon_id_media_id_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_services_fk";
  
  ALTER TABLE "pages_blocks_banner" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_banner" ALTER COLUMN "style" SET DEFAULT 'info'::text;
  DROP TYPE "public"."enum_pages_blocks_banner_style";
  CREATE TYPE "public"."enum_pages_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  ALTER TABLE "pages_blocks_banner" ALTER COLUMN "style" SET DEFAULT 'info'::"public"."enum_pages_blocks_banner_style";
  ALTER TABLE "pages_blocks_banner" ALTER COLUMN "style" SET DATA TYPE "public"."enum_pages_blocks_banner_style" USING "style"::"public"."enum_pages_blocks_banner_style";
  ALTER TABLE "pages_blocks_features" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_features" ALTER COLUMN "layout" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum_pages_blocks_features_layout";
  CREATE TYPE "public"."enum_pages_blocks_features_layout" AS ENUM('cards', 'minimal');
  ALTER TABLE "pages_blocks_features" ALTER COLUMN "layout" SET DEFAULT 'cards'::"public"."enum_pages_blocks_features_layout";
  ALTER TABLE "pages_blocks_features" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_features_layout" USING "layout"::"public"."enum_pages_blocks_features_layout";
  ALTER TABLE "_pages_v_blocks_banner" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_banner" ALTER COLUMN "style" SET DEFAULT 'info'::text;
  DROP TYPE "public"."enum__pages_v_blocks_banner_style";
  CREATE TYPE "public"."enum__pages_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  ALTER TABLE "_pages_v_blocks_banner" ALTER COLUMN "style" SET DEFAULT 'info'::"public"."enum__pages_v_blocks_banner_style";
  ALTER TABLE "_pages_v_blocks_banner" ALTER COLUMN "style" SET DATA TYPE "public"."enum__pages_v_blocks_banner_style" USING "style"::"public"."enum__pages_v_blocks_banner_style";
  ALTER TABLE "_pages_v_blocks_features" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_features" ALTER COLUMN "layout" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum__pages_v_blocks_features_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_features_layout" AS ENUM('cards', 'minimal');
  ALTER TABLE "_pages_v_blocks_features" ALTER COLUMN "layout" SET DEFAULT 'cards'::"public"."enum__pages_v_blocks_features_layout";
  ALTER TABLE "_pages_v_blocks_features" ALTER COLUMN "layout" SET DATA TYPE "public"."enum__pages_v_blocks_features_layout" USING "layout"::"public"."enum__pages_v_blocks_features_layout";
  DROP INDEX "pages_blocks_features_items_icon_idx";
  DROP INDEX "pages_rels_services_id_idx";
  DROP INDEX "_pages_v_blocks_features_items_icon_idx";
  DROP INDEX "_pages_v_rels_services_id_idx";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "icon_id";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "enable_link";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "link_appearance";
  ALTER TABLE "pages" DROP COLUMN "hero_enable_trust_row";
  ALTER TABLE "pages_rels" DROP COLUMN "services_id";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "icon_id";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "enable_link";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "link_appearance";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_enable_trust_row";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "services_id";
  DROP TYPE "public"."enum_pages_blocks_features_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_features_items_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_testimonials_align";
  DROP TYPE "public"."enum_pages_blocks_testimonials_layout";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_align";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_layout";
  DROP TYPE "public"."enum_pages_blocks_stats_align";
  DROP TYPE "public"."enum_pages_blocks_stats_layout";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_align";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_layout";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_populate_by";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_link_type";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_newsletter_align";
  DROP TYPE "public"."enum_pages_blocks_split_feature_align";
  DROP TYPE "public"."enum_pages_blocks_split_feature_image_position";
  DROP TYPE "public"."enum_pages_blocks_split_feature_link_type";
  DROP TYPE "public"."enum_pages_blocks_split_feature_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_service_showcase_align";
  DROP TYPE "public"."enum_pages_blocks_service_showcase_populate_by";
  DROP TYPE "public"."enum_pages_blocks_service_showcase_link_type";
  DROP TYPE "public"."enum_pages_blocks_service_showcase_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_features_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_features_items_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_align";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_layout";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_align";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_layout";
  DROP TYPE "public"."enum__pages_v_blocks_stats_align";
  DROP TYPE "public"."enum__pages_v_blocks_stats_layout";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_align";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_layout";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_align";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_align";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_service_showcase_align";
  DROP TYPE "public"."enum__pages_v_blocks_service_showcase_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_service_showcase_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_service_showcase_link_appearance";`)
}
