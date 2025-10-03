'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { BookCTA } from '@/components/BookCTA'
import { primaryNavLinks } from '@/lib/navigation'

export function Header() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      </div>
    </header>
  )
}
