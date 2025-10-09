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

  useEffect(() => {
    if (!open) {
      unlockBodyScroll();
      return;
    }

    lockBodyScroll();
    setTimeout(() => (firstFocusRef.current ?? panelRef.current)?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && panelRef.current) {
        const root = panelRef.current;
        const f = root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockBodyScroll();
    };
  }, [open, onClose]);

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      // Fullscreen overlay root: never constrained by header layout
      className={[
        "fixed inset-0 z-[60]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={open ? "false" : "true"}
      onMouseDown={onBackdrop}
      style={{ contain: "layout paint size" }}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/50 transition-opacity md:backdrop-blur-sm",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Panel wrapper uses FLEX to anchor at top; no absolute math */}
      <div className="relative z-10 flex h-full w-full items-start justify-end">
        <div
          ref={panelRef}
          id={id}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={[
            "w-[88vw] max-w-sm",
            "mr-4 pr-[env(safe-area-inset-right)]",
            "h-screen",
            "bg-[#0E1525] border-b border-white/10 shadow-xl",
            "transform-gpu transition-transform duration-200 origin-top-right",
            open ? "translate-y-0" : "-translate-y-full",
            "overflow-y-auto overscroll-contain",
            "pt-[env(safe-area-inset-top)]",
          ].join(" ")}
          style={{ height: "100dvh", WebkitTapHighlightColor: "transparent" }}
        >
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

          <nav className="px-4 pb-6 grid grid-cols-1 gap-1 [&>*]:block [&>*]:w-full [&>*]:text-left [&>*]:text-lg [&>*]:py-2">
            {children}
          </nav>
        </div>
      </div>
    </div>
  );
}
