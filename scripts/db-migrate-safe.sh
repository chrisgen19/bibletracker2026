#!/bin/sh
set -eu

# Mark this migration as rolled back only when it is in a failed state.
bunx prisma db execute --stdin --schema prisma/schema.prisma <<'SQL'
UPDATE "_prisma_migrations"
SET rolled_back_at = NOW()
WHERE migration_name = '20260208130627_add_reading_entries'
  AND finished_at IS NULL
  AND rolled_back_at IS NULL;
SQL

bunx prisma migrate deploy
