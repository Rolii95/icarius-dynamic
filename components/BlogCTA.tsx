'use client'

import Link from 'next/link'
import { ReactNode, useMemo } from 'react'

import { buildBookingUrl } from '@/lib/booking'

export type BlogCTAProps = {
  /** Optional plan identifier appended to the booking URL. */
  plan?: string
  /** Additional Tailwind CSS classes for the CTA element. */
  className?: string
  children?: ReactNode
}

export function BlogCTA({ plan, className, children }: BlogCTAProps) {
  const href = useMemo(() => buildBookingUrl(plan), [plan])

  const classes = [
    'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-20px_rgba(59,130,246,0.75)] transition hover:shadow-[0_22px_55px_-18px_rgba(14,165,233,0.8)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link href={href} className={classes} prefetch={false}>
      {children ?? 'Book a discovery call'}
    </Link>
  )
}
