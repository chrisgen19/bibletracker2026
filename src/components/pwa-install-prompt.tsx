"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Download, X, Share, PlusSquare } from "lucide-react";

const STORAGE_KEY = "pwa-install-prompt";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone)
  );
}

function shouldShowPrompt(): boolean {
  if (isStandalone()) return false;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;

    const data = JSON.parse(stored) as { installed?: boolean; dismissedAt?: number };
    if (data.installed) return false;
    if (data.dismissedAt && Date.now() - data.dismissedAt < ONE_WEEK_MS) return false;

    return true;
  } catch {
    return true;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }));
  } catch {}
}

function markInstalled() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ installed: true }));
  } catch {}
}

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!shouldShowPrompt()) return;

    // Chrome/Edge: capture the native install prompt
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // iOS Safari: show custom instructions after a short delay
    if (isIOS()) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }

    // Non-iOS browsers without beforeinstallprompt: show after delay
    // (in case the event fires late)
    const fallbackTimer = setTimeout(() => {
      if (!deferredPromptRef.current && !isIOS()) {
        // No install prompt available — don't show
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Listen for successful install
  useEffect(() => {
    function handleInstalled() {
      markInstalled();
      setVisible(false);
    }
    window.addEventListener("appinstalled", handleInstalled);
    return () => window.removeEventListener("appinstalled", handleInstalled);
  }, []);

  const handleInstall = useCallback(async () => {
    if (isIOS()) {
      setShowIosGuide(true);
      return;
    }

    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === "accepted") {
      markInstalled();
    } else {
      markDismissed();
    }
    deferredPromptRef.current = null;
    setVisible(false);
  }, []);

  const handleDismiss = useCallback(() => {
    markDismissed();
    setVisible(false);
    setShowIosGuide(false);
  }, []);

  if (!visible) return null;

  // iOS step-by-step guide
  if (showIosGuide) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-900">
              Install Scriptura
            </h3>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ol className="space-y-3 text-sm text-stone-600">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-700">
                1
              </span>
              <span className="pt-0.5">
                Tap the{" "}
                <Share className="inline h-4 w-4 text-blue-500" />{" "}
                <strong>Share</strong> button in Safari
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-700">
                2
              </span>
              <span className="pt-0.5">
                Scroll down and tap{" "}
                <PlusSquare className="inline h-4 w-4 text-stone-600" />{" "}
                <strong>Add to Home Screen</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-700">
                3
              </span>
              <span className="pt-0.5">
                Tap <strong>Add</strong> to install
              </span>
            </li>
          </ol>

          <button
            type="button"
            onClick={handleDismiss}
            className="mt-4 w-full rounded-xl bg-stone-100 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // Floating install banner
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm animate-[slide-up_0.3s_ease-out] sm:left-auto sm:right-6 sm:bottom-6">
      <div className="flex items-center gap-3 rounded-2xl bg-stone-900 p-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-700">
          <Download className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            Install Scriptura
          </p>
          <p className="text-xs text-stone-400">
            Add to your home screen for quick access
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-stone-500 hover:text-stone-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
