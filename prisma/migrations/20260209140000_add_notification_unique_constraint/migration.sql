-- Delete duplicate notifications keeping only the most recent one per (user_id, actor_id, type)
DELETE FROM "notifications" a
USING "notifications" b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.actor_id = b.actor_id
  AND a.type = b.type;

-- CreateIndex
CREATE UNIQUE INDEX "notifications_user_id_actor_id_type_key" ON "notifications"("user_id", "actor_id", "type");
