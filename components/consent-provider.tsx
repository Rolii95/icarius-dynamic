'use client'

import Script from 'next/script'

import { ConsentBanner } from '@/app/consent/ConsentBanner'
import { bookingUrl } from '@/lib/booking'

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="calendly-widget"
        strategy="afterInteractive"
        src="https://assets.calendly.com/assets/external/widget.js"
      />

      {children}

      <ConsentBanner />

      <div className="modal" id="calendly" aria-hidden="true" role="dialog" aria-modal="true">
        <div className="modal-box" role="document">
          <h3 className="text-xl font-semibold">Book an intro call</h3>
          <div
            id="calendlyInline"
            className="calendly-inline-widget"
            data-url={bookingUrl}
            style={{ minWidth: 320, height: 660 }}
          />
          <button
            className="rounded-full border px-4 py-2 mt-2"
            onClick={() => document.getElementById('calendly')?.setAttribute('aria-hidden', 'true')}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
