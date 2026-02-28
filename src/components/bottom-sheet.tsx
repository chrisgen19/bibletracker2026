"use client";

import type { useBottomSheet } from "@/hooks/use-bottom-sheet";

interface BottomSheetProps {
  sheet: ReturnType<typeof useBottomSheet>;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function BottomSheet({ sheet, header, children }: BottomSheetProps) {
  const {
    state,
    translateY,
    maxTravel,
    isAnimating,
    collapse,
    handleProps,
    contentProps,
    sheetRef,
    contentRef,
    handleTransitionEnd,
    transition,
    maxHeightVh,
  } = sheet;

  const progress = maxTravel > 0 ? Math.max(0, Math.min(1, 1 - translateY / maxTravel)) : 0;
  const isVisible = state !== "collapsed" || isAnimating;

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${progress * 0.2})`,
            transition: isAnimating ? transition : "none",
          }}
          onClick={collapse}
          onKeyDown={(e) => {
            if (e.key === "Escape") collapse();
          }}
          role="button"
          tabIndex={-1}
          aria-label="Close activity log"
        />
      )}

      {/* Sheet container — auto height, capped at maxHeightVh */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-stone-50 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        style={{
          maxHeight: `${maxHeightVh}vh`,
          transform: `translateY(${translateY}px)`,
          transition: isAnimating ? transition : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
          {...handleProps}
        >
          <div className="w-10 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Non-scrollable header (visible in collapsed state) */}
        {header && (
          <div className="shrink-0 px-4">{header}</div>
        )}

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className={`overscroll-contain px-4 pb-4 ${
            state === "collapsed" && !isAnimating
              ? "overflow-hidden"
              : "overflow-y-auto"
          }`}
          {...contentProps}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
