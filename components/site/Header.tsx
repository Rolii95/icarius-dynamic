"use client";
import { useState, useRef } from "react";
import { useScrollShrink } from "@/hooks/useScrollShrink";
import MobileMenu from "@/components/site/MobileMenu";
import Brand from "@/components/site/Brand";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { bookingUrl } from "@/lib/booking";

export default function Header() {
  const [open, setOpen] = useState(false);
  const shrunk = useScrollShrink({ threshold: 12, paused: open });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "";
  const close = () => {
    setOpen(false);
    setTimeout(() => toggleRef.current?.focus(), 0);
  };

  const navItems = [
    { href: "/about", label: "About", match: (path: string) => path.startsWith("/about") },
    { href: "/services", label: "Services", match: (path: string) => path.startsWith("/services") },
    { href: "/work", label: "Work", match: (path: string) => path.startsWith("/work") },
    { href: "/packages", label: "Packages", match: (path: string) => path.startsWith("/packages") },
    { href: "/insights", label: "Insights", match: (path: string) => path.startsWith("/insights") },
    {
      href: "/resources/white-paper",
      label: "Resources",
      match: (path: string) => path.startsWith("/resources/white-paper"),
    },
    { href: "/contact", label: "Contact", match: (path: string) => path.startsWith("/contact") },
  ];

  const linkClassName = (active: boolean) =>
    [
      "transition-colors",
      active ? "text-white" : "text-white/80 hover:text-white",
    ].join(" ");

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
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  className={linkClassName(active)}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link className="text-sky-300 hover:text-sky-200" href={bookingUrl} target="_blank" rel="noopener noreferrer">
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
        {navItems.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={`mobile-${item.href}`}
              className={active ? "py-2 text-lg text-sky-200" : "py-2 text-lg text-white"}
              href={item.href}
              onClick={close}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        <Link className="py-2 text-lg text-sky-300" href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={close}>
          Book a call
        </Link>
      </MobileMenu>
    </>
  );
}
