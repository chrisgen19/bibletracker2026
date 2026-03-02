"use client";

import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronRight,
  HandHeart,
} from "lucide-react";
import { PrayerCardActions } from "@/components/prayer-card-actions";
import { extractPlainText } from "@/lib/notes";
import { PRAYER_CATEGORY_COLORS, PRAYER_CATEGORY_LABELS } from "@/lib/constants";
import type { Prayer } from "@/lib/types";

interface PrayerCardProps {
  prayer: Prayer;
  username: string;
  onEdit: (prayer: Prayer) => void;
  onDelete: (id: string) => void;
  onMarkAnswered: (id: string, note?: string) => void;
  onMarkNoLongerPraying: (id: string) => void;
  onReactivate: (id: string) => void;
}

export function PrayerCard({
  prayer,
  username,
  onEdit,
  onDelete,
  onMarkAnswered,
  onMarkNoLongerPraying,
  onReactivate,
}: PrayerCardProps) {
  const contentPreview = prayer.content
    ? extractPlainText(prayer.content).slice(0, 150)
    : "";

  const formattedDate = new Date(prayer.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const canLink = username && prayer.visibility !== "PRIVATE";

  return (
    <>
      <div className="group bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {canLink ? (
                <Link
                  href={`/u/${username}/prayers/${prayer.id}`}
                  className="font-serif font-bold text-lg text-stone-900 truncate hover:text-emerald-700 transition-colors"
                >
                  {prayer.title}
                </Link>
              ) : (
                <span className="font-serif font-bold text-lg text-stone-900 truncate">
                  {prayer.title}
                </span>
              )}
              {prayer.status === "ANSWERED" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  Answered
                </span>
              )}
              {prayer.status === "NO_LONGER_PRAYING" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  <XCircle size={12} />
                  Closed
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
              >
                {PRAYER_CATEGORY_LABELS[prayer.category]}
              </span>
              <span className="text-xs text-stone-400">{formattedDate}</span>
            </div>
          </div>
          <PrayerCardActions
            prayer={prayer}
            onEdit={onEdit}
            onDelete={onDelete}
            onMarkAnswered={onMarkAnswered}
            onMarkNoLongerPraying={onMarkNoLongerPraying}
            onReactivate={onReactivate}
          />
        </div>

        {contentPreview && canLink ? (
          <Link
            href={`/u/${username}/prayers/${prayer.id}`}
            className="block relative pl-4 mt-3 group/notes"
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
          <div className="relative pl-4 mt-3">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full" />
            <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2">
              &ldquo;{contentPreview}&rdquo;
            </p>
          </div>
        ) : null}

        {prayer.scriptureReference && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-400">
            <BookOpen size={12} />
            <span>{prayer.scriptureReference}</span>
          </div>
        )}

        {prayer.supportCount > 0 && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-400">
            <HandHeart size={12} className="text-amber-500" />
            <span>
              {prayer.supportCount} {prayer.supportCount === 1 ? "person" : "people"} prayed for this
            </span>
          </div>
        )}

        {prayer.status === "ANSWERED" && prayer.answeredNote && (
          <div className="mt-3 bg-emerald-50/50 rounded-xl p-3 text-sm text-emerald-800">
            <span className="font-medium">How God answered: </span>
            {prayer.answeredNote}
          </div>
        )}
      </div>
    </>
  );
}
