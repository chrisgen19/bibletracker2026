"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  BookOpen,
  Lock,
  Calendar as CalendarIcon,
  UserPlus,
  UserMinus,
  ArrowLeft,
} from "lucide-react";
import { Calendar } from "@/components/calendar";
import { computeStats } from "@/lib/stats";
import { extractPlainText } from "@/lib/notes";
import { followUser, unfollowUser } from "@/app/friends/actions";
import type { ReadingEntry } from "@/lib/types";

type PublicProfileClientProps =
  | {
      isPrivate: true;
      username: string;
      isLoggedIn: boolean;
      profile?: never;
      entries?: never;
      targetUserId?: never;
      isOwnProfile?: never;
      isFollowing?: never;
    }
  | {
      isPrivate?: false;
      username: string;
      profile: {
        firstName: string;
        lastName: string;
        username: string;
        memberSince: string;
      };
      entries: ReadingEntry[];
      targetUserId: string;
      isOwnProfile: boolean;
      isFollowing: boolean;
      isLoggedIn: boolean;
    };

export function PublicProfileClient(props: PublicProfileClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [following, setFollowing] = useState(
    props.isPrivate ? false : props.isFollowing
  );
  const [isPending, startTransition] = useTransition();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleMonthSelect = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleFollowToggle = () => {
    if (props.isPrivate || !props.targetUserId) return;

    const newValue = !following;
    setFollowing(newValue);

    startTransition(async () => {
      try {
        if (newValue) {
          await followUser(props.targetUserId);
          toast.success("Following!");
        } else {
          await unfollowUser(props.targetUserId);
          toast.success("Unfollowed");
        }
      } catch {
        setFollowing(!newValue);
        toast.error("Something went wrong");
      }
    });
  };

  if (props.isPrivate) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
        <nav className="bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href={props.isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
              <div className="bg-stone-900 text-white p-2 rounded-xl">
                <BookOpen size={20} />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
                Sola Scriptura
              </span>
            </Link>
            {props.isLoggedIn && (
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
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-12 border border-stone-100">
            <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Lock size={32} className="text-stone-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-3">
              This profile is private
            </h1>
            <p className="text-stone-600 mb-6">
              @{props.username} has chosen to keep their reading activity
              private.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { profile, entries } = props;
  const stats = computeStats(entries);
  const memberSince = new Date(profile.memberSince).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={props.isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Sola Scriptura
            </span>
          </Link>
          {props.isLoggedIn && (
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
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-1">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-stone-500 text-lg">@{profile.username}</p>
            </div>
            <div className="flex items-center gap-4">
              {props.isLoggedIn && !props.isOwnProfile && (
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={isPending}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all
                    ${
                      following
                        ? "bg-stone-200 text-stone-700 hover:bg-red-50 hover:text-red-600"
                        : "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {following ? (
                    <>
                      <UserMinus size={16} />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
              <div className="sm:text-right">
                <p className="text-sm text-stone-500 mb-1">Member since</p>
                <p className="text-lg font-medium text-stone-700">
                  {memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-900 text-stone-50 p-6 rounded-3xl">
              <div className="opacity-70 text-sm font-medium mb-1">
                Total Entries
              </div>
              <div className="text-4xl font-serif font-bold">
                {stats.totalEntries}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
              <div className="text-stone-500 text-sm font-medium mb-1">
                Books Read
              </div>
              <div className="text-4xl font-serif font-bold text-stone-900">
                {stats.booksRead}
                <span className="text-lg text-stone-400 font-sans font-normal">
                  /66
                </span>
              </div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <div className="text-emerald-700 text-sm font-medium mb-1">
                Current Streak
              </div>
              <div className="text-4xl font-serif font-bold text-emerald-900">
                {stats.currentStreak}
                <span className="text-lg text-emerald-600 font-sans font-normal ml-1">
                  days
                </span>
              </div>
              {stats.longestStreak > 0 && (
                <p className="text-xs text-emerald-600/60 mt-1">
                  Best: {stats.longestStreak} days
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-7">
            <Calendar
              currentDate={currentDate}
              entries={entries}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onMonthSelect={handleMonthSelect}
            />
          </div>

          {/* Recent Entries */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 p-6 sm:p-8">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">
                Recent Readings
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-stone-50 rounded-2xl p-4 border border-stone-100"
                  >
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-serif font-bold text-lg text-stone-900">
                        {entry.book}
                      </span>
                      <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md text-sm">
                        Ch {entry.chapters}
                        {entry.verses && `: ${entry.verses}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mb-2">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {entry.notes && (
                      <Link
                        href={`/u/${props.username}/notes/${entry.id}`}
                        className="block w-full text-left relative pl-4 mt-2 group/notes"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full group-hover/notes:bg-emerald-400 transition-colors" />
                        <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2 group-hover/notes:text-stone-800 transition-colors">
                          &ldquo;{extractPlainText(entry.notes).slice(0, 150)}&rdquo;
                        </p>
                      </Link>
                    )}
                  </div>
                ))}
                {entries.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CalendarIcon size={32} className="text-stone-400" />
                    </div>
                    <p className="text-stone-500 font-medium">
                      No readings yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
