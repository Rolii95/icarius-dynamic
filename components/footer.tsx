import Link from 'next/link'

import { footerNavLinks } from '@/lib/navigation'

export function Footer(){
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-sm text-slate-300 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Icarius Consulting</p>
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
