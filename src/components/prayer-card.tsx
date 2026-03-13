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

const ACCENT_COLOR: Record<string, string> = {
  ACTIVE: "bg-amber-400 group-hover:bg-amber-500",
  ANSWERED: "bg-emerald-400 group-hover:bg-emerald-500",
  NO_LONGER_PRAYING: "bg-stone-300 group-hover:bg-stone-400",
};

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

  const hasLink = !!username;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex items-stretch">
        {/* Left accent strip — color reflects prayer status */}
        <div className={`w-1 shrink-0 transition-colors ${ACCENT_COLOR[prayer.status]}`} />

        <div className="flex-1 p-4 pl-4">
          {/* Header: title + meta stacked, actions on right */}
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {hasLink ? (
                  <Link
                    href={`/u/${username}/prayers/${prayer.id}`}
                    className="font-serif font-bold text-[1.1rem] leading-tight text-stone-900 truncate hover:text-emerald-700 transition-colors"
                  >
                    {prayer.title}
                  </Link>
                ) : (
                  <h3 className="font-serif font-bold text-[1.1rem] leading-tight text-stone-900 truncate">
                    {prayer.title}
                  </h3>
                )}
                {prayer.status === "ANSWERED" && (
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 size={10} />
                    Answered
                  </span>
                )}
                {prayer.status === "NO_LONGER_PRAYING" && (
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full shrink-0">
                    <XCircle size={10} />
                    Closed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
                >
                  {PRAYER_CATEGORY_LABELS[prayer.category]}
                </span>
                <span className="text-xs text-stone-400">{formattedDate}</span>
              </div>
            </div>
            <div className="shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <PrayerCardActions
                prayer={prayer}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAnswered={onMarkAnswered}
                onMarkNoLongerPraying={onMarkNoLongerPraying}
                onReactivate={onReactivate}
              />
            </div>
          </div>

          {/* Content preview */}
          {contentPreview && (
            hasLink ? (
              <Link
                href={`/u/${username}/prayers/${prayer.id}`}
                className="block mt-3 pt-3 border-t border-stone-100 group/notes"
              >
                <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2 group-hover/notes:text-stone-700 transition-colors">
                  {contentPreview}
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-600/70 group-hover/notes:text-amber-600 transition-colors">
                  View prayer <ChevronRight size={11} />
                </span>
              </Link>
            ) : (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2">
                  {contentPreview}
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-600/70">
                  View prayer <ChevronRight size={11} />
                </span>
              </div>
            )
          )}

          {/* Footer meta: scripture + support count */}
          {(prayer.scriptureReference || prayer.supportCount > 0) && (
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {prayer.scriptureReference && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <BookOpen size={12} />
                  <span>{prayer.scriptureReference}</span>
                </div>
              )}
              {prayer.supportCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <HandHeart size={12} className="text-amber-500" />
                  <span>
                    {prayer.supportCount} {prayer.supportCount === 1 ? "person" : "people"} prayed
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Answered note */}
          {prayer.status === "ANSWERED" && prayer.answeredNote && (
            <div className="mt-3 bg-emerald-50/50 rounded-xl p-3 text-[0.8rem] text-emerald-800 leading-relaxed">
              <span className="font-semibold">How God answered: </span>
              {prayer.answeredNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
