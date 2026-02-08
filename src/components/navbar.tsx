"use client";

import { BookOpen, Flame, LogOut, UserCircle, MoreHorizontal } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import type { Stats } from "@/lib/types";

interface NavbarProps {
  stats: Stats;
}

export function Navbar({ stats }: NavbarProps) {
  const { data: session } = useSession();

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
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
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
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
                <UserCircle size={16} className="text-stone-500" />
                <span>{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          )}

          <button className="sm:hidden p-2 text-stone-600">
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
