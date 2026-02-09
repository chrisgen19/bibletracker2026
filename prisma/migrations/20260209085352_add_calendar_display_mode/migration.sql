-- CreateEnum
CREATE TYPE "CalendarDisplayMode" AS ENUM ('DOTS_ONLY', 'REFERENCES_WITH_DOTS', 'REFERENCES_ONLY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "calendar_display_mode" "CalendarDisplayMode" NOT NULL DEFAULT 'REFERENCES_WITH_DOTS';
