-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "show_missed_days" BOOLEAN NOT NULL DEFAULT true;
