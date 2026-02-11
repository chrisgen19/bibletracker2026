import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { changelog, APP_VERSION } from "@/lib/changelog";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  feat: { label: "Feature", color: "bg-emerald-100 text-emerald-700" },
  fix: { label: "Fix", color: "bg-red-100 text-red-700" },
  style: { label: "Style", color: "bg-blue-100 text-blue-700" },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Changelog
          </h1>
          <p className="text-stone-500 mt-1">
            Current version: <span className="font-medium text-stone-700">v{APP_VERSION}</span>
          </p>
        </div>

        <div className="space-y-8">
          {changelog.map((entry) => (
            <div
              key={entry.version}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  v{entry.version}
                </h2>
                <span className="text-sm text-stone-400">{entry.date}</span>
              </div>
              <ul className="space-y-3">
                {entry.changes.map((change, i) => {
                  const typeInfo = TYPE_LABELS[change.type];
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md mt-0.5 shrink-0 ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      <span className="text-stone-700 text-sm">
                        {change.description}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
