'use client'

import { forwardRef } from 'react'
import type { AnchorHTMLAttributes } from 'react'

import { buildBookingUrl } from '@/lib/booking'

export type BookCTAProps = {
  plan?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const BookCTA = forwardRef<HTMLAnchorElement, BookCTAProps>(
  ({ plan, children = 'Book a call', target = '_blank', rel, ...props }, ref) => {
    const href = buildBookingUrl(plan)
    const computedRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

    return (
      <a
        {...props}
        ref={ref}
        href={href}
        target={target}
        rel={computedRel}
      >
        {children}
      </a>
    )
  },
)

BookCTA.displayName = 'BookCTA'
