'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type BackLinkProps = {
  label?: string
  /** Where to go if history/back is not safe (omit to use smart fallback) */
  href?: string
  contextualLabel?: boolean
  className?: string
  overlapPx?: number
}

// Label/fallback maps keep contextual copy aligned with their section roots.
const SECTION_LABELS: Record<string, string> = {
  work: 'Back to work',
  insights: 'Back to insights',
  blog: 'Back to insights',
  packages: 'Back to packages',
  services: 'Back to services',
  contact: 'Back to home',
  about: 'Back to home',
  'case-studies': 'Back to work',
  '': 'Back to home',
}

const SECTION_FALLBACKS: Record<string, string> = {
  work: '/work',
  insights: '/insights',
  blog: '/insights',
  packages: '/packages',
  services: '/services',
  contact: '/',
  about: '/',
  'case-studies': '/work',
  '': '/',
}

const SECTION_ALIASES: Record<string, string> = {
  blog: 'insights',
  'case-studies': 'work',
}

const normaliseSection = (value: string | undefined): string => {
  if (!value) {
    return ''
  }

  const lower = value.toLowerCase()
  return SECTION_ALIASES[lower] ?? lower
}

const getSectionFromPath = (path: string | undefined): string => {
  if (!path) {
    return ''
  }

  const [first] = path.split('/').filter(Boolean)
  return normaliseSection(first)
}

export const __BACKLINK_INTERNALS__ = {
  SECTION_LABELS,
  SECTION_FALLBACKS,
  SECTION_ALIASES,
  normaliseSection,
  getSectionFromPath,
} as const

// Preserve history back when the user came from the same origin.
const hasSameOriginReferrer = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }

  const { referrer } = document
  if (!referrer) {
    return false
  }

  try {
    const refUrl = new URL(referrer)
    return refUrl.origin === window.location.origin
  } catch {
    return false
  }
}

const emitBackLinkEvent = () => {
  if (typeof window === 'undefined') {
    return
  }

  const win = window as Window & {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }

  const payload = { event: 'BackLinkClick' }

  if (!Array.isArray(win.dataLayer)) {
    win.dataLayer = []
  }

  win.dataLayer.push(payload)
  win.gtag?.('event', 'BackLinkClick', { event_category: 'engagement' })
}

export function BackLink({
  label,
  href,
  contextualLabel = true,
  className = '',
  overlapPx = 4,
}: BackLinkProps) {
  const pathname = usePathname()
  const router = useRouter()
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const { autoLabel, fallbackHref } = useMemo(() => {
    let currentSection = getSectionFromPath(pathname ?? '')

    if (typeof window !== 'undefined' && hasSameOriginReferrer()) {
      try {
        const refPath = new URL(document.referrer).pathname
        currentSection = getSectionFromPath(refPath)
      } catch {
        currentSection = getSectionFromPath(pathname ?? '')
      }
    }

    const normalised = normaliseSection(currentSection)

    return {
      autoLabel: SECTION_LABELS[normalised] ?? 'Back',
      fallbackHref: SECTION_FALLBACKS[normalised] ?? '/',
    }
  }, [pathname])

  const computedLabel = useMemo(() => {
    if (label) {
      return label
    }

    if (!contextualLabel) {
      return 'Back'
    }

    return autoLabel
  }, [autoLabel, contextualLabel, label])

  const computedHref = useMemo(() => {
    if (href) {
      return href
    }

    return fallbackHref
  }, [fallbackHref, href])

  const debugAttributes =
    process.env.NODE_ENV !== 'production'
      ? { 'data-back-label': computedLabel, 'data-back-href': computedHref }
      : undefined

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      emitBackLinkEvent()
      const isMainButton = event.button === 0
      const hasModifier = event.metaKey || event.ctrlKey || event.altKey || event.shiftKey

      if (!isMainButton || hasModifier || event.defaultPrevented) {
        return
      }

      // Only stop navigation when we actually go back()
      if (hasSameOriginReferrer()) {
        event.preventDefault()
        router.back()
      }
    },
    [router],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const element = linkRef.current
    const host = element?.closest('[data-backlink-container]') as HTMLElement | null
    const target = host ?? element?.parentElement ?? undefined

    if (!element || !target) {
      return
    }

    const updateMetrics = () => {
      const width = element.getBoundingClientRect().width
      target.style.setProperty('--back-w', `${width}px`)

      const existingOverlap = window.getComputedStyle(target).getPropertyValue('--overlap').trim()

      if (!existingOverlap) {
        target.style.setProperty('--overlap', `${overlapPx}px`)
      }
    }

    updateMetrics()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateMetrics)
      observer.observe(element)

      return () => {
        observer.disconnect()
      }
    }

    const handleResize = () => updateMetrics()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [computedLabel, overlapPx])

  const classes = [
    'group relative z-50 inline-flex items-center gap-2 pointer-events-auto',
    // ≥44px tap target without shifting layout
    'px-3 py-2 -mx-3 -my-2 rounded-lg',
    'text-sm font-medium text-sky-300 transition-colors hover:text-sky-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link
      ref={linkRef}
      href={computedHref}
      aria-label={computedLabel}
      className={classes}
      onClick={handleClick}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      {...debugAttributes}
    >
      <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">
        ←
      </span>
      <span>{computedLabel}</span>
    </Link>
  )
}
