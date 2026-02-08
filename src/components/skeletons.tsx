export function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 bg-stone-200 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-stone-100 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-stone-100 rounded animate-pulse mx-auto w-8"
          />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-stone-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function ActivityLogSkeleton() {
  return (
    <div className="sticky top-24">
      <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 sm:p-8 min-h-[600px] flex flex-col shadow-2xl shadow-stone-200/40">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
            <div className="h-8 w-48 bg-stone-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-20 bg-stone-200 rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100"
            >
              <div className="h-5 w-32 bg-stone-200 rounded animate-pulse mb-3" />
              <div className="h-4 w-48 bg-stone-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-stone-900 p-6 rounded-3xl">
        <div className="h-4 w-20 bg-stone-700 rounded animate-pulse mb-2" />
        <div className="h-10 w-16 bg-stone-700 rounded animate-pulse" />
      </div>
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
        <div className="h-4 w-24 bg-stone-200 rounded animate-pulse mb-2" />
        <div className="h-10 w-16 bg-stone-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
