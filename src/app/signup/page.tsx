"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Calendar,
} from "lucide-react";
import { signupSchema } from "@/lib/validations/auth";
import { COUNTRIES } from "@/lib/constants/countries";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    gender: "",
    phoneNumber: "",
    country: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    const parsed = signupSchema.safeParse(formData);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setServerError(data.error || "Something went wrong");
        }
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setServerError("Account created but failed to sign in. Please log in manually.");
        return;
      }

      router.push("/dashboard");
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

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
            Create your account
          </h1>
          <p className="text-stone-500">
            Begin your Bible reading journey today.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-stone-100">
          {serverError && (
            <div className="bg-red-50 text-red-700 text-sm rounded-2xl px-4 py-3 mb-6 border border-red-100">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First name"
                name="firstName"
                icon={User}
                value={formData.firstName}
                onChange={handleChange}
                errors={errors.firstName}
                placeholder="John"
              />
              <InputField
                label="Last name"
                name="lastName"
                icon={User}
                value={formData.lastName}
                onChange={handleChange}
                errors={errors.lastName}
                placeholder="Doe"
              />
            </div>

            {/* Username */}
            <InputField
              label="Username"
              name="username"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              errors={errors.username}
              placeholder="johndoe (optional)"
            />

            {/* Email */}
            <InputField
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              errors={errors.email}
              placeholder="john@example.com"
            />

            {/* Birthday */}
            <InputField
              label="Birthday"
              name="birthday"
              type="date"
              icon={Calendar}
              value={formData.birthday}
              onChange={handleChange}
              errors={errors.birthday}
            />

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender[0]}</p>
              )}
            </div>

            {/* Phone Number */}
            <InputField
              label="Phone number"
              name="phoneNumber"
              type="tel"
              icon={Phone}
              value={formData.phoneNumber}
              onChange={handleChange}
              errors={errors.phoneNumber}
              placeholder="+1 (555) 123-4567 (optional)"
            />

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Country
              </label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Confirm password
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
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* Terms */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label className="text-sm text-stone-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-emerald-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-emerald-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.termsAccepted[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Create account
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

// --- Reusable Input Field ---

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string[];
  placeholder?: string;
}

function InputField({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  onChange,
  errors,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
        />
      </div>
      {errors && <p className="text-red-500 text-xs mt-1">{errors[0]}</p>}
    </div>
  );
}
