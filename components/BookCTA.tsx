'use client'

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

import { buildBookingUrl } from '@/lib/booking'

type BookCTAProps = {
  plan?: string
  cta?: string
  children?: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'>

export function BookCTA({
  plan,
  cta = 'book-cta',
  children = 'Book a call',
  className,
  onClick,
  ...rest
}: BookCTAProps) {
  const href = buildBookingUrl(plan)
  const dataPlan = plan ?? 'general'

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return
    }

    if (typeof window !== 'undefined') {
      ;(window as any).plausible?.('BookCallClick', {
        props: {
          cta,
          plan: dataPlan,
        },
      })
    }
  }

  return (
    <a
      {...rest}
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cta={cta}
      data-plan={dataPlan}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
