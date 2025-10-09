"use client";
import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/scrollLock";

export default function MobileMenu({
  open, onClose, id = "mobile-menu", children,
}: { open: boolean; onClose: () => void; id?: string; children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) { unlockBodyScroll(); return; }
    lockBodyScroll();
    setTimeout(() => (firstRef.current ?? panelRef.current)?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const root = panelRef.current!;
        const f = root.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const backdropClick = (e: MouseEvent) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      aria-hidden={open ? "false" : "true"}
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      onMouseDown={backdropClick}
      style={{ contain: "layout paint size" }}
    >
      <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={[
          "absolute left-0 right-0 top-0 mx-auto max-w-screen-sm",
          "h-[100dvh] supports-[height:100dvh]:h-[100dvh]",
          "bg-[#0E1525] border-b border-white/10 shadow-xl",
          "transition-transform will-change-transform",
          open ? "translate-y-0" : "-translate-y-full",
          "overflow-y-auto overscroll-contain pt-[env(safe-area-inset-top)]",
        ].join(" ")}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Menu</span>
            <button
              ref={firstRef}
              onClick={onClose}
              className="rounded-md px-3 py-1 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 ring-sky-400/60"
            >
              Close
            </button>
          </div>
          <nav className="mt-2 flex flex-col gap-2">{children}</nav>
        </div>
      </div>
    </div>
  );
}
