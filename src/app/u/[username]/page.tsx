import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PublicProfileClient } from "@/components/public-profile-client";
import type { ReadingEntry } from "@/lib/types";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      isProfilePublic: true,
      createdAt: true,
      entries: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          book: true,
          chapters: true,
          verses: true,
          notes: true,
        },
      },
    },
  });

  return user;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getPublicProfile(username);

  if (!user || !user.isProfilePublic) {
    return { title: "Profile Not Found" };
  }

  const title = `${user.firstName} ${user.lastName} (@${user.username})`;
  const description = `View ${user.firstName}'s Bible reading journey on Sola Scriptura`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const [user, session] = await Promise.all([
    getPublicProfile(username),
    auth(),
  ]);

  if (!user) {
    notFound();
  }

  if (!user.isProfilePublic) {
    return <PublicProfileClient isPrivate username={username} isLoggedIn={!!session?.user?.id} />;
  }

  const isOwnProfile = session?.user?.id === user.id;

  let isFollowing = false;
  if (session?.user?.id && !isOwnProfile) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const entries: ReadingEntry[] = user.entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    notes: e.notes,
  }));

  return (
    <PublicProfileClient
      username={username}
      profile={{
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username!,
        memberSince: user.createdAt.toISOString(),
      }}
      entries={entries}
      targetUserId={user.id}
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
      isLoggedIn={!!session?.user?.id}
    />
  );
}
