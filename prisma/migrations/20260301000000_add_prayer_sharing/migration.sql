-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PRAYER_SHARED';
ALTER TYPE "NotificationType" ADD VALUE 'PRAYED_FOR';

-- DropIndex
DROP INDEX "notifications_user_id_actor_id_type_key";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN "prayer_id" TEXT;

-- CreateTable
CREATE TABLE "prayer_supports" (
    "id" TEXT NOT NULL,
    "prayer_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_supports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prayer_supports_prayer_id_idx" ON "prayer_supports"("prayer_id");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_supports_prayer_id_user_id_key" ON "prayer_supports"("prayer_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_user_id_actor_id_type_prayer_id_key" ON "notifications"("user_id", "actor_id", "type", "prayer_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_prayer_id_fkey" FOREIGN KEY ("prayer_id") REFERENCES "prayers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_supports" ADD CONSTRAINT "prayer_supports_prayer_id_fkey" FOREIGN KEY ("prayer_id") REFERENCES "prayers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_supports" ADD CONSTRAINT "prayer_supports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
