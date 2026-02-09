"use client";

import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-stone-900 text-white p-2 rounded-xl">
            <BookOpen size={20} />
          </div>
          <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-900">
            Sola Scriptura
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2.5 rounded-xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95"
          >
            Sign up
          </Link>
        </div>

        <button
          className="sm:hidden p-2 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="landing-mobile-menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="landing-mobile-menu"
          className="sm:hidden border-t border-stone-200 bg-stone-50/95 backdrop-blur-md px-4 py-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-center text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-center text-sm font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
