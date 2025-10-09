"use client";
import { useState, useRef } from "react";
import { useScrollShrink } from "@/hooks/useScrollShrink";
import MobileMenu from "@/components/site/MobileMenu";
import Brand from "@/components/site/Brand";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const shrunk = useScrollShrink({ threshold: 12, paused: open });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    setTimeout(() => toggleRef.current?.focus(), 0);
  };

  return (
    <>
      <header
        className={[
          "sticky-header sticky top-0 z-50",
          "bg-[#0E1525]/85",
          "md:backdrop-blur supports-[backdrop-filter]:md:bg-[#0E1525]/60",
          "transition-colors",
          shrunk ? "py-3" : "py-5",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
          <Brand />
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <Link className="text-white/80 hover:text-white" href="/about">
              About
            </Link>
            <Link className="text-white/80 hover:text-white" href="/services">
              Services
            </Link>
            <Link className="text-white/80 hover:text-white" href="/work">
              Work
            </Link>
            <Link className="text-white/80 hover:text-white" href="/packages">
              Packages
            </Link>
            <Link className="text-white/80 hover:text-white" href="/insights">
              Insights
            </Link>
            <Link className="text-white/80 hover:text-white" href="/contact">
              Contact
            </Link>
            <Link className="text-sky-300 hover:text-sky-200" href="https://calendly.com/">
              Book a call
            </Link>
          </nav>
          <button
            ref={toggleRef}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="ml-auto rounded-md p-2 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 ring-sky-400/60 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} id="mobile-menu">
        <Link className="py-2 text-lg text-white" href="/about" onClick={close}>
          About
        </Link>
        <Link className="py-2 text-lg text-white" href="/services" onClick={close}>
          Services
        </Link>
        <Link className="py-2 text-lg text-white" href="/work" onClick={close}>
          Work
        </Link>
        <Link className="py-2 text-lg text-white" href="/packages" onClick={close}>
          Packages
        </Link>
        <Link className="py-2 text-lg text-white" href="/insights" onClick={close}>
          Insights
        </Link>
        <Link className="py-2 text-lg text-white" href="/contact" onClick={close}>
          Contact
        </Link>
        <Link className="py-2 text-lg text-sky-300" href="https://calendly.com/" onClick={close}>
          Book a call
        </Link>
      </MobileMenu>
    </>
  );
}
