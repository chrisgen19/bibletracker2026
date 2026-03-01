"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type SheetState = "collapsed" | "dragging" | "expanded";

const COLLAPSED_HEIGHT = 160;
const MAX_HEIGHT_VH = 50;
const VELOCITY_THRESHOLD = 0.5;
const SNAP_THRESHOLD = 0.4;
const TRANSITION = "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)";

export function useBottomSheet() {
  // Measure actual sheet height via ResizeObserver for accurate translateY
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(COLLAPSED_HEIGHT);
  const maxTravel = Math.max(0, sheetHeight - COLLAPSED_HEIGHT);

  const [sheetState, setSheetState] = useState<"collapsed" | "expanded">("collapsed");
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const translateY = dragOffset !== null ? dragOffset : (sheetState === "collapsed" ? maxTravel : 0);
  const state: SheetState = dragOffset !== null ? "dragging" : sheetState;

  // Refs synced via effect for non-passive touch listeners
  const translateYRef = useRef(translateY);
  const maxTravelRef = useRef(maxTravel);
  useEffect(() => {
    translateYRef.current = translateY;
    maxTravelRef.current = maxTravel;
  });

  // Track sheet height via ResizeObserver
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSheetHeight(entry.contentRect.height + entry.contentRect.top);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Touch tracking refs
  const startYRef = useRef(0);
  const startTranslateRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "expanded" || state === "dragging") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [state]);

  const expand = useCallback(() => {
    setIsAnimating(true);
    setDragOffset(null);
    setSheetState("expanded");
  }, []);

  const collapse = useCallback(() => {
    setIsAnimating(true);
    setDragOffset(null);
    setSheetState("collapsed");
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  // Snap function reads refs at call time — safe because expand/collapse are stable
  const snapFn = useCallback((currentY: number, velocity: number) => {
    const mt = maxTravelRef.current;
    const progress = mt > 0 ? 1 - currentY / mt : 0;

    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (velocity < 0) expand();
      else collapse();
      return;
    }

    if (progress > SNAP_THRESHOLD) expand();
    else collapse();
  }, [expand, collapse]);

  // Stable ref so the non-passive effect doesn't re-attach on every snapFn change
  const snapFnRef = useRef(snapFn);
  useEffect(() => {
    snapFnRef.current = snapFn;
  }, [snapFn]);

  // --- Drag handle touch handlers ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    isDraggingRef.current = true;
    startYRef.current = touch.clientY;
    startTranslateRef.current = translateY;
    lastYRef.current = touch.clientY;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
    setIsAnimating(false);
    setDragOffset(translateY);
  }, [translateY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - startYRef.current;
    const mt = maxTravelRef.current;
    const newY = Math.max(0, Math.min(mt, startTranslateRef.current + deltaY));

    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (touch.clientY - lastYRef.current) / dt;
    }
    lastYRef.current = touch.clientY;
    lastTimeRef.current = now;

    setDragOffset(newY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Tap detection: if barely moved, toggle instead of snapping
    const moved = Math.abs(translateY - startTranslateRef.current);
    if (moved < 5) {
      if (sheetState === "collapsed") expand();
      else collapse();
      return;
    }

    snapFn(translateY, velocityRef.current);
  }, [translateY, snapFn, sheetState, expand, collapse]);

  // --- Content area scroll-drag handoff ---
  const contentDragRef = useRef(false);
  const contentStartYRef = useRef(0);

  const handleContentTouchStart = useCallback((e: React.TouchEvent) => {
    contentDragRef.current = false;
    contentStartYRef.current = e.touches[0].clientY;
    lastYRef.current = e.touches[0].clientY;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  }, []);

  // Non-passive touchmove via effect — uses refs to stay stable
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - contentStartYRef.current;
      const scrollTop = el.scrollTop;

      if (scrollTop <= 0 && deltaY > 0) {
        e.preventDefault();

        if (!contentDragRef.current) {
          contentDragRef.current = true;
          isDraggingRef.current = true;
          startYRef.current = touch.clientY;
          startTranslateRef.current = translateYRef.current;
          setIsAnimating(false);
          setDragOffset(translateYRef.current);
        }

        const sheetDelta = touch.clientY - startYRef.current;
        const mt = maxTravelRef.current;
        const newY = Math.max(0, Math.min(mt, startTranslateRef.current + sheetDelta));

        const now = Date.now();
        const dt = now - lastTimeRef.current;
        if (dt > 0) {
          velocityRef.current = (touch.clientY - lastYRef.current) / dt;
        }
        lastYRef.current = touch.clientY;
        lastTimeRef.current = now;

        setDragOffset(newY);
      }
    };

    const handleEnd = () => {
      if (contentDragRef.current) {
        contentDragRef.current = false;
        isDraggingRef.current = false;
        snapFnRef.current(translateYRef.current, velocityRef.current);
      }
    };

    el.addEventListener("touchmove", handleMove, { passive: false });
    el.addEventListener("touchend", handleEnd);

    return () => {
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, []);

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return {
    state,
    translateY,
    maxTravel,
    isAnimating,
    expand,
    collapse,
    handleProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    contentProps: {
      onTouchStart: handleContentTouchStart,
    },
    sheetRef,
    contentRef,
    handleTransitionEnd,
    transition: TRANSITION,
    collapsedHeight: COLLAPSED_HEIGHT,
    maxHeightVh: MAX_HEIGHT_VH,
  };
}
