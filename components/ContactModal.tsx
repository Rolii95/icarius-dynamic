'use client'

import {
  type MutableRefObject,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react'

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
