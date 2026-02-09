import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    return { title: "Profile Not Found | Sola Scriptura" };
  }

  return {
    title: `${user.firstName} ${user.lastName} (@${user.username}) | Sola Scriptura`,
    description: `View ${user.firstName}'s Bible reading journey on Sola Scriptura`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const user = await getPublicProfile(username);

  if (!user) {
    notFound();
  }

  if (!user.isProfilePublic) {
    return <PublicProfileClient isPrivate username={username} />;
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
    />
  );
}
