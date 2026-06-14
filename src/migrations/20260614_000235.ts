import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$
  BEGIN
    CREATE TYPE "public"."enum_admins_roles" AS ENUM('root', 'admin');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum_site_theme_typography_body_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum_site_theme_typography_heading_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  DO $$
  BEGIN
    CREATE TYPE "public"."enum_site_theme_typography_mono_font" AS ENUM('geist-sans', 'inter', 'source-sans-3', 'nunito-sans', 'space-grotesk', 'montserrat', 'system-sans', 'playfair-display', 'lora', 'merriweather', 'dm-serif-display', 'system-serif', 'geist-mono', 'jetbrains-mono', 'fira-code', 'ibm-plex-mono', 'source-code-pro', 'roboto-mono', 'system-mono');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  CREATE TABLE IF NOT EXISTS "admins_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_admins_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE IF EXISTS "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "users_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "users" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "users_roles" CASCADE;
  DROP TABLE IF EXISTS "users_sessions" CASCADE;
  DROP TABLE IF EXISTS "users" CASCADE;
  ALTER TABLE "booking_slots" DROP CONSTRAINT IF EXISTS "booking_slots_staff_id_users_id_fk";
  
  ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_customer_id_users_id_fk";
  
  ALTER TABLE "addresses" DROP CONSTRAINT IF EXISTS "addresses_customer_id_users_id_fk";
  
  ALTER TABLE "carts" DROP CONSTRAINT IF EXISTS "carts_customer_id_users_id_fk";
  
  ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_customer_id_users_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_customer_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_users_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_users_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_users_id_idx";
  DROP INDEX IF EXISTS "payload_preferences_rels_users_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "admins_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "customers_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "admins_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "customers_id" integer;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "typography_body_font" "enum_site_theme_typography_body_font" DEFAULT 'geist-sans' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "typography_heading_font" "enum_site_theme_typography_heading_font" DEFAULT 'geist-sans' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "typography_mono_font" "enum_site_theme_typography_mono_font" DEFAULT 'geist-mono' NOT NULL;
  ALTER TABLE "site_theme" ADD COLUMN IF NOT EXISTS "dark_palette_id" integer;
  DO $$ BEGIN ALTER TABLE "admins_roles" ADD CONSTRAINT "admins_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "admins_roles_order_idx" ON "admins_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "admins_roles_parent_idx" ON "admins_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_idx" ON "customers" USING btree ("email");
  -- Existing rows may still point at legacy users IDs. Clear foreign keys before re-attaching constraints.
  UPDATE "booking_slots" SET "staff_id" = NULL;
  UPDATE "bookings" SET "customer_id" = NULL;
  UPDATE "addresses" SET "customer_id" = NULL;
  UPDATE "carts" SET "customer_id" = NULL;
  UPDATE "orders" SET "customer_id" = NULL;
  UPDATE "transactions" SET "customer_id" = NULL;
  DO $$ BEGIN ALTER TABLE "booking_slots" ADD CONSTRAINT "booking_slots_staff_id_admins_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "site_theme" ADD CONSTRAINT "site_theme_dark_palette_id_theme_palettes_id_fk" FOREIGN KEY ("dark_palette_id") REFERENCES "public"."theme_palettes"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX IF NOT EXISTS "site_theme_dark_palette_idx" ON "site_theme" USING btree ("dark_palette_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "users_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "users_id";
  DROP TYPE IF EXISTS "public"."enum_users_roles";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'customer');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "admins_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admins_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admins" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "admins_roles" CASCADE;
  DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  ALTER TABLE "booking_slots" DROP CONSTRAINT "booking_slots_staff_id_admins_id_fk";
  
  ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customer_id_customers_id_fk";
  
  ALTER TABLE "addresses" DROP CONSTRAINT "addresses_customer_id_customers_id_fk";
  
  ALTER TABLE "carts" DROP CONSTRAINT "carts_customer_id_customers_id_fk";
  
  ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_customers_id_fk";
  
  ALTER TABLE "transactions" DROP CONSTRAINT "transactions_customer_id_customers_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_admins_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_admins_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_customers_fk";
  
  ALTER TABLE "site_theme" DROP CONSTRAINT "site_theme_dark_palette_id_theme_palettes_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_admins_id_idx";
  DROP INDEX "payload_locked_documents_rels_customers_id_idx";
  DROP INDEX "payload_preferences_rels_admins_id_idx";
  DROP INDEX "payload_preferences_rels_customers_id_idx";
  DROP INDEX "site_theme_dark_palette_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  ALTER TABLE "booking_slots" ADD CONSTRAINT "booking_slots_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "admins_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "customers_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "admins_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "customers_id";
  ALTER TABLE "site_theme" DROP COLUMN "typography_body_font";
  ALTER TABLE "site_theme" DROP COLUMN "typography_heading_font";
  ALTER TABLE "site_theme" DROP COLUMN "typography_mono_font";
  ALTER TABLE "site_theme" DROP COLUMN "dark_palette_id";
  DROP TYPE "public"."enum_admins_roles";
  DROP TYPE "public"."enum_site_theme_typography_body_font";
  DROP TYPE "public"."enum_site_theme_typography_heading_font";
  DROP TYPE "public"."enum_site_theme_typography_mono_font";`)
}
