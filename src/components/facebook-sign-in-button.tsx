"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface FacebookSignInButtonProps {
  callbackUrl?: string;
  label?: string;
}

export function FacebookSignInButton({
  callbackUrl = "/dashboard",
  label = "Continue with Facebook",
}: FacebookSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await signIn("facebook", { callbackUrl });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-medium bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
              fill="#1877F2"
            />
            <path
              d="M16.671 15.47L17.203 12h-3.328V9.75c0-.949.465-1.875 1.956-1.875h1.513V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669V12H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0V15.47h2.796z"
              fill="#FFFFFF"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
