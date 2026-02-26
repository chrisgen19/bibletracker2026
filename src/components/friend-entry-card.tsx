"use client";

import Link from "next/link";
import { extractPlainText } from "@/lib/notes";
import type { FriendsActivityEntry } from "@/lib/types";

interface FriendEntryCardProps {
  entry: FriendsActivityEntry;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function FriendEntryCard({ entry }: FriendEntryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-2">
        <Link
          href={`/u/${entry.user.username}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {entry.user.firstName} {entry.user.lastName}
        </Link>
        <span className="text-xs text-stone-400">{timeAgo(entry.date)}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif font-bold text-lg text-stone-900">
          {entry.book}
        </span>
        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md text-sm">
          Ch {entry.chapters}
          {entry.verses && `: ${entry.verses}`}
        </span>
      </div>

      {entry.notes && (
        <Link
          href={`/u/${entry.user.username}/notes/${entry.id}`}
          className="block w-full text-left relative pl-4 mt-3 group/notes"
        >
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full group-hover/notes:bg-emerald-400 transition-colors" />
          <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2 group-hover/notes:text-stone-800 transition-colors">
            &ldquo;{extractPlainText(entry.notes).slice(0, 150)}&rdquo;
          </p>
        </Link>
      )}
    </div>
  );
}
