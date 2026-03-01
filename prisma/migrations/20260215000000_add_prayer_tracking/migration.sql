-- CreateEnum
CREATE TYPE "PrayerCategory" AS ENUM ('PERSONAL', 'FAMILY', 'FRIENDS', 'CHURCH', 'MISSIONS', 'HEALTH', 'WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('ACTIVE', 'ANSWERED', 'NO_LONGER_PRAYING');

-- AlterEnum
ALTER TYPE "CalendarDisplayMode" ADD VALUE 'HEATMAP';

-- CreateTable
CREATE TABLE "prayers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "category" "PrayerCategory" NOT NULL DEFAULT 'PERSONAL',
    "status" "PrayerStatus" NOT NULL DEFAULT 'ACTIVE',
    "answered_at" TIMESTAMP(3),
    "answered_note" TEXT,
    "scripture_reference" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prayers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prayers_user_id_date_idx" ON "prayers"("user_id", "date");

-- CreateIndex
CREATE INDEX "prayers_user_id_status_idx" ON "prayers"("user_id", "status");

-- AddForeignKey
ALTER TABLE "prayers" ADD CONSTRAINT "prayers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
