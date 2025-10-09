"use client";
import { useEffect, useRef } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/scrollLock";

type Props = {
  open: boolean;
  onClose: () => void;
  id?: string;
  children: React.ReactNode;
};

export default function MobileMenu({ open, onClose, id = "mobile-menu", children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock + focus handling
  useEffect(() => {
    if (!open) { unlockBodyScroll(); return; }
    lockBodyScroll();
    // focus first focusable or panel
    setTimeout(() => (firstFocusRef.current ?? panelRef.current)?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && panelRef.current) {
        const root = panelRef.current;
        const f = root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const backdropClick = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      // Fullscreen overlay root: never constrained by header layout
      className={[
        "fixed inset-0 z-[60]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={open ? "false" : "true"}
      onMouseDown={backdropClick}
      style={{ contain: "layout paint size" }}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Panel wrapper uses FLEX to anchor at top; no absolute math */}
      <div className="relative z-10 flex w-full h-full items-start justify-center">
        {/* Slide-down panel (full width on mobile) */}
        <div
          ref={panelRef}
          id={id}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={[
            "w-full max-w-screen-sm",
            // Make it truly fill the viewport vertically on mobile
            "h-screen",
            "bg-[#0E1525] border-b border-white/10 shadow-xl",
            // Vertical slide animation only
            "transform-gpu transition-transform duration-200",
            open ? "translate-y-0" : "-translate-y-full",
            // Scrollable content inside; prevent rubber-band behind
            "overflow-y-auto overscroll-contain",
            // Safe-area top padding for notches
            "pt-[env(safe-area-inset-top)]",
          ].join(" ")}
          // Strong fallback for older browsers: force dvh height when available
          style={{ height: "100dvh", WebkitTapHighlightColor: "transparent" }}
        >
          {/* Header row inside the panel */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-white/70 text-sm">Menu</span>
            <button
              ref={firstFocusRef}
              onClick={onClose}
              className="rounded-md px-3 py-1 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 ring-sky-400/60"
            >
              Close
            </button>
          </div>

          {/* FORCE vertical list; block-level links; full width */}
          <nav
            className={[
              "px-4 pb-6",
              "grid grid-cols-1 gap-1",           // <- never horizontal
              "[&>*]:block [&>*]:w-full [&>*]:text-left", // <- force block anchors
              "[&>*]:text-lg [&>*]:py-2",         // touch target sizing
            ].join(" ")}
          >
            {children}
          </nav>
        </div>
      </div>
    </div>
  );
}
