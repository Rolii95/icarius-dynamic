'use client'

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

import { hasAnalyticsConsent } from '@/app/consent/ConsentBanner'

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

    if (typeof window !== 'undefined' && hasAnalyticsConsent()) {
      ;(window as any).dataLayer?.push({
        event: 'book_call_click',
        cta,
        plan: dataPlan,
      })
      if (typeof (window as any).gtag === 'function') {
        ;(window as any).gtag('event', 'book_call_click', {
          event_category: 'engagement',
          event_label: cta,
          plan: dataPlan,
        })
      }
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
