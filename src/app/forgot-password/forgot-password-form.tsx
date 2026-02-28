"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, Loader2, Mail } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { forgotPasswordAction } from "./actions";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPasswordAction({ email: parsed.data.email });
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError(result.error ?? "Something went wrong.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Sola Scriptura
            </span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
          >
            Log in
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
            Forgot password?
          </h1>
          <p className="text-stone-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
          {submitted ? (
            <div className="text-center">
              <Mail size={48} className="text-stone-400 mx-auto mb-4" />
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
                Check your email
              </h2>
              <p className="text-stone-500 mb-6">
                If an account exists with that email, we&apos;ve sent a password
                reset link. The link expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:underline"
              >
                <ChevronLeft size={16} />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="bg-red-50 text-red-700 text-sm rounded-2xl px-4 py-3 mb-6 border border-red-100">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.email;
                            return next;
                          });
                      }}
                      disabled={isLoading}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-stone-500 mt-6">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-emerald-600 font-medium hover:underline"
                >
                  <ChevronLeft size={14} />
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
