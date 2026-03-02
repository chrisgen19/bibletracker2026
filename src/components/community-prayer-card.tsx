"use client";

import Link from "next/link";
import { HandHeart, Heart, BookOpen, ChevronRight } from "lucide-react";
import { extractPlainText } from "@/lib/notes";
import { PRAYER_CATEGORY_COLORS, PRAYER_CATEGORY_LABELS } from "@/lib/constants";
import type { PublicPrayer } from "@/lib/types";

interface CommunityPrayerCardProps {
  prayer: PublicPrayer;
  onPrayFor: (prayer: PublicPrayer) => void;
}

export function CommunityPrayerCard({ prayer, onPrayFor }: CommunityPrayerCardProps) {
  const contentPreview = prayer.content
    ? extractPlainText(prayer.content).slice(0, 150)
    : "";
  // Use username presence to determine if profile link should be shown —
  // the server already redacts username for non-followed PUBLIC prayer authors
  const hasProfile = !!prayer.user.username;
  const authorDisplay = hasProfile
    ? `${prayer.user.firstName} ${prayer.user.lastName}`.trim()
    : prayer.user.firstName;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
      {/* Author info */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-semibold text-stone-500">
          {prayer.user.firstName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          {hasProfile ? (
            <Link
              href={`/u/${prayer.user.username}`}
              className="text-sm font-semibold text-stone-900 hover:text-emerald-700 transition-colors"
            >
              {authorDisplay}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-stone-900">
              {authorDisplay}
            </span>
          )}
          <p className="text-xs text-stone-400">
            {new Date(prayer.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
        >
          {PRAYER_CATEGORY_LABELS[prayer.category]}
        </span>
      </div>

      {/* Title */}
      {hasProfile ? (
        <Link
          href={`/u/${prayer.user.username}/prayers/${prayer.id}`}
          className="block font-serif font-bold text-lg text-stone-900 hover:text-emerald-700 transition-colors mb-1"
        >
          {prayer.title}
        </Link>
      ) : (
        <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
          {prayer.title}
        </h3>
      )}

      {/* Content preview */}
      {contentPreview && hasProfile ? (
        <Link
          href={`/u/${prayer.user.username}/prayers/${prayer.id}`}
          className="block relative pl-4 mt-2 mb-2 group/notes"
        >
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full group-hover/notes:bg-emerald-400 transition-colors" />
          <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2 group-hover/notes:text-stone-800 transition-colors">
            &ldquo;{contentPreview}&rdquo;
          </p>
          <span className="flex items-center gap-1 mt-1.5 text-xs text-stone-400 group-hover/notes:text-emerald-600 transition-colors">
            View prayer <ChevronRight size={12} />
          </span>
        </Link>
      ) : contentPreview ? (
        <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-2">
          {contentPreview}
        </p>
      ) : null}

      {/* Scripture reference */}
      {prayer.scriptureReference && (
        <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
          <BookOpen size={12} />
          <span>{prayer.scriptureReference}</span>
        </div>
      )}

      {/* Footer: support count + pray button */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <span className="text-xs text-stone-400">
          {prayer.supportCount === 0
            ? "Be the first to pray"
            : `${prayer.supportCount} ${prayer.supportCount === 1 ? "person" : "people"} prayed`}
        </span>
        <button
          type="button"
          onClick={() => onPrayFor(prayer)}
          disabled={prayer.hasPrayed}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            prayer.hasPrayed
              ? "bg-emerald-50 text-emerald-700 cursor-default"
              : "bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          {prayer.hasPrayed ? (
            <>
              <Heart size={14} className="fill-current" />
              Prayed
            </>
          ) : (
            <>
              <HandHeart size={14} />
              I Prayed For You
            </>
          )}
        </button>
      </div>
    </div>
  );
}
