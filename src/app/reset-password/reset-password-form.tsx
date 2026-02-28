"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { resetPasswordAction } from "./actions";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    if (!token || !email) {
      setServerError("Invalid reset link. Please request a new one.");
      return;
    }

    const parsed = resetPasswordSchema.safeParse(formData);
    if (!parsed.success) {
      setErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPasswordAction(token, email, {
        newPassword: parsed.data.newPassword,
        confirmPassword: parsed.data.confirmPassword,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login?reset=true"), 2000);
      } else {
        setServerError(result.error ?? "Something went wrong.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Missing or invalid params
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
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
          </div>
        </nav>
        <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100 text-center">
            <XCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Invalid reset link
            </h1>
            <p className="text-stone-500 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95"
            >
              Request a new link
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
            Reset your password
          </h1>
          <p className="text-stone-500">Choose a new password for your account.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
          {success ? (
            <div className="text-center">
              <CheckCircle
                size={48}
                className="text-emerald-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
                Password reset!
              </h2>
              <p className="text-stone-500 mb-4">
                Redirecting you to sign in...
              </p>
              <Link
                href="/login?reset=true"
                className="text-emerald-600 font-medium hover:underline"
              >
                Click here if not redirected
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
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Min 8 characters"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword[0]}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Re-enter your new password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword[0]}
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
                    "Reset password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
