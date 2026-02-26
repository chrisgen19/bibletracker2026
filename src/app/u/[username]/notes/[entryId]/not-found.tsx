import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-stone-900 text-white p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3">
          Entry Not Found
        </h1>
        <p className="text-stone-600 mb-8">
          This reading entry doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg transition-all"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
