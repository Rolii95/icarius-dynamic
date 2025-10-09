'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'icarius_consent'
const CONSENT_GRANTED = 'granted'
const CONSENT_DENIED = 'denied'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __analyticsLoaded?: boolean
    __gtmLoaded?: boolean
  }
}

const injectScript = (id: string, src: string) => {
  if (typeof document === 'undefined' || document.getElementById(id)) {
    return
  }

  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head?.appendChild(script)
}

export const loadAnalytics = () => {
  if (typeof window === 'undefined') return
  if (window.__analyticsLoaded) return

  window.__analyticsLoaded = true
  window.dataLayer = window.dataLayer || []

  const gtag = window.gtag ?? ((...args: unknown[]) => {
    window.dataLayer?.push(args)
  })

  window.gtag = gtag
  gtag('consent', 'update', { analytics_storage: 'granted' })

  if (GTM_ID && !window.__gtmLoaded) {
    window.__gtmLoaded = true
    window.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    injectScript('gtm-script', `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`)
  }

  if (GA_MEASUREMENT_ID) {
    injectScript(
      'ga-script',
      `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
    )
    gtag('js', new Date())
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true })
  }
}

const updateDeniedConsent = () => {
  if (typeof window === 'undefined') return
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
}

export function ConsentBanner() {
  const [consent, setConsent] = useState<'unknown' | typeof CONSENT_GRANTED | typeof CONSENT_DENIED>('unknown')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === CONSENT_GRANTED || stored === CONSENT_DENIED) {
      setConsent(stored)
    }
  }, [])

  useEffect(() => {
    if (consent === 'unknown' || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, consent)

    if (consent === CONSENT_GRANTED) {
      loadAnalytics()
    } else {
      updateDeniedConsent()
    }
  }, [consent])

  const allowAnalytics = useCallback(() => setConsent(CONSENT_GRANTED), [])
  const essentialOnly = useCallback(() => setConsent(CONSENT_DENIED), [])

  const banner = useMemo(() => {
    if (consent !== 'unknown') return null

    return (
      // Limit overlay to the bottom area and allow page behind to scroll
      <div className="fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none">
        <div className="pointer-events-auto bg-[linear-gradient(160deg,var(--surface),var(--surface-2))] border border-[rgba(255,255,255,.12)] rounded-2xl p-4 w-full max-w-xl mx-auto shadow-lg">
          <p className="text-sm">
            <strong>Cookies & analytics</strong>
            <br />
            <span className="text-slate-300">
              We use analytics to understand how the site is used. No marketing cookies.
            </span>
          </p>
          <div className="flex gap-2 mt-2">
            <button onClick={allowAnalytics} className="rounded-full bg-[color:var(--primary)] text-slate-900 px-4 py-2">
              Allow analytics
            </button>
            <button onClick={essentialOnly} className="rounded-full border px-4 py-2">
              Essential only
            </button>
          </div>
        </div>
      </div>
    )
  }, [allowAnalytics, essentialOnly, consent])

  return banner
}

export const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === CONSENT_GRANTED
}
