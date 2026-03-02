"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";
import { prayForPrayerSchema } from "@/lib/validations/prayer";

export async function prayForPrayer(prayerId: string, prayerOwnerId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = prayForPrayerSchema.safeParse({ prayerId, prayerOwnerId });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  if (session.user.id === parsed.data.prayerOwnerId) {
    throw new Error("Cannot support your own prayer");
  }

  const prayer = await prisma.prayer.findUnique({
    where: { id: parsed.data.prayerId },
    select: { id: true, userId: true, visibility: true, user: { select: { username: true } } },
  });

  if (!prayer || prayer.visibility === "PRIVATE") {
    throw new Error("Prayer not found or is private");
  }

  if (prayer.userId !== parsed.data.prayerOwnerId) {
    throw new Error("Invalid prayer owner");
  }

  // Use upsert-style approach to gracefully handle duplicates
  const existing = await prisma.prayerSupport.findUnique({
    where: { prayerId_userId: { prayerId: prayer.id, userId: session.user.id } },
  });

  if (existing) return;

  await prisma.prayerSupport.create({
    data: {
      id: generateId(),
      prayerId: prayer.id,
      userId: session.user.id,
    },
  });

  // Notify the prayer owner using DB-verified userId
  await prisma.notification.create({
    data: {
      id: generateId(),
      userId: prayer.userId,
      actorId: session.user.id,
      type: "PRAYED_FOR",
      prayerId: prayer.id,
    },
  });

  if (prayer.user.username) {
    revalidatePath(`/u/${prayer.user.username}/prayers/${prayer.id}`);
  }
  revalidatePath("/dashboard");
}
