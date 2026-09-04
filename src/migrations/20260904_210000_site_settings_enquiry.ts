import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_enquiry_recipient_source" AS ENUM('customEmail', 'adminUser');
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_email" varchar,
  	"public_phone" varchar,
  	"public_address" varchar,
  	"enquiry_recipient_source" "enum_site_settings_enquiry_recipient_source" DEFAULT 'customEmail',
  	"enquiry_email" varchar,
  	"enquiry_admin_user_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_enquiry_admin_user_id_users_id_fk" FOREIGN KEY ("enquiry_admin_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_enquiry_admin_user_idx" ON "site_settings" USING btree ("enquiry_admin_user_id");
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "show_site_contact_details" boolean;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "show_site_contact_details" boolean;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_form_block" DROP COLUMN IF EXISTS "show_site_contact_details";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN IF EXISTS "show_site_contact_details";
  DROP TABLE IF EXISTS "site_settings" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_site_settings_enquiry_recipient_source";
  `)
}
