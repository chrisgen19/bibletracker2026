"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import { resendVerificationAction } from "./actions";

interface VerifyEmailClientProps {
  email: string | null;
  verifyResult: { success: boolean; error: string | null } | null;
}

export function VerifyEmailClient({
  email,
  verifyResult,
}: VerifyEmailClientProps) {
  const router = useRouter();

  // Determine initial status from server-side verification result
  const initialStatus = verifyResult
    ? verifyResult.success
      ? "success"
      : "error"
    : "waiting";

  const [status] = useState<"success" | "error" | "waiting">(initialStatus);
  const [errorMessage] = useState(verifyResult?.error ?? "");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect to login after successful verification
  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(
        () => router.push("/login?verified=true"),
        2000
      );
      return () => clearTimeout(timeout);
    }
  }, [status, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;
    setResendLoading(true);

    const result = await resendVerificationAction(email);
    setResendLoading(false);

    if (result.success) {
      setResendCooldown(60);
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
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100 text-center">
          {status === "success" && (
            <>
              <CheckCircle
                size={48}
                className="text-emerald-500 mx-auto mb-4"
              />
              <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Email verified!
              </h1>
              <p className="text-stone-500 mb-4">
                Redirecting you to sign in...
              </p>
              <Link
                href="/login?verified=true"
                className="text-emerald-600 font-medium hover:underline"
              >
                Click here if not redirected
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Verification failed
              </h1>
              <p className="text-stone-500 mb-6">{errorMessage}</p>
              {email && (
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resendLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend verification email"
                  )}
                </button>
              )}
            </>
          )}

          {status === "waiting" && (
            <>
              <Mail size={48} className="text-stone-400 mx-auto mb-4" />
              <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Check your email
              </h1>
              <p className="text-stone-500 mb-2">
                We sent a verification link to
              </p>
              {email && (
                <p className="font-medium text-stone-900 mb-6">{email}</p>
              )}
              <p className="text-stone-400 text-sm mb-6">
                Click the link in the email to verify your account. The link
                expires in 1 hour.
              </p>
              {email && (
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resendLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend verification email"
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
