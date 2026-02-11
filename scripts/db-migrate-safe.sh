#!/bin/sh
set -eu

# Mark this migration as rolled back only when it is in a failed state.
bunx prisma db execute --stdin <<'SQL'
DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    UPDATE "_prisma_migrations"
    SET rolled_back_at = NOW()
    WHERE migration_name IN (
      '20260208130627_add_reading_entries',
      '20260211124405_add_show_missed_days'
    )
      AND finished_at IS NULL
      AND rolled_back_at IS NULL;
  END IF;
END $$;
SQL

bunx prisma migrate deploy
