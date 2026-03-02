-- CreateEnum
CREATE TYPE "PrayerVisibility" AS ENUM ('PRIVATE', 'FOLLOWERS', 'PUBLIC');

-- Add visibility column with default
ALTER TABLE "prayers" ADD COLUMN "visibility" "PrayerVisibility" NOT NULL DEFAULT 'PRIVATE';

-- Backfill: is_public=true → FOLLOWERS, is_public=false → PRIVATE
UPDATE "prayers" SET "visibility" = 'FOLLOWERS' WHERE "is_public" = true;

-- Drop the old column
ALTER TABLE "prayers" DROP COLUMN "is_public";
