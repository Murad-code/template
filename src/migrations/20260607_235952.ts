import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$
  BEGIN
    CREATE TYPE "public"."enum_pages_blocks_cta_layout" AS ENUM('inlineCard', 'splitPanel');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum_pages_blocks_features_layout" AS ENUM('cards', 'minimal');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_cta_layout" AS ENUM('inlineCard', 'splitPanel');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_features_layout" AS ENUM('cards', 'minimal');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum_products_blocks_cta_layout" AS ENUM('inlineCard', 'splitPanel');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum__products_v_blocks_cta_layout" AS ENUM('inlineCard', 'splitPanel');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum_site_theme_palette_mode" AS ENUM('palette', 'custom');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE IF NOT EXISTS 'landingSplit';
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE IF NOT EXISTS 'landingSpotlight';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE IF NOT EXISTS 'landingSplit';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE IF NOT EXISTS 'landingSpotlight';
  CREATE TABLE IF NOT EXISTS "theme_palettes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"is_system" boolean DEFAULT false,
  	"color1" varchar,
  	"color2" varchar,
  	"color3" varchar,
  	"color4" varchar,
  	"color5" varchar,
  	"light_text" varchar,
  	"dark_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"palette_mode" "enum_site_theme_palette_mode" DEFAULT 'palette' NOT NULL,
  	"palette_id" integer,
  	"custom_palette_color1" varchar,
  	"custom_palette_color2" varchar,
  	"custom_palette_color3" varchar,
  	"custom_palette_color4" varchar,
  	"custom_palette_color5" varchar,
  	"custom_palette_light_text" varchar,
  	"custom_palette_dark_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_cta" ADD COLUMN IF NOT EXISTS "layout" "enum_pages_blocks_cta_layout" DEFAULT 'inlineCard';
  ALTER TABLE "pages_blocks_features" ADD COLUMN IF NOT EXISTS "layout" "enum_pages_blocks_features_layout" DEFAULT 'cards';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN IF NOT EXISTS "layout" "enum__pages_v_blocks_cta_layout" DEFAULT 'inlineCard';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN IF NOT EXISTS "layout" "enum__pages_v_blocks_features_layout" DEFAULT 'cards';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "products_blocks_cta" ADD COLUMN IF NOT EXISTS "layout" "enum_products_blocks_cta_layout" DEFAULT 'inlineCard';
  ALTER TABLE "_products_v_blocks_cta" ADD COLUMN IF NOT EXISTS "layout" "enum__products_v_blocks_cta_layout" DEFAULT 'inlineCard';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "theme_palettes_id" integer;
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'site_theme_palette_id_theme_palettes_id_fk'
    ) THEN
      ALTER TABLE "site_theme"
      ADD CONSTRAINT "site_theme_palette_id_theme_palettes_id_fk"
      FOREIGN KEY ("palette_id") REFERENCES "public"."theme_palettes"("id")
      ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;
  CREATE UNIQUE INDEX IF NOT EXISTS "theme_palettes_key_idx" ON "theme_palettes" USING btree ("key");
  CREATE UNIQUE INDEX IF NOT EXISTS "theme_palettes_name_idx" ON "theme_palettes" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "theme_palettes_updated_at_idx" ON "theme_palettes" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "theme_palettes_created_at_idx" ON "theme_palettes" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "site_theme_palette_idx" ON "site_theme" USING btree ("palette_id");
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'services_image_id_media_id_fk'
    ) THEN
      ALTER TABLE "services"
      ADD CONSTRAINT "services_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'payload_locked_documents_rels_theme_palettes_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_theme_palettes_fk"
      FOREIGN KEY ("theme_palettes_id") REFERENCES "public"."theme_palettes"("id")
      ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_theme_palettes_id_idx" ON "payload_locked_documents_rels" USING btree ("theme_palettes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "theme_palettes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_theme" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "theme_palettes" CASCADE;
  DROP TABLE "site_theme" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_theme_palettes_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "services_image_idx";
  DROP INDEX "payload_locked_documents_rels_theme_palettes_id_idx";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "layout";
  ALTER TABLE "services" DROP COLUMN "image_id";
  ALTER TABLE "products_blocks_cta" DROP COLUMN "layout";
  ALTER TABLE "_products_v_blocks_cta" DROP COLUMN "layout";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "theme_palettes_id";
  DROP TYPE "public"."enum_pages_blocks_cta_layout";
  DROP TYPE "public"."enum_pages_blocks_features_layout";
  DROP TYPE "public"."enum__pages_v_blocks_cta_layout";
  DROP TYPE "public"."enum__pages_v_blocks_features_layout";
  DROP TYPE "public"."enum_products_blocks_cta_layout";
  DROP TYPE "public"."enum__products_v_blocks_cta_layout";
  DROP TYPE "public"."enum_site_theme_palette_mode";`)
}
