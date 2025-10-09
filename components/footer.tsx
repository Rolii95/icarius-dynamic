
import React from 'react';
import Link from 'next/link'

import { footerNavLinks } from '@/lib/navigation'
import Brand from '@/components/site/Brand'

export function Footer(){
  return (
    <footer className="border-t">
      {/* Mobile Layout - Stacked, Centered */}
      <div className="md:hidden container mx-auto px-4 py-6 text-sm text-slate-300 flex flex-col items-center text-center gap-3">
        <Brand />
        <p className="text-base text-slate-300 mt-2 mb-1">© {new Date().getFullYear()} Icarius Consulting</p>
        <nav className="flex flex-col gap-2 w-full items-center">
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
