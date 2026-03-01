import Link from "next/link";
import { LandingNavbar } from "@/components/landing-navbar";
import {
  BookOpen,
  Calendar,
  Flame,
  ChevronRight,
  Quote,
  Bookmark,
  Users,
  PenLine,
  Bell,
} from "lucide-react";
import { APP_VERSION } from "@/lib/changelog";

const FEATURES = [
  {
    icon: Calendar,
    title: "Smart Calendar",
    description:
      "View your reading history with verse references displayed right on the calendar. Customize how entries appear with multiple display modes.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    icon: Flame,
    title: "Reading Streaks",
    description:
      "Build momentum with daily streaks. Stay consistent and watch your streak grow day by day.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Track Every Book",
    description:
      "Log chapters and verses across all 66 books. See how much of the Bible you've covered.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    icon: PenLine,
    title: "Rich Text Reflections",
    description:
      "Write beautiful reflections with a full rich text editor. Bold, headings, lists, quotes, tables, and more — then click any note to read it in full.",
    iconBg: "bg-stone-100",
    iconColor: "text-stone-700",
  },
  {
    icon: Users,
    title: "Friends & Community",
    description:
      "Follow other readers and see their activity. View their reflections in full, share public profiles, and encourage one another in the Word.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    icon: Bell,
    title: "Stay Connected",
    description:
      "Get notified when someone follows you. Keep up with friends' reading activity and reflections from your dashboard.",
    iconBg: "bg-stone-100",
    iconColor: "text-stone-700",
  },
];

/** Indices of "reading days" in the mini calendar preview (0-based, visual only) */
const READING_DAYS = new Set([
  0, 1, 2, 4, 5, 6, 7, 9, 11, 13, 14, 16, 18, 19, 20, 21, 23, 24, 25, 26,
]);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration — subtle gradient orbs */}
        <div className="absolute top-16 right-0 w-72 h-72 bg-gradient-to-br from-emerald-50/60 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-stone-100/80 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-10 sm:pt-32 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
                <Flame size={14} className="fill-emerald-600" />
                Build a daily reading habit
              </div>
              <h1 className="text-[2.5rem] sm:text-6xl font-serif font-bold text-stone-900 leading-[1.1] tracking-tight mb-6">
                Track your
                <br />
                <span className="text-emerald-600">Bible reading</span>
                <br />
                journey.
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-md mb-10">
                Log your daily Scripture reading, write rich reflections with
                formatting, and stay consistent in the Word — together with
                friends.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 text-lg"
                >
                  Get started free
                  <ChevronRight size={20} />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 py-3.5 sm:px-6 rounded-2xl font-medium text-stone-600 hover:bg-stone-100 transition-all duration-200"
                >
                  I already have an account
                </Link>
              </div>
            </div>

            {/* Desktop Hero Visual — rich text editor preview */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full" />
                <div className="flex items-center justify-between px-8 py-3 border-b border-stone-200">
                  <span className="text-sm font-medium text-stone-400">
                    Cancel
                  </span>
                  <span className="text-sm font-serif font-bold text-stone-900">
                    Reflection
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    Done
                  </span>
                </div>
                <div className="flex items-center gap-1 px-8 py-2 border-b border-stone-100">
                  <span className="p-1.5 rounded-md text-stone-400 text-xs font-bold">
                    B
                  </span>
                  <span className="p-1.5 rounded-md text-stone-400 text-xs italic">
                    I
                  </span>
                  <span className="p-1.5 rounded-md text-stone-400 text-xs underline">
                    U
                  </span>
                  <div className="w-px h-4 bg-stone-200 mx-1" />
                  <span className="p-1.5 rounded-md text-stone-400 text-xs">
                    H1
                  </span>
                  <span className="p-1.5 rounded-md text-stone-400 text-xs">
                    H2
                  </span>
                  <div className="w-px h-4 bg-stone-200 mx-1" />
                  <span className="p-1.5 rounded-md text-stone-400 text-xs">
                    &bull;&mdash;
                  </span>
                  <span className="p-1.5 rounded-md text-stone-400 text-xs">
                    1.
                  </span>
                  <span className="p-1.5 rounded-md text-stone-400 text-xs">
                    &ldquo;&rdquo;
                  </span>
                </div>
                <div className="px-8 py-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
                      Romans 8 — No Condemnation
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      Paul&apos;s argument builds beautifully here. The shift
                      from chapter 7&apos;s struggle to chapter 8&apos;s{" "}
                      <strong className="text-stone-800">triumph</strong> is one
                      of the most powerful transitions in all of Scripture.
                    </p>
                  </div>
                  <div className="border-l-2 border-emerald-300 pl-4 py-1">
                    <p className="text-stone-500 text-sm italic leading-relaxed">
                      &ldquo;For I am convinced that neither death nor life,
                      neither angels nor demons... shall be able to separate us
                      from the love of God.&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      Three takeaways:
                    </p>
                    <ul className="mt-1.5 space-y-1 text-stone-600 text-sm">
                      <li className="flex gap-2">
                        <span className="text-emerald-500 mt-0.5">&bull;</span>{" "}
                        The Spirit intercedes when I can&apos;t find words
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-500 mt-0.5">&bull;</span>{" "}
                        <strong className="text-stone-800">All things</strong>{" "}
                        work together — not just the good
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-500 mt-0.5">&bull;</span>{" "}
                        Nothing in all creation can separate me from His love
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Hero Visual — floating preview cards */}
            <div className="lg:hidden">
              <div className="relative mx-auto max-w-[340px] h-[280px]">
                {/* Calendar card — tilted left */}
                <div className="absolute top-0 left-0 w-[175px] bg-white rounded-2xl shadow-lg shadow-stone-200/40 p-4 border border-stone-100 -rotate-2 landing-animate landing-delay-1">
                  <div className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mb-2.5">
                    March 2026
                  </div>
                  <div className="grid grid-cols-7 gap-[3px]">
                    {Array.from({ length: 28 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-[18px] h-[18px] rounded-full ${
                          READING_DAYS.has(i)
                            ? "bg-emerald-400"
                            : "bg-stone-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Entry card — tilted right */}
                <div className="absolute top-10 right-0 w-[190px] bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-4 border border-stone-100 rotate-2 landing-animate landing-delay-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-stone-900">
                      Romans 8
                    </span>
                    <span className="text-[10px] text-stone-400">Ch. 1–8</span>
                  </div>
                  <p className="text-[11px] text-stone-500 italic leading-relaxed pl-3">
                    &ldquo;The shift from struggle to triumph is one of the most
                    powerful transitions in Scripture...&rdquo;
                  </p>
                </div>

                {/* Streak badge */}
                <div className="absolute bottom-2 left-6 bg-white rounded-2xl shadow-lg shadow-stone-200/40 px-4 py-3 border border-stone-100 rotate-1 landing-animate landing-delay-3">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-amber-50 p-1.5 rounded-xl">
                      <Flame
                        size={16}
                        className="text-amber-500 fill-amber-400"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-stone-900">
                        7 day streak
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Keep it going!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-14 sm:py-16 border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            {[
              {
                step: "1",
                icon: BookOpen,
                title: "Log",
                desc: "Record your daily Scripture reading",
              },
              {
                step: "2",
                icon: PenLine,
                title: "Reflect",
                desc: "Write rich-text reflections",
              },
              {
                step: "3",
                icon: Flame,
                title: "Grow",
                desc: "Build streaks & track progress",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-700 font-serif font-bold text-base sm:text-lg mb-2 sm:mb-3">
                  {item.step}
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-stone-200 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
              Everything you need to stay in the Word
            </h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              No distractions. No complexity. Just you, the Scriptures, and a
              place to reflect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300"
              >
                <div
                  className={`${feature.iconBg} p-3 rounded-2xl shadow-sm border border-stone-100/60 w-fit mb-5`}
                >
                  <feature.icon size={24} className={feature.iconColor} />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture Quote */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="bg-stone-900 rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden">
          <Bookmark
            className="absolute -bottom-6 -right-6 text-stone-800 opacity-30"
            size={140}
          />
          <Quote
            size={40}
            className="text-stone-600 mx-auto mb-6 fill-stone-700"
          />
          <blockquote className="text-2xl sm:text-3xl font-serif font-bold text-stone-50 leading-relaxed max-w-2xl mx-auto mb-6">
            Your word is a lamp to my feet and a light to my path.
          </blockquote>
          <cite className="text-stone-400 text-lg font-medium not-italic">
            — Psalm 119:105
          </cite>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-stone-200 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            Start your reading journey today
          </h2>
          <p className="text-stone-500 text-lg max-w-md mx-auto mb-10">
            Join believers who are building a daily habit of reading and
            reflecting on Scripture.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 text-lg"
          >
            Create your free account
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <BookOpen size={16} />
            <span className="font-serif font-medium">Sola Scriptura</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Sola Scriptura. All rights
              reserved.
            </p>
            <Link
              href="/terms"
              target="_blank"
              className="hover:text-stone-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              target="_blank"
              className="hover:text-stone-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/changelog"
              className="hover:text-stone-600 transition-colors"
            >
              v{APP_VERSION}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
