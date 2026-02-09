"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";
import type {
  FriendUser,
  FriendsActivityEntry,
  NotificationItem,
} from "@/lib/types";

export async function followUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (session.user.id === targetUserId) {
    throw new Error("Cannot follow yourself");
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) return;

  await prisma.follow.create({
    data: {
      id: generateId(),
      followerId: session.user.id,
      followingId: targetUserId,
    },
  });

  await prisma.notification.upsert({
    where: {
      userId_actorId_type: {
        userId: targetUserId,
        actorId: session.user.id,
        type: "FOLLOW",
      },
    },
    update: {
      read: false,
      createdAt: new Date(),
    },
    create: {
      id: generateId(),
      userId: targetUserId,
      actorId: session.user.id,
      type: "FOLLOW",
    },
  });

  revalidatePath("/friends");
  revalidatePath("/dashboard");
}

export async function unfollowUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.follow.deleteMany({
    where: {
      followerId: session.user.id,
      followingId: targetUserId,
    },
  });

  await prisma.notification.deleteMany({
    where: {
      userId: targetUserId,
      actorId: session.user.id,
      type: "FOLLOW",
    },
  });

  revalidatePath("/friends");
  revalidatePath("/dashboard");
}

export async function searchUsers(query: string): Promise<FriendUser[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!query || query.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
      id: { not: session.user.id },
    },
    take: 20,
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  });

  const followingIds = await prisma.follow.findMany({
    where: {
      followerId: session.user.id,
      followingId: { in: users.map((u) => u.id) },
    },
    select: { followingId: true },
  });

  const followingSet = new Set(followingIds.map((f) => f.followingId));

  return users.map((u) => ({
    id: u.id,
    username: u.username!,
    firstName: u.firstName,
    lastName: u.lastName,
    isFollowing: followingSet.has(u.id),
  }));
}

export async function getFollowing(): Promise<FriendUser[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const follows = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return follows.map((f) => ({
    id: f.following.id,
    username: f.following.username!,
    firstName: f.following.firstName,
    lastName: f.following.lastName,
    isFollowing: true,
  }));
}

export async function getFollowers(): Promise<FriendUser[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const follows = await prisma.follow.findMany({
    where: { followingId: session.user.id },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const followerIds = follows.map((f) => f.followerId);
  const followingBack = await prisma.follow.findMany({
    where: {
      followerId: session.user.id,
      followingId: { in: followerIds },
    },
    select: { followingId: true },
  });
  const followingBackSet = new Set(followingBack.map((f) => f.followingId));

  return follows.map((f) => ({
    id: f.follower.id,
    username: f.follower.username!,
    firstName: f.follower.firstName,
    lastName: f.follower.lastName,
    isFollowing: followingBackSet.has(f.follower.id),
  }));
}

export async function getFollowCounts() {
  const session = await auth();
  if (!session?.user?.id) return { followingCount: 0, followerCount: 0 };

  const [followingCount, followerCount] = await Promise.all([
    prisma.follow.count({ where: { followerId: session.user.id } }),
    prisma.follow.count({ where: { followingId: session.user.id } }),
  ]);

  return { followingCount, followerCount };
}

export async function getFriendsActivity(): Promise<FriendsActivityEntry[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const following = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  if (followingIds.length === 0) return [];

  const entries = await prisma.readingEntry.findMany({
    where: {
      userId: { in: followingIds },
      user: { isProfilePublic: true },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      date: true,
      book: true,
      chapters: true,
      verses: true,
      user: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    user: {
      username: e.user.username!,
      firstName: e.user.firstName,
      lastName: e.user.lastName,
    },
  }));
}

export async function getUnreadNotificationCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  return prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const actorIds = notifications.map((n) => n.actorId);
  const followingActors = await prisma.follow.findMany({
    where: {
      followerId: session.user.id,
      followingId: { in: actorIds },
    },
    select: { followingId: true },
  });
  const followingSet = new Set(followingActors.map((f) => f.followingId));

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
    actor: {
      id: n.actor.id,
      username: n.actor.username!,
      firstName: n.actor.firstName,
      lastName: n.actor.lastName,
      isFollowing: followingSet.has(n.actor.id),
    },
  }));
}

export async function markNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}
