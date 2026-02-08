-- CreateTable
CREATE TABLE "reading_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "book" TEXT NOT NULL,
    "chapters" TEXT NOT NULL,
    "verses" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reading_entries_user_id_date_idx" ON "reading_entries"("user_id", "date");

-- AddForeignKey
ALTER TABLE "reading_entries" ADD CONSTRAINT "reading_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
