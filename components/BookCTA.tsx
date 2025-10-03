'use client'

import {
  ContactModalTrigger,
  type ContactModalTriggerProps,
} from '@/components/ContactModal'

export type BookCTAProps = ContactModalTriggerProps

export function BookCTA(props: BookCTAProps) {
  return <ContactModalTrigger {...props} />
}
