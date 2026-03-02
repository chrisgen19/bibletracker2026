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

  // Verify caller follows the prayer owner for FOLLOWERS-visibility prayers
  if (prayer.visibility === "FOLLOWERS") {
    const isFollowing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: prayer.userId } },
    });
    if (!isFollowing) {
      throw new Error("Prayer not found or is private");
    }
  }

  if (prayer.userId !== parsed.data.prayerOwnerId) {
    throw new Error("Invalid prayer owner");
  }

  // Atomic create with skipDuplicates to handle concurrent requests gracefully
  const result = await prisma.prayerSupport.createMany({
    data: [{
      id: generateId(),
      prayerId: prayer.id,
      userId: session.user.id,
    }],
    skipDuplicates: true,
  });

  // If no record was created, user already supported this prayer
  if (result.count === 0) return;

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
