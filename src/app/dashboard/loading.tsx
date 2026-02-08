import {
  CalendarSkeleton,
  StatsSkeleton,
  ActivityLogSkeleton,
} from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl w-9 h-9" />
            <div className="h-6 w-36 bg-stone-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block h-8 w-32 bg-stone-100 rounded-full animate-pulse" />
            <div className="hidden sm:block h-8 w-28 bg-stone-100 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <CalendarSkeleton />
            <StatsSkeleton />
          </div>
          <div className="lg:col-span-5">
            <ActivityLogSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}
