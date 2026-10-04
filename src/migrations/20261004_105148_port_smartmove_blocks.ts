import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_carousel_slides_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_hero_carousel_slides_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_carousel_min_height" AS ENUM('standard', 'tall', 'full');
  CREATE TYPE "public"."enum_pages_blocks_cta_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_cta_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_content_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_content_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_media_block_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_media_block_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_archive_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_archive_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_carousel_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_carousel_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_three_item_grid_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_three_item_grid_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_banner_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_banner_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_form_block_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_form_block_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_faq_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_faq_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_features_items_icon_name" AS ENUM('award', 'badgeCheck', 'banknote', 'calendar', 'check', 'clipboardCheck', 'clock', 'coffee', 'compass', 'creditCard', 'gift', 'globe', 'graduationCap', 'handshake', 'headphones', 'heart', 'house', 'key', 'leaf', 'lifeBuoy', 'lock', 'mail', 'mapPin', 'messageCircle', 'package', 'phone', 'pound', 'rocket', 'search', 'settings', 'shield', 'sparkles', 'star', 'thumbsUp', 'timer', 'trendingUp', 'truck', 'users', 'wrench', 'zap');
  CREATE TYPE "public"."enum_pages_blocks_features_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_features_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_stats_items_icon_name" AS ENUM('award', 'badgeCheck', 'banknote', 'calendar', 'check', 'clipboardCheck', 'clock', 'coffee', 'compass', 'creditCard', 'gift', 'globe', 'graduationCap', 'handshake', 'headphones', 'heart', 'house', 'key', 'leaf', 'lifeBuoy', 'lock', 'mail', 'mapPin', 'messageCircle', 'package', 'phone', 'pound', 'rocket', 'search', 'settings', 'shield', 'sparkles', 'star', 'thumbsUp', 'timer', 'trendingUp', 'truck', 'users', 'wrench', 'zap');
  CREATE TYPE "public"."enum_pages_blocks_stats_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_stats_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_product_showcase_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_pages_blocks_service_showcase_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_pages_blocks_service_showcase_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_carousel_slides_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_carousel_slides_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_carousel_min_height" AS ENUM('standard', 'tall', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_content_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_content_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_three_item_grid_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_three_item_grid_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_features_items_icon_name" AS ENUM('award', 'badgeCheck', 'banknote', 'calendar', 'check', 'clipboardCheck', 'clock', 'coffee', 'compass', 'creditCard', 'gift', 'globe', 'graduationCap', 'handshake', 'headphones', 'heart', 'house', 'key', 'leaf', 'lifeBuoy', 'lock', 'mail', 'mapPin', 'messageCircle', 'package', 'phone', 'pound', 'rocket', 'search', 'settings', 'shield', 'sparkles', 'star', 'thumbsUp', 'timer', 'trendingUp', 'truck', 'users', 'wrench', 'zap');
  CREATE TYPE "public"."enum__pages_v_blocks_features_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_features_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_items_icon_name" AS ENUM('award', 'badgeCheck', 'banknote', 'calendar', 'check', 'clipboardCheck', 'clock', 'coffee', 'compass', 'creditCard', 'gift', 'globe', 'graduationCap', 'handshake', 'headphones', 'heart', 'house', 'key', 'leaf', 'lifeBuoy', 'lock', 'mail', 'mapPin', 'messageCircle', 'package', 'phone', 'pound', 'rocket', 'search', 'settings', 'shield', 'sparkles', 'star', 'thumbsUp', 'timer', 'trendingUp', 'truck', 'users', 'wrench', 'zap');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_product_showcase_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_service_showcase_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__pages_v_blocks_service_showcase_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_products_blocks_cta_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_products_blocks_cta_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_products_blocks_content_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_products_blocks_content_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum_products_blocks_media_block_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum_products_blocks_media_block_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__products_v_blocks_cta_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__products_v_blocks_cta_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__products_v_blocks_content_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__products_v_blocks_content_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  CREATE TYPE "public"."enum__products_v_blocks_media_block_background" AS ENUM('default', 'muted', 'soft', 'inverse');
  CREATE TYPE "public"."enum__products_v_blocks_media_block_spacing" AS ENUM('default', 'tight', 'loose', 'none');
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_theme_typography_body_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_theme_typography_heading_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_site_theme_typography_mono_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE "pages_blocks_hero_carousel_slides_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_hero_carousel_slides_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_hero_carousel_slides_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_hero_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero_carousel_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"min_height" "enum_pages_blocks_hero_carousel_min_height" DEFAULT 'tall',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_feature_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_slides_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_hero_carousel_slides_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_hero_carousel_slides_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"min_height" "enum__pages_v_blocks_hero_carousel_min_height" DEFAULT 'tall',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "background" "enum_pages_blocks_cta_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "spacing" "enum_pages_blocks_cta_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_content" ADD COLUMN "background" "enum_pages_blocks_content_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_content" ADD COLUMN "spacing" "enum_pages_blocks_content_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "background" "enum_pages_blocks_media_block_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "spacing" "enum_pages_blocks_media_block_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "background" "enum_pages_blocks_archive_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "spacing" "enum_pages_blocks_archive_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_carousel" ADD COLUMN "background" "enum_pages_blocks_carousel_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_carousel" ADD COLUMN "spacing" "enum_pages_blocks_carousel_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_three_item_grid" ADD COLUMN "background" "enum_pages_blocks_three_item_grid_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_three_item_grid" ADD COLUMN "spacing" "enum_pages_blocks_three_item_grid_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_banner" ADD COLUMN "background" "enum_pages_blocks_banner_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_banner" ADD COLUMN "spacing" "enum_pages_blocks_banner_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "background" "enum_pages_blocks_form_block_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "spacing" "enum_pages_blocks_form_block_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "background" "enum_pages_blocks_faq_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "spacing" "enum_pages_blocks_faq_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_features_items" ADD COLUMN "icon_name" "enum_pages_blocks_features_items_icon_name";
  ALTER TABLE "pages_blocks_features" ADD COLUMN "background" "enum_pages_blocks_features_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "spacing" "enum_pages_blocks_features_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "align" "enum_pages_blocks_features_align" DEFAULT 'left';
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "background" "enum_pages_blocks_testimonials_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN "spacing" "enum_pages_blocks_testimonials_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_logo_cloud" ADD COLUMN "background" "enum_pages_blocks_logo_cloud_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_logo_cloud" ADD COLUMN "spacing" "enum_pages_blocks_logo_cloud_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_stats_items" ADD COLUMN "icon_name" "enum_pages_blocks_stats_items_icon_name";
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "background" "enum_pages_blocks_stats_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "spacing" "enum_pages_blocks_stats_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "count_up" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_product_showcase" ADD COLUMN "background" "enum_pages_blocks_product_showcase_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_product_showcase" ADD COLUMN "spacing" "enum_pages_blocks_product_showcase_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_newsletter" ADD COLUMN "background" "enum_pages_blocks_newsletter_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_newsletter" ADD COLUMN "spacing" "enum_pages_blocks_newsletter_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "background" "enum_pages_blocks_split_feature_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "spacing" "enum_pages_blocks_split_feature_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "ken_burns" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_service_showcase" ADD COLUMN "background" "enum_pages_blocks_service_showcase_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_service_showcase" ADD COLUMN "spacing" "enum_pages_blocks_service_showcase_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "background" "enum__pages_v_blocks_cta_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "spacing" "enum__pages_v_blocks_cta_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "background" "enum__pages_v_blocks_content_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "spacing" "enum__pages_v_blocks_content_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "background" "enum__pages_v_blocks_media_block_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "spacing" "enum__pages_v_blocks_media_block_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "background" "enum__pages_v_blocks_archive_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "spacing" "enum__pages_v_blocks_archive_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_carousel" ADD COLUMN "background" "enum__pages_v_blocks_carousel_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_carousel" ADD COLUMN "spacing" "enum__pages_v_blocks_carousel_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_three_item_grid" ADD COLUMN "background" "enum__pages_v_blocks_three_item_grid_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_three_item_grid" ADD COLUMN "spacing" "enum__pages_v_blocks_three_item_grid_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_banner" ADD COLUMN "background" "enum__pages_v_blocks_banner_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_banner" ADD COLUMN "spacing" "enum__pages_v_blocks_banner_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "background" "enum__pages_v_blocks_form_block_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "spacing" "enum__pages_v_blocks_form_block_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "background" "enum__pages_v_blocks_faq_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "spacing" "enum__pages_v_blocks_faq_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_features_items" ADD COLUMN "icon_name" "enum__pages_v_blocks_features_items_icon_name";
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "background" "enum__pages_v_blocks_features_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "spacing" "enum__pages_v_blocks_features_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "align" "enum__pages_v_blocks_features_align" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN "background" "enum__pages_v_blocks_testimonials_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN "spacing" "enum__pages_v_blocks_testimonials_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_logo_cloud" ADD COLUMN "background" "enum__pages_v_blocks_logo_cloud_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_logo_cloud" ADD COLUMN "spacing" "enum__pages_v_blocks_logo_cloud_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_stats_items" ADD COLUMN "icon_name" "enum__pages_v_blocks_stats_items_icon_name";
  ALTER TABLE "_pages_v_blocks_stats" ADD COLUMN "background" "enum__pages_v_blocks_stats_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_stats" ADD COLUMN "spacing" "enum__pages_v_blocks_stats_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_stats" ADD COLUMN "count_up" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_product_showcase" ADD COLUMN "background" "enum__pages_v_blocks_product_showcase_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_product_showcase" ADD COLUMN "spacing" "enum__pages_v_blocks_product_showcase_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_newsletter" ADD COLUMN "background" "enum__pages_v_blocks_newsletter_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_newsletter" ADD COLUMN "spacing" "enum__pages_v_blocks_newsletter_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "background" "enum__pages_v_blocks_split_feature_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "spacing" "enum__pages_v_blocks_split_feature_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "ken_burns" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_service_showcase" ADD COLUMN "background" "enum__pages_v_blocks_service_showcase_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_service_showcase" ADD COLUMN "spacing" "enum__pages_v_blocks_service_showcase_spacing" DEFAULT 'default';
  ALTER TABLE "products_blocks_cta" ADD COLUMN "background" "enum_products_blocks_cta_background" DEFAULT 'default';
  ALTER TABLE "products_blocks_cta" ADD COLUMN "spacing" "enum_products_blocks_cta_spacing" DEFAULT 'default';
  ALTER TABLE "products_blocks_content" ADD COLUMN "background" "enum_products_blocks_content_background" DEFAULT 'default';
  ALTER TABLE "products_blocks_content" ADD COLUMN "spacing" "enum_products_blocks_content_spacing" DEFAULT 'default';
  ALTER TABLE "products_blocks_media_block" ADD COLUMN "background" "enum_products_blocks_media_block_background" DEFAULT 'default';
  ALTER TABLE "products_blocks_media_block" ADD COLUMN "spacing" "enum_products_blocks_media_block_spacing" DEFAULT 'default';
  ALTER TABLE "_products_v_blocks_cta" ADD COLUMN "background" "enum__products_v_blocks_cta_background" DEFAULT 'default';
  ALTER TABLE "_products_v_blocks_cta" ADD COLUMN "spacing" "enum__products_v_blocks_cta_spacing" DEFAULT 'default';
  ALTER TABLE "_products_v_blocks_content" ADD COLUMN "background" "enum__products_v_blocks_content_background" DEFAULT 'default';
  ALTER TABLE "_products_v_blocks_content" ADD COLUMN "spacing" "enum__products_v_blocks_content_spacing" DEFAULT 'default';
  ALTER TABLE "_products_v_blocks_media_block" ADD COLUMN "background" "enum__products_v_blocks_media_block_background" DEFAULT 'default';
  ALTER TABLE "_products_v_blocks_media_block" ADD COLUMN "spacing" "enum__products_v_blocks_media_block_spacing" DEFAULT 'default';
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "typography_body_font" "enum_site_theme_typography_body_font" DEFAULT 'geist-sans' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "typography_heading_font" "enum_site_theme_typography_heading_font" DEFAULT 'geist-sans' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "typography_mono_font" "enum_site_theme_typography_mono_font" DEFAULT 'geist-mono' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "dark_palette_id" integer;
  ALTER TABLE "pages_blocks_hero_carousel_slides_links" ADD CONSTRAINT "pages_blocks_hero_carousel_slides_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_slides" ADD CONSTRAINT "pages_blocks_hero_carousel_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_slides" ADD CONSTRAINT "pages_blocks_hero_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_highlights" ADD CONSTRAINT "pages_blocks_hero_carousel_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel" ADD CONSTRAINT "pages_blocks_hero_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_items" ADD CONSTRAINT "pages_blocks_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee" ADD CONSTRAINT "pages_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_points" ADD CONSTRAINT "pages_blocks_split_feature_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides_links" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_slides_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_highlights" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee_items" ADD CONSTRAINT "_pages_v_blocks_marquee_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee" ADD CONSTRAINT "_pages_v_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_points" ADD CONSTRAINT "_pages_v_blocks_split_feature_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_carousel_slides_links_order_idx" ON "pages_blocks_hero_carousel_slides_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_slides_links_parent_id_idx" ON "pages_blocks_hero_carousel_slides_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_slides_order_idx" ON "pages_blocks_hero_carousel_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_slides_parent_id_idx" ON "pages_blocks_hero_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_slides_image_idx" ON "pages_blocks_hero_carousel_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_carousel_highlights_order_idx" ON "pages_blocks_hero_carousel_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_highlights_parent_id_idx" ON "pages_blocks_hero_carousel_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_order_idx" ON "pages_blocks_hero_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_parent_id_idx" ON "pages_blocks_hero_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_path_idx" ON "pages_blocks_hero_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_marquee_items_order_idx" ON "pages_blocks_marquee_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_items_parent_id_idx" ON "pages_blocks_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_order_idx" ON "pages_blocks_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_parent_id_idx" ON "pages_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_path_idx" ON "pages_blocks_marquee" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_points_order_idx" ON "pages_blocks_split_feature_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_points_parent_id_idx" ON "pages_blocks_split_feature_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_links_order_idx" ON "_pages_v_blocks_hero_carousel_slides_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_links_parent_id_idx" ON "_pages_v_blocks_hero_carousel_slides_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_order_idx" ON "_pages_v_blocks_hero_carousel_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_parent_id_idx" ON "_pages_v_blocks_hero_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_image_idx" ON "_pages_v_blocks_hero_carousel_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_highlights_order_idx" ON "_pages_v_blocks_hero_carousel_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_highlights_parent_id_idx" ON "_pages_v_blocks_hero_carousel_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_order_idx" ON "_pages_v_blocks_hero_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_parent_id_idx" ON "_pages_v_blocks_hero_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_path_idx" ON "_pages_v_blocks_hero_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_marquee_items_order_idx" ON "_pages_v_blocks_marquee_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_items_parent_id_idx" ON "_pages_v_blocks_marquee_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_order_idx" ON "_pages_v_blocks_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_parent_id_idx" ON "_pages_v_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_path_idx" ON "_pages_v_blocks_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_points_order_idx" ON "_pages_v_blocks_split_feature_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_points_parent_id_idx" ON "_pages_v_blocks_split_feature_points" USING btree ("_parent_id");
  ALTER TABLE "site_theme" DROP CONSTRAINT IF EXISTS "site_theme_dark_palette_id_theme_palettes_id_fk";
  ALTER TABLE "site_theme" ADD CONSTRAINT "site_theme_dark_palette_id_theme_palettes_id_fk" FOREIGN KEY ("dark_palette_id") REFERENCES "public"."theme_palettes"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "site_theme_dark_palette_idx" ON "site_theme" USING btree ("dark_palette_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_carousel_slides_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_carousel_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_carousel_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_carousel_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_marquee_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature_points" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_carousel_slides_links" CASCADE;
  DROP TABLE "pages_blocks_hero_carousel_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_carousel_highlights" CASCADE;
  DROP TABLE "pages_blocks_hero_carousel" CASCADE;
  DROP TABLE "pages_blocks_marquee_items" CASCADE;
  DROP TABLE "pages_blocks_marquee" CASCADE;
  DROP TABLE "pages_blocks_split_feature_points" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_slides_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee_items" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_points" CASCADE;
  ALTER TABLE "site_theme" DROP CONSTRAINT IF EXISTS "site_theme_dark_palette_id_theme_palettes_id_fk";
  
  DROP INDEX IF EXISTS "site_theme_dark_palette_idx";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_carousel" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_carousel" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_three_item_grid" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_three_item_grid" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_banner" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_banner" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_features_items" DROP COLUMN "icon_name";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "align";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_logo_cloud" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_logo_cloud" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_stats_items" DROP COLUMN "icon_name";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "count_up";
  ALTER TABLE "pages_blocks_product_showcase" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_product_showcase" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_newsletter" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_newsletter" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "ken_burns";
  ALTER TABLE "pages_blocks_service_showcase" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_service_showcase" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_carousel" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_carousel" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_three_item_grid" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_three_item_grid" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_banner" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_banner" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_features_items" DROP COLUMN "icon_name";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "align";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_logo_cloud" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_logo_cloud" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_stats_items" DROP COLUMN "icon_name";
  ALTER TABLE "_pages_v_blocks_stats" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_stats" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_stats" DROP COLUMN "count_up";
  ALTER TABLE "_pages_v_blocks_product_showcase" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_product_showcase" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_newsletter" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_newsletter" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "ken_burns";
  ALTER TABLE "_pages_v_blocks_service_showcase" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_service_showcase" DROP COLUMN "spacing";
  ALTER TABLE "products_blocks_cta" DROP COLUMN "background";
  ALTER TABLE "products_blocks_cta" DROP COLUMN "spacing";
  ALTER TABLE "products_blocks_content" DROP COLUMN "background";
  ALTER TABLE "products_blocks_content" DROP COLUMN "spacing";
  ALTER TABLE "products_blocks_media_block" DROP COLUMN "background";
  ALTER TABLE "products_blocks_media_block" DROP COLUMN "spacing";
  ALTER TABLE "_products_v_blocks_cta" DROP COLUMN "background";
  ALTER TABLE "_products_v_blocks_cta" DROP COLUMN "spacing";
  ALTER TABLE "_products_v_blocks_content" DROP COLUMN "background";
  ALTER TABLE "_products_v_blocks_content" DROP COLUMN "spacing";
  ALTER TABLE "_products_v_blocks_media_block" DROP COLUMN "background";
  ALTER TABLE "_products_v_blocks_media_block" DROP COLUMN "spacing";
  ALTER TABLE "site_theme" DROP COLUMN "typography_body_font";
  ALTER TABLE "site_theme" DROP COLUMN "typography_heading_font";
  ALTER TABLE "site_theme" DROP COLUMN "typography_mono_font";
  ALTER TABLE "site_theme" DROP COLUMN "dark_palette_id";
  DROP TYPE "public"."enum_pages_blocks_hero_carousel_slides_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_hero_carousel_slides_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_hero_carousel_min_height";
  DROP TYPE "public"."enum_pages_blocks_cta_background";
  DROP TYPE "public"."enum_pages_blocks_cta_spacing";
  DROP TYPE "public"."enum_pages_blocks_content_background";
  DROP TYPE "public"."enum_pages_blocks_content_spacing";
  DROP TYPE "public"."enum_pages_blocks_media_block_background";
  DROP TYPE "public"."enum_pages_blocks_media_block_spacing";
  DROP TYPE "public"."enum_pages_blocks_archive_background";
  DROP TYPE "public"."enum_pages_blocks_archive_spacing";
  DROP TYPE "public"."enum_pages_blocks_carousel_background";
  DROP TYPE "public"."enum_pages_blocks_carousel_spacing";
  DROP TYPE "public"."enum_pages_blocks_three_item_grid_background";
  DROP TYPE "public"."enum_pages_blocks_three_item_grid_spacing";
  DROP TYPE "public"."enum_pages_blocks_banner_background";
  DROP TYPE "public"."enum_pages_blocks_banner_spacing";
  DROP TYPE "public"."enum_pages_blocks_form_block_background";
  DROP TYPE "public"."enum_pages_blocks_form_block_spacing";
  DROP TYPE "public"."enum_pages_blocks_faq_background";
  DROP TYPE "public"."enum_pages_blocks_faq_spacing";
  DROP TYPE "public"."enum_pages_blocks_features_items_icon_name";
  DROP TYPE "public"."enum_pages_blocks_features_background";
  DROP TYPE "public"."enum_pages_blocks_features_spacing";
  DROP TYPE "public"."enum_pages_blocks_features_align";
  DROP TYPE "public"."enum_pages_blocks_testimonials_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_spacing";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_background";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_spacing";
  DROP TYPE "public"."enum_pages_blocks_stats_items_icon_name";
  DROP TYPE "public"."enum_pages_blocks_stats_background";
  DROP TYPE "public"."enum_pages_blocks_stats_spacing";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_background";
  DROP TYPE "public"."enum_pages_blocks_product_showcase_spacing";
  DROP TYPE "public"."enum_pages_blocks_newsletter_background";
  DROP TYPE "public"."enum_pages_blocks_newsletter_spacing";
  DROP TYPE "public"."enum_pages_blocks_split_feature_background";
  DROP TYPE "public"."enum_pages_blocks_split_feature_spacing";
  DROP TYPE "public"."enum_pages_blocks_service_showcase_background";
  DROP TYPE "public"."enum_pages_blocks_service_showcase_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_hero_carousel_slides_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_carousel_slides_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_hero_carousel_min_height";
  DROP TYPE "public"."enum__pages_v_blocks_cta_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_content_background";
  DROP TYPE "public"."enum__pages_v_blocks_content_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_background";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_archive_background";
  DROP TYPE "public"."enum__pages_v_blocks_archive_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_background";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_three_item_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_three_item_grid_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_banner_background";
  DROP TYPE "public"."enum__pages_v_blocks_banner_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_background";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_faq_background";
  DROP TYPE "public"."enum__pages_v_blocks_faq_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_features_items_icon_name";
  DROP TYPE "public"."enum__pages_v_blocks_features_background";
  DROP TYPE "public"."enum__pages_v_blocks_features_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_features_align";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_background";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_stats_items_icon_name";
  DROP TYPE "public"."enum__pages_v_blocks_stats_background";
  DROP TYPE "public"."enum__pages_v_blocks_stats_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_background";
  DROP TYPE "public"."enum__pages_v_blocks_product_showcase_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_background";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_background";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_service_showcase_background";
  DROP TYPE "public"."enum__pages_v_blocks_service_showcase_spacing";
  DROP TYPE "public"."enum_products_blocks_cta_background";
  DROP TYPE "public"."enum_products_blocks_cta_spacing";
  DROP TYPE "public"."enum_products_blocks_content_background";
  DROP TYPE "public"."enum_products_blocks_content_spacing";
  DROP TYPE "public"."enum_products_blocks_media_block_background";
  DROP TYPE "public"."enum_products_blocks_media_block_spacing";
  DROP TYPE "public"."enum__products_v_blocks_cta_background";
  DROP TYPE "public"."enum__products_v_blocks_cta_spacing";
  DROP TYPE "public"."enum__products_v_blocks_content_background";
  DROP TYPE "public"."enum__products_v_blocks_content_spacing";
  DROP TYPE "public"."enum__products_v_blocks_media_block_background";
  DROP TYPE "public"."enum__products_v_blocks_media_block_spacing";
  DROP TYPE "public"."enum_site_theme_typography_body_font";
  DROP TYPE "public"."enum_site_theme_typography_heading_font";
  DROP TYPE "public"."enum_site_theme_typography_mono_font";
`)
}
