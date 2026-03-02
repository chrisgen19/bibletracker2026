-- CreateEnum
CREATE TYPE "PrayerVisibility" AS ENUM ('PRIVATE', 'FOLLOWERS', 'PUBLIC');

-- Add visibility column with default
ALTER TABLE "prayers" ADD COLUMN "visibility" "PrayerVisibility" NOT NULL DEFAULT 'PRIVATE';

-- Backfill: is_public=true → PUBLIC (preserve existing public visibility), is_public=false → PRIVATE
UPDATE "prayers" SET "visibility" = 'PUBLIC' WHERE "is_public" = true;

-- Drop the old column
ALTER TABLE "prayers" DROP COLUMN "is_public";
