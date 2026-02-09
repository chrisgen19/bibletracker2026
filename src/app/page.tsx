import Link from "next/link";
import { LandingNavbar } from "@/components/landing-navbar";
import {
  BookOpen,
  Calendar,
  Flame,
  ChevronRight,
  Quote,
  Bookmark,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <Flame size={14} className="fill-emerald-600" />
              Build a daily reading habit
            </div>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-stone-900 leading-tight tracking-tight mb-6">
              Track your
              <br />
              <span className="text-emerald-600">Bible reading</span>
              <br />
              journey.
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed max-w-md mb-10">
              A simple, beautiful way to log your daily Scripture reading,
              reflect on what you&apos;ve learned, and stay consistent in the
              Word.
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
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-stone-600 hover:bg-stone-100 transition-all duration-200"
              >
                I already have an account
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-0 -mt-0 rounded-tr-[2rem]" />
              <div className="space-y-4">
                {[
                  {
                    book: "Genesis 1-3",
                    note: "In the beginning... truly striking how much order God brought out of chaos.",
                  },
                  {
                    book: "Psalms 23:1-6",
                    note: "He restores my soul — exactly what I needed today.",
                  },
                  {
                    book: "Romans 8",
                    note: "Nothing can separate us from the love of God. Powerful.",
                  },
                ].map((item) => (
                  <div
                    key={item.book}
                    className="bg-stone-50 rounded-2xl p-5 border border-stone-100"
                  >
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-serif font-bold text-stone-900">
                        {item.book}
                      </span>
                      <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                        Read
                      </span>
                    </div>
                    <div className="relative pl-4">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full" />
                      <p className="text-stone-500 text-sm italic leading-relaxed">
                        &ldquo;{item.note}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-stone-200 py-20 sm:py-28">
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
            {[
              {
                icon: Calendar,
                title: "Calendar View",
                description:
                  "See your reading history at a glance. Each day you read lights up on your personal calendar.",
              },
              {
                icon: Flame,
                title: "Reading Streaks",
                description:
                  "Build momentum with daily streaks. Stay consistent and watch your streak grow day by day.",
              },
              {
                icon: BookOpen,
                title: "Track Every Book",
                description:
                  "Log chapters and verses across all 66 books. See how much of the Bible you've covered.",
              },
              {
                icon: Quote,
                title: "Personal Reflections",
                description:
                  "Write notes and reflections for each reading. Capture what God is teaching you.",
              },
              {
                icon: Bookmark,
                title: "Reading Progress",
                description:
                  "Track how many books you've started and how many entries you've logged over time.",
              },
              {
                icon: ChevronRight,
                title: "Simple & Focused",
                description:
                  "No clutter, no ads, no social feeds. Just a clean space to grow in your faith.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100 w-fit mb-5">
                  <feature.icon size={24} className="text-stone-700" />
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
          <p className="text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} Sola Scriptura. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
