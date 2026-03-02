export default function NotificationsLoading() {
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
        <div className="mb-6">
          <div className="h-8 w-40 bg-stone-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-stone-100 rounded animate-pulse" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-9 w-16 bg-stone-200 rounded-xl animate-pulse" />
          <div className="h-9 w-24 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-9 w-32 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-9 w-28 bg-stone-100 rounded-xl animate-pulse" />
        </div>

        {/* Notification rows skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 divide-y divide-stone-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-stone-200 rounded-full animate-pulse flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-48 bg-stone-200 rounded animate-pulse mb-1.5" />
                <div className="h-3 w-32 bg-stone-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
