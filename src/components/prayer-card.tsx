"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  HandHeart,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAnsweredModal, setShowAnsweredModal] = useState(false);
  const [answeredNote, setAnsweredNote] = useState("");

  const contentPreview = prayer.content
    ? extractPlainText(prayer.content).slice(0, 150)
    : "";

  const formattedDate = new Date(prayer.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="group bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link
                href={`/u/${username}/prayers/${prayer.id}`}
                className="font-serif font-bold text-lg text-stone-900 truncate hover:text-emerald-700 transition-colors"
              >
                {prayer.title}
              </Link>
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
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {prayer.status === "ACTIVE" && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(prayer)}
                  className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnsweredModal(true)}
                  className="p-1.5 text-stone-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Mark as Answered"
                >
                  <CheckCircle2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onMarkNoLongerPraying(prayer.id)}
                  className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                  title="No Longer Praying"
                >
                  <XCircle size={14} />
                </button>
              </>
            )}
            {prayer.status !== "ACTIVE" && (
              <button
                type="button"
                onClick={() => onReactivate(prayer.id)}
                className="p-1.5 text-stone-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Reactivate"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {contentPreview && (
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
        )}

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

      {/* Delete confirmation */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete Prayer"
      >
        <p className="text-stone-600 mb-2">
          Are you sure you want to delete this prayer?
        </p>
        <p className="text-sm text-stone-500 mb-6 font-semibold">
          {prayer.title}
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirm(false);
              onDelete(prayer.id);
            }}
            icon={Trash2}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Mark as Answered modal */}
      <Modal
        isOpen={showAnsweredModal}
        onClose={() => {
          setShowAnsweredModal(false);
          setAnsweredNote("");
        }}
        title="Prayer Answered"
      >
        <p className="text-stone-600 mb-4">
          How did God answer this prayer?
        </p>
        <textarea
          value={answeredNote}
          onChange={(e) => setAnsweredNote(e.target.value)}
          placeholder="Share how this prayer was answered... (optional)"
          className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300 min-h-[100px] resize-none"
        />
        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setShowAnsweredModal(false);
              setAnsweredNote("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onMarkAnswered(prayer.id, answeredNote || undefined);
              setShowAnsweredModal(false);
              setAnsweredNote("");
            }}
            icon={CheckCircle2}
            className="flex-1"
          >
            Mark Answered
          </Button>
        </div>
      </Modal>
    </>
  );
}
