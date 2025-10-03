'use client'

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { hasAnalyticsConsent } from '@/app/consent/ConsentBanner'
import { buildBookingUrl } from '@/lib/booking'

import { AccessibleModal } from './AccessibleModal'

type ContactModalProps = {
  open: boolean
  onClose: () => void
  plan?: string
  triggerRef?: RefObject<HTMLElement | null> | MutableRefObject<HTMLElement | null>
}

export function ContactModal({ open, onClose, plan, triggerRef }: ContactModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (wasOpen.current && !open && triggerRef?.current) {
      triggerRef.current.focus({ preventScroll: true })
    }
    wasOpen.current = open
  }, [open, triggerRef])

  const bookingSrc = useMemo(() => buildBookingUrl(plan), [plan])

  return (
    <AccessibleModal
      open={open}
      onClose={onClose}
      labelledBy="contact-modal-title"
      initialFocusRef={closeButtonRef}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h2 id="contact-modal-title" className="text-2xl font-semibold">
            Book an intro call
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-white/40 hover:bg-white/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="text-sm text-slate-300">
          Schedule a 30-minute consultation to explore your HR technology goals.
        </p>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <iframe
            title="Calendly scheduling"
            src={bookingSrc}
            className="h-[680px] w-full"
            loading="lazy"
            allow="clipboard-write; fullscreen"
          />
        </div>
      </div>
    </AccessibleModal>
  )
}

type ContactModalTriggerBaseProps = {
  plan?: string
  cta?: string
  children?: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export type ContactModalTriggerProps = ContactModalTriggerBaseProps

export function ContactModalTrigger({
  plan,
  cta = 'book-cta',
  children = 'Book a call',
  className,
  onClick,
  target,
  rel,
  ...rest
}: ContactModalTriggerProps) {
  const href = buildBookingUrl(plan)
  const dataPlan = plan ?? 'general'
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const anchorRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

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
        target={target}
        rel={anchorRel}
        data-cta={cta}
        data-plan={dataPlan}
        onClick={handleClick}
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
      >
        {children}
      </a>
      <ContactModal open={modalOpen} onClose={closeModal} plan={plan} triggerRef={triggerRef} />
    </>
  )
}
