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

-- AddForeignKey (guarded)
-- Some production databases were created with `users.id` not declared unique/primary.
-- PostgreSQL rejects the FK in that case (42830). Keep migration successful and
-- only add the FK when `users(id)` is unique or primary.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    WHERE c.conrelid = 'users'::regclass
      AND c.contype IN ('p', 'u')
      AND c.conkey = ARRAY[
        (
          SELECT attnum
          FROM pg_attribute
          WHERE attrelid = 'users'::regclass
            AND attname = 'id'
        )
      ]::int2[]
  ) THEN
    ALTER TABLE "reading_entries"
      ADD CONSTRAINT "reading_entries_user_id_fkey"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
