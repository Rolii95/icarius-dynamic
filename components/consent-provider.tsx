'use client'
import { useEffect, useState } from 'react'
import Script from 'next/script'

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<'unknown'|'all'|'essential'>(() =>
    typeof window !== 'undefined' ? ((localStorage.getItem('icarius_consent') as any) || 'unknown') : 'unknown'
  )

  useEffect(() => { if (consent !== 'unknown') localStorage.setItem('icarius_consent', consent) }, [consent])

  // Global click handler for any [data-book-call] element (works across the whole app)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const trigger = target?.closest?.('[data-book-call]')
      if (trigger) {
        if (e.metaKey || e.ctrlKey || e.button !== 0) {
          return
        }
        e.preventDefault()
        ;(window as any).plausible?.('BookCallClick')
        document.getElementById('calendly')?.setAttribute('aria-hidden', 'false')
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      {/* Load Plausible only after consent */}
      {consent === 'all' && (
        <Script
          id="plausible"
          strategy="afterInteractive"
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'icarius-consulting.com'}
          src="https://plausible.io/js/plausible.js"
        />
      )}

      {/* Calendly inline embed script (required for the inline widget) */}
      <Script
        id="calendly-widget"
        strategy="afterInteractive"
        src="https://assets.calendly.com/assets/external/widget.js"
      />

      {children}

      {/* Minimal consent banner */}
      {consent === 'unknown' && (
        <div className="fixed inset-0 flex items-end justify-center p-4 z-50">
          <div className="bg-[linear-gradient(160deg,var(--surface),var(--surface-2))] border border-[rgba(255,255,255,.12)] rounded-2xl p-4 w-full max-w-xl shadow-lg">
            <p className="text-sm">
              <strong>Cookies & analytics</strong><br />
              <span className="text-slate-300">We use privacy-friendly analytics to improve this site. No marketing cookies.</span>
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setConsent('all')} className="rounded-full bg-[color:var(--primary)] text-slate-900 px-4 py-2">Allow analytics</button>
              <button onClick={() => setConsent('essential')} className="rounded-full border px-4 py-2">Essential only</button>
            </div>
          </div>
        </div>
      )}

      {/* Calendly modal */}
      <div className="modal" id="calendly" aria-hidden="true" role="dialog" aria-modal="true">
        <div className="modal-box" role="document">
          <h3 className="text-xl font-semibold">Book an intro call</h3>
          <div
            id="calendlyInline"
            className="calendly-inline-widget"
            data-url={process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/icarius/intro-call'}
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
