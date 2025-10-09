'use client'

import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useState } from 'react'
import type { AnchorHTMLAttributes } from 'react'

import { buildBookingUrl } from '@/lib/booking'
import { track } from '@/lib/analytics'
import type { ContactModalTriggerProps } from './ContactModal'

const ContactModalTrigger = dynamic<ContactModalTriggerProps>(
  () => import('@/components/ContactModal').then((m) => m.ContactModalTrigger),
  { ssr: false },
)

export type BookCTAProps = {
  plan?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const BookCTA = forwardRef<HTMLAnchorElement, BookCTAProps>(
  ({ plan, children = 'Book a 15-min fit call', target = '_blank', rel, ...props }, ref) => {
    const href = buildBookingUrl(plan)
    const computedRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
    const [triggerReady, setTriggerReady] = useState(false)

    useEffect(() => {
      let isMounted = true

      import('@/components/ContactModal').then(() => {
        if (isMounted) {
          setTriggerReady(true)
        }
      })

      return () => {
        isMounted = false
      }
    }, [])

    if (triggerReady) {
      return (
        <ContactModalTrigger
          {...props}
          plan={plan}
          target={target}
          rel={computedRel}
        >
          {children}
        </ContactModalTrigger>
      )
    }

    return (
      <a
        {...props}
        ref={ref}
        href={href}
        target={target}
        rel={computedRel}
        onClick={(event) => {
          props.onClick?.(event)

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

          const { cta, plan: planDataset } = event.currentTarget.dataset
          track('BookCallClick', {
            cta: cta ?? 'book-cta',
            plan: planDataset ?? plan ?? 'general',
          })
        }}
      >
        {children}
      </a>
    )
  },
)

BookCTA.displayName = 'BookCTA'
