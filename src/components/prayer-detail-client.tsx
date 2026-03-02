"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  FileText,
  HandHeart,
  CheckCircle2,
  XCircle,
  BookOpenText,
} from "lucide-react";
import { toast } from "sonner";
import { PRAYER_CATEGORY_COLORS, PRAYER_CATEGORY_LABELS } from "@/lib/constants";
import { prayForPrayer } from "@/app/u/[username]/prayers/actions";
import type { PublicPrayer } from "@/lib/types";

const NotesBlockViewer = dynamic(
  () =>
    import("@/components/notes-block-viewer").then(
      (mod) => mod.NotesBlockViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
    ),
  }
);

function PrayerCardBody({ prayer }: { prayer: PublicPrayer }) {
  return (
    <>
      {/* Content */}
      {prayer.content ? (
        <div className="prose-sm">
          <NotesBlockViewer notes={prayer.content} />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText size={32} className="text-stone-400" />
          </div>
          <p className="text-stone-500 font-medium">
            No details for this prayer
          </p>
        </div>
      )}

      {/* Scripture reference */}
      {prayer.scriptureReference && (
        <>
          <div className="border-t border-stone-100 my-6" />
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <BookOpenText size={16} className="text-emerald-600" />
            <span className="font-medium">Scripture:</span>
            <span>{prayer.scriptureReference}</span>
          </div>
        </>
      )}

      {/* Answered note */}
      {prayer.status === "ANSWERED" && prayer.answeredNote && (
        <>
          <div className="border-t border-stone-100 my-6" />
          <div className="bg-emerald-50/50 rounded-xl p-4 text-sm text-emerald-800">
            <span className="font-medium">How God answered: </span>
            {prayer.answeredNote}
          </div>
        </>
      )}
    </>
  );
}

interface PrayerDetailClientProps {
  username: string;
  authorName: string;
  prayer: PublicPrayer;
  isLoggedIn: boolean;
  isOwnPrayer: boolean;
}

export function PrayerDetailClient({
  authorName,
  prayer,
  isLoggedIn,
  isOwnPrayer,
}: PrayerDetailClientProps) {
  const router = useRouter();
  const [supportCount, setSupportCount] = useState(prayer.supportCount);
  const [hasPrayed, setHasPrayed] = useState(prayer.hasPrayed);
  const [supporters, setSupporters] = useState(prayer.supporters);
  const [isPending, startTransition] = useTransition();

  const formattedDate = new Date(prayer.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePrayForUser = () => {
    setSupportCount((c) => c + 1);
    setHasPrayed(true);
    setSupporters((prev) => [{ id: "me", firstName: "You", lastName: "" }, ...prev]);

    startTransition(async () => {
      try {
        await prayForPrayer(prayer.id, prayer.user.id);
      } catch {
        setSupportCount((c) => c - 1);
        setHasPrayed(false);
        setSupporters((prev) => prev.filter((s) => s.id !== "me"));
        toast.error("Failed to record your support. Please try again.");
      }
    });
  };

  const statusBadge =
    prayer.status === "ANSWERED" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
        <CheckCircle2 size={12} />
        Answered
      </span>
    ) : prayer.status === "NO_LONGER_PRAYING" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
        <XCircle size={12} />
        Closed
      </span>
    ) : null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Sola Scriptura
            </span>
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 sm:p-8 border border-stone-100">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
                {prayer.title}
              </h1>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
              >
                {PRAYER_CATEGORY_LABELS[prayer.category]}
              </span>
              {statusBadge}
            </div>
            <p className="text-sm text-stone-500">{formattedDate}</p>
            <p className="text-sm text-stone-400 mt-1">by {authorName}</p>
          </div>

          <div className="border-t border-stone-100 mb-6" />

          <PrayerCardBody prayer={prayer} />

          {/* Support section */}
          <div className="border-t border-stone-100 mt-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <HandHeart size={16} className="text-amber-500" />
                <span>
                  {supportCount} {supportCount === 1 ? "person" : "people"} prayed for this
                </span>
              </div>

              {isLoggedIn && !isOwnPrayer && (
                <button
                  type="button"
                  onClick={handlePrayForUser}
                  disabled={hasPrayed || isPending}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    hasPrayed
                      ? "bg-amber-50 text-amber-700 cursor-default"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  <HandHeart size={16} />
                  {hasPrayed ? "Prayed" : "I Prayed For You"}
                </button>
              )}
            </div>

            {/* Supporters list */}
            {supporters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  People who prayed
                </p>
                <div className="flex flex-wrap gap-2">
                  {supporters.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-600">
                        {s.firstName.charAt(0)}
                      </span>
                      {s.lastName ? `${s.firstName} ${s.lastName}` : s.firstName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
