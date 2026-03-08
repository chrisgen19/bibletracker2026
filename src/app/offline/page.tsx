import { WifiOff, BookOpen } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900">
          <BookOpen className="h-8 w-8 text-white" />
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 text-stone-400">
          <WifiOff className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Offline
          </span>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-stone-900">
          You&apos;re offline
        </h1>
        <p className="mb-6 text-sm text-stone-500 leading-relaxed">
          Your reading history is available offline from the dashboard.
          Other features need an internet connection.
        </p>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          <BookOpen className="h-4 w-4" />
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
