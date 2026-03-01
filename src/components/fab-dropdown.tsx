"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus, BookOpen, HandHeart } from "lucide-react";

interface FabDropdownProps {
  onLogReading: () => void;
  onLogPrayer: () => void;
  className?: string;
  shouldPulse?: boolean;
}

/**
 * Compute fixed position for the dropdown menu relative to the trigger button.
 * Desktop (>=640px): open below; Mobile: open above (FAB sits near screen bottom).
 */
const computePosition = (
  rect: DOMRect,
): { top: number; left: number } => {
  const menuWidth = 180;
  const menuHeight = 100;
  const gap = 8;
  const isDesktop = window.innerWidth >= 640;

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const goBelow = isDesktop
    ? spaceBelow >= menuHeight + gap || spaceBelow >= spaceAbove
    : spaceAbove < menuHeight + gap;

  const top = goBelow ? rect.bottom + gap : rect.top - menuHeight - gap;

  let left = rect.right - menuWidth;
  if (left < 8) left = 8;

  return { top, left };
};

export function FabDropdown({
  onLogReading,
  onLogPrayer,
  className = "",
  shouldPulse = false,
}: FabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Directly mutate the menu element's style — avoids setState-in-effect lint error
  const applyPosition = useCallback(() => {
    if (!buttonRef.current || !menuRef.current) return;
    const pos = computePosition(buttonRef.current.getBoundingClientRect());
    menuRef.current.style.top = `${pos.top}px`;
    menuRef.current.style.left = `${pos.left}px`;
  }, []);

  // Callback ref: positions the menu the instant the portal mounts
  const menuCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (node) applyPosition();
    },
    [applyPosition],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", applyPosition, true);
    window.addEventListener("resize", applyPosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", applyPosition, true);
      window.removeEventListener("resize", applyPosition);
    };
  }, [isOpen, applyPosition]);

  return (
    <div className={className}>
      {/* FAB button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-200 active:scale-95 bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10 ring-2 ring-white ${shouldPulse ? "animate-pulse-subtle" : ""}`}
      >
        <Plus
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
        />
        Log
      </button>

      {/* Portal dropdown — escapes overflow:hidden parents */}
      {isOpen &&
        createPortal(
          <div
            ref={menuCallbackRef}
            className="fixed min-w-[180px] bg-white rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-100 overflow-hidden animate-in fade-in duration-150 z-[9999]"
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogReading();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <BookOpen size={18} className="text-emerald-600" />
              Log Reading
            </button>
            <div className="h-px bg-stone-100" />
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogPrayer();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <HandHeart size={18} className="text-amber-600" />
              Log Prayer
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
