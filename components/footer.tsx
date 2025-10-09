import Link from 'next/link'

import { footerNavLinks } from '@/lib/navigation'
import Brand from '@/components/site/Brand'

export function Footer(){
  return (
    <footer className="border-t">
      {/* Mobile Layout - Stacked */}
      <div className="md:hidden container mx-auto px-4 py-6 text-sm text-slate-300 flex flex-col gap-4 items-center text-center">
        <Brand />
        <p>© {new Date().getFullYear()} Icarius Consulting</p>
        <nav className="flex flex-col gap-3">
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
