export default function PrayersLoading() {
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-32 bg-stone-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-stone-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-stone-200 rounded-2xl animate-pulse" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-9 w-24 bg-stone-200 rounded-xl animate-pulse" />
          <div className="h-9 w-28 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-9 w-16 bg-stone-100 rounded-xl animate-pulse" />
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="h-9 w-36 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-9 flex-1 bg-stone-100 rounded-xl animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100"
            >
              <div className="h-5 w-48 bg-stone-200 rounded animate-pulse mb-2" />
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 bg-stone-100 rounded-md animate-pulse" />
                <div className="h-5 w-24 bg-stone-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-stone-50 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-50 rounded animate-pulse mt-1" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
