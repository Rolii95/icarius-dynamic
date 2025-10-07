'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { BookCTA } from '@/components/BookCTA'
import { primaryNavLinks } from '@/lib/navigation'

export function Header() {
  const [solid, setSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-40 transition-colors border-b ${
        solid ? 'backdrop-blur bg-[rgba(11,16,32,.7)]' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-3 font-bold leading-none">
          <Image
            src="/icarius-logo.svg"
            alt="Icarius logo"
            width={40}
            height={40}
            className="h-9 w-9 md:h-10 md:w-10"
            priority
          />
          <span className="text-xl md:text-2xl tracking-tight">Icarius Consulting</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {primaryNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
          <BookCTA
            data-cta="header"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
          >
            Book a call
          </BookCTA>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--surface)] z-[60] md:hidden shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-4">
                  {primaryNavLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block px-4 py-3 text-base rounded-lg hover:bg-white/10 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* CTA Button */}
              <div className="p-4 border-t border-white/10">
                <BookCTA
                  data-cta="header-mobile"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3"
                  onClick={closeMobileMenu}
                >
                  Book a call
                </BookCTA>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
