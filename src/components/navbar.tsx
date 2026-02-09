"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Flame, LogOut, UserCircle, Users, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import type { Stats } from "@/lib/types";

interface NavbarProps {
  stats: Stats;
}

export function Navbar({ stats }: NavbarProps) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-stone-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-stone-50/95 backdrop-blur-md px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
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
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-stone-700 py-2"
              >
                <Users size={16} className="text-stone-500" />
                <span>My Friends</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-stone-700 py-2"
              >
                <UserCircle size={16} className="text-stone-500" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-sm font-medium text-red-500 py-2"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
