export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl w-9 h-9" />
            <div className="h-6 w-36 bg-stone-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-40 bg-stone-100 rounded-xl animate-pulse" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <div className="h-9 w-48 bg-stone-200 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-64 bg-stone-100 rounded animate-pulse" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
          <div className="h-7 w-48 bg-stone-200 rounded animate-pulse mb-6" />
          <div className="space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-stone-100 rounded animate-pulse mb-1.5" />
                <div className="h-12 bg-stone-100 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
          <div className="h-7 w-40 bg-stone-200 rounded animate-pulse mb-6" />
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-32 bg-stone-100 rounded animate-pulse mb-1.5" />
                <div className="h-12 bg-stone-100 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
