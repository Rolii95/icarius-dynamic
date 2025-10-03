'use client'

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react'

import { hasAnalyticsConsent } from '@/app/consent/ConsentBanner'

import { buildBookingUrl } from '@/lib/booking'
import { ContactModal } from '@/components/ContactModal'

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
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

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

    event.preventDefault()

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

    setModalOpen(true)
  }

  return (
    <>
      <a
        {...rest}
        ref={triggerRef}
        className={className}
        href={href}
        data-cta={cta}
        data-plan={dataPlan}
        onClick={handleClick}
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
      >
        {children}
      </a>
      <ContactModal
        open={modalOpen}
        onClose={closeModal}
        plan={plan}
        triggerRef={triggerRef}
      />
    </>
  )
}
