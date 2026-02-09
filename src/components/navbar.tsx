"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Flame, LogOut, UserCircle, Users, Menu, X, Bell } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { NotificationDropdown } from "@/components/notification-dropdown";
import type { Stats } from "@/lib/types";

interface NavbarProps {
  stats: Stats;
  unreadCount: number;
}

export function Navbar({ stats, unreadCount }: NavbarProps) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  return (
    <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-stone-900 text-white p-2 rounded-xl">
            <BookOpen size={20} />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">
            Sola Scriptura
          </h1>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
            <Flame
              size={16}
              className={
                stats.currentStreak > 0
                  ? "text-orange-500 fill-orange-500"
                  : "text-stone-300"
              }
            />
            <span>{stats.currentStreak} Day Streak</span>
          </div>

          {session?.user && (
            <>
              <Link
                href="/friends"
                className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <Users size={16} className="text-stone-500" />
                <span>My Friends</span>
              </Link>
              <div ref={notificationRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen((prev) => !prev)}
                  className="relative p-2 text-stone-500 bg-white rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
                  title="Notifications"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96">
                    <NotificationDropdown
                      onClose={() => setIsNotificationsOpen(false)}
                    />
                  </div>
                )}
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
              >
                <UserCircle size={16} className="text-stone-500" />
                <span>{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>

        {/* Mobile bell + hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          {session?.user && (
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsMenuOpen(false);
              }}
              className="relative p-2 text-stone-500 rounded-xl hover:bg-stone-100 transition-colors"
              title="Notifications"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          )}
          <button
            className={`p-2 rounded-xl transition-colors ${
              isMenuOpen
                ? "bg-stone-900 text-stone-50"
                : "text-stone-600 hover:bg-stone-100"
            }`}
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile notification dropdown */}
      {isNotificationsOpen && !isMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-gradient-to-b from-stone-50/95 to-white/95 backdrop-blur-md px-4 py-4">
          <div className="rounded-2xl border border-stone-200 bg-white/90 shadow-lg shadow-stone-200/50 overflow-hidden">
            <NotificationDropdown
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="sm:hidden border-t border-stone-200 bg-gradient-to-b from-stone-50/95 to-white/95 backdrop-blur-md px-4 py-4"
        >
          <div className="rounded-2xl border border-stone-200 bg-white/90 shadow-lg shadow-stone-200/50 p-3">
            <div className="mb-3 flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-3 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                Current Streak
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Flame
                  size={16}
                  className={
                    stats.currentStreak > 0
                      ? "text-orange-500 fill-orange-500"
                      : "text-stone-300"
                  }
                />
                <span>{stats.currentStreak} Day Streak</span>
              </div>
            </div>

            {session?.user ? (
              <div className="space-y-1">
                <Link
                  href="/friends"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-stone-500" />
                    <span>My Friends</span>
                  </span>
                  <span className="text-xs text-stone-400">Open</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <UserCircle size={16} className="text-stone-500" />
                    <span>Profile</span>
                  </span>
                  <span className="text-xs text-stone-400 truncate max-w-[8rem]">
                    {session.user.name ?? "Open"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
