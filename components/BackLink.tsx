'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

type BackLinkProps = {
  label?: string
  href?: string
  contextualLabel?: boolean
  className?: string
  overlapPx?: number
}

type SectionKey = keyof typeof SECTION_CONFIG

const HOME_LABEL = 'Back to home'
const HOME_HREF = '/'

const SECTION_CONFIG = {
  work: { label: 'Back to work', href: '/work' },
  blog: { label: 'Back to insights', href: '/insights' },
  insights: { label: 'Back to insights', href: '/insights' },
  packages: { label: 'Back to packages', href: '/packages' },
  services: { label: 'Back to services', href: '/services' },
  contact: { label: 'Back to contact', href: '/contact' },
  about: { label: 'Back to about', href: '/about' },
  'case-studies': { label: 'Back to work', href: '/work' },
} as const

const SECTION_ALIASES: Record<string, SectionKey> = {
  'case-studies': 'case-studies',
}

function normaliseSegment(segment: string | undefined): SectionKey | undefined {
  if (!segment) {
    return undefined
  }

  const lower = segment.toLowerCase()

  if (lower in SECTION_CONFIG) {
    return lower as SectionKey
  }

  if (lower in SECTION_ALIASES) {
    return SECTION_ALIASES[lower]
  }

  return undefined
}

export function BackLink({
  label,
  href,
  contextualLabel = true,
  className,
  overlapPx = 4,
}: BackLinkProps) {
  const pathname = usePathname()
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  const segments = useMemo(() => {
    if (!pathname) {
      return []
    }

    return pathname
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.toLowerCase())
  }, [pathname])

  const section = useMemo(() => normaliseSegment(segments[0]), [segments])
  const isDetailRoute = segments.length >= 2

  const contextualTarget = useMemo(() => {
    if (!isDetailRoute || !section) {
      return undefined
    }

    return SECTION_CONFIG[section]
  }, [isDetailRoute, section])

  const computedLabel = useMemo(() => {
    if (label) {
      return label
    }

    if (!contextualLabel) {
      return HOME_LABEL
    }

    if (!isDetailRoute || !contextualTarget) {
      return HOME_LABEL
    }

    return contextualTarget.label
  }, [contextualLabel, contextualTarget, isDetailRoute, label])

  const computedHref = useMemo(() => {
    if (href) {
      return href
    }

    if (!isDetailRoute || !contextualTarget) {
      return HOME_HREF
    }

    return contextualTarget.href
  }, [contextualTarget, href, isDetailRoute])

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
  }, [overlapPx, computedLabel])

  const classes = [
    'inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/60',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link ref={linkRef} href={computedHref} aria-label={computedLabel} className={classes}>
      <span aria-hidden="true">←</span>
      <span>{computedLabel}</span>
    </Link>
  )
}
