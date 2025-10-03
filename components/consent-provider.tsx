'use client'

import { ConsentBanner } from '@/app/consent/ConsentBanner'

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <ConsentBanner />
    </>
  )
}
