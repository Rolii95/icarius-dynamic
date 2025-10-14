
import React from 'react';
import Link from 'next/link'

import { footerNavLinks } from '@/lib/navigation'
import Brand from '@/components/site/Brand'
import { bookingUrl } from '@/lib/booking'

export function Footer(){
  const insightsMailto = 'mailto:contact@icarius-consulting.com?subject=Site%20Insights%20CTA'
  const ctaHref = bookingUrl || insightsMailto
  const ctaClasses =
    'inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(12,18,30,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(12,18,30,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60 sm:w-auto sm:px-6 sm:py-3 sm:text-base'

  return (
    <footer className="border-t">
      {/* Mobile Layout - Stacked, Centered */}
      <div className="md:hidden container mx-auto px-4 py-6 text-sm text-slate-300 flex flex-col items-center text-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/brand/icarius_interlock_mark.svg"
            width="48"
            height="48"
            alt=""
            aria-hidden="true"
            className="w-12 h-12"
          />
          <div className="leading-none text-center">
            <div className="font-bold tracking-[0.02em] text-white text-[28px]">Icarius</div>
            <div className="font-semibold tracking-[0.16em] text-white/80 text-[20px]">CONSULTING</div>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-center">
          <p className="text-base text-slate-200">Enjoyed this? Book a 30-min call — we’ll map it to your roadmap.</p>
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClasses}>
            Book a 30-min call
          </a>
        </div>
        <p className="text-base text-slate-300 mt-1">© {new Date().getFullYear()} Icarius Consulting</p>
        <nav className="flex flex-col gap-2 w-full items-center mt-1">
          {footerNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex container mx-auto px-4 py-6 text-sm text-slate-300 items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Brand />
          <p>© {new Date().getFullYear()} Icarius Consulting</p>
        </div>
        <nav className="flex gap-4">
          {footerNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex max-w-sm flex-col items-end gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 text-right">
          <p className="text-sm text-slate-200">Enjoyed this? Book a 30-min call — we’ll map it to your roadmap.</p>
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClasses}>
            Book a 30-min call
          </a>
        </div>
      </div>
    </footer>
  )
}
