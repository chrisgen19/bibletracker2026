"use client";

import { WifiOff, Wifi } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      return;
    }
    if (!wasOfflineRef.current) return;
    wasOfflineRef.current = false;

    // Defer setState to avoid synchronous setState-in-effect lint rule
    const showTimer = setTimeout(() => setShowReconnected(true), 0);
    const hideTimer = setTimeout(() => setShowReconnected(false), 3000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOnline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300 ${
        isOnline
          ? "bg-emerald-600 text-white"
          : "bg-stone-800 text-stone-200"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          Back online
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          You&apos;re offline — some features unavailable
        </>
      )}
    </div>
  );
}
