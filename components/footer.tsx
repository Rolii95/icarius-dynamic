
import React from 'react';
import Link from 'next/link'

import { footerNavLinks } from '@/lib/navigation'
import Brand from '@/components/site/Brand'

export function Footer(){
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
      <div className="hidden md:flex container mx-auto px-4 py-6 text-sm text-slate-300 items-center justify-between">
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
      </div>
    </footer>
  )
}
