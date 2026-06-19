import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_theme_typography_body_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  CREATE TYPE "public"."enum_site_theme_typography_heading_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  CREATE TYPE "public"."enum_site_theme_typography_mono_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  ALTER TABLE "site_theme" ADD COLUMN "typography_body_font" "enum_site_theme_typography_body_font" DEFAULT 'geist-sans' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN "typography_heading_font" "enum_site_theme_typography_heading_font" DEFAULT 'geist-sans' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN "typography_mono_font" "enum_site_theme_typography_mono_font" DEFAULT 'geist-mono' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN "dark_palette_id" integer;
  ALTER TABLE "site_theme" ADD CONSTRAINT "site_theme_dark_palette_id_theme_palettes_id_fk" FOREIGN KEY ("dark_palette_id") REFERENCES "public"."theme_palettes"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_theme_dark_palette_idx" ON "site_theme" USING btree ("dark_palette_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_theme" DROP CONSTRAINT "site_theme_dark_palette_id_theme_palettes_id_fk";
  
  DROP INDEX "site_theme_dark_palette_idx";
  ALTER TABLE "site_theme" DROP COLUMN "typography_body_font";
  ALTER TABLE "site_theme" DROP COLUMN "typography_heading_font";
  ALTER TABLE "site_theme" DROP COLUMN "typography_mono_font";
  ALTER TABLE "site_theme" DROP COLUMN "dark_palette_id";
  DROP TYPE "public"."enum_site_theme_typography_body_font";
  DROP TYPE "public"."enum_site_theme_typography_heading_font";
  DROP TYPE "public"."enum_site_theme_typography_mono_font";`)
}
