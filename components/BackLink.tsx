'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type BackLinkProps = {
  label?: string
  href?: string
  contextualLabel?: boolean
  className?: string
  overlapPx?: number
}

type SectionKey = keyof typeof SECTION_LABELS

type ReferrerState = {
  sameOrigin: boolean
  path?: string
  section?: SectionKey
}

declare global {
  interface Window {
    __debugEvents?: { type: string; payload: Record<string, unknown> }[]
  }
}

const SECTION_LABELS = {
  work: 'Back to work',
  insights: 'Back to insights',
  packages: 'Back to packages',
  services: 'Back to services',
  contact: 'Back to contact',
  about: 'Back to about',
} as const

const SECTION_ALIASES: Record<string, SectionKey> = {
  blog: 'insights',
  'case-studies': 'work',
}

const DEFAULT_LABEL = SECTION_LABELS.work
const DEFAULT_HREF = '/work'

function normaliseSection(segment: string | undefined): SectionKey | undefined {
  if (!segment) {
    return undefined
  }

  const cleaned = segment.replace(/^\//, '').split('/').filter(Boolean)[0]
  if (!cleaned) {
    return undefined
  }

  if (cleaned in SECTION_ALIASES) {
    return SECTION_ALIASES[cleaned]
  }

  if (cleaned in SECTION_LABELS) {
    return cleaned as SectionKey
  }

  return undefined
}

export function BackLink({
  label,
  href = DEFAULT_HREF,
  contextualLabel = true,
  className,
  overlapPx = 4,
}: BackLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const [referrer, setReferrer] = useState<ReferrerState>({ sameOrigin: false })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.__debugEvents = window.__debugEvents ?? []
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const ref = document.referrer

    if (!ref) {
      setReferrer({ sameOrigin: false })
      return
    }

    try {
      const refUrl = new URL(ref)
      const sameOrigin = refUrl.origin === window.location.origin

      if (sameOrigin) {
        const section = normaliseSection(refUrl.pathname)
        setReferrer({ sameOrigin: true, path: refUrl.pathname, section })
      } else {
        setReferrer({ sameOrigin: false })
      }
    } catch {
      setReferrer({ sameOrigin: false })
    }
  }, [pathname])

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
      const observer = new ResizeObserver(() => updateMetrics())
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
  }, [overlapPx])

  const currentSection = useMemo(() => normaliseSection(pathname), [pathname])

  const computedLabel = useMemo(() => {
    if (label) {
      return label
    }

    if (contextualLabel) {
      const section = referrer.sameOrigin && referrer.section ? referrer.section : currentSection
      if (section && SECTION_LABELS[section]) {
        return SECTION_LABELS[section]
      }
    }

    return DEFAULT_LABEL
  }, [label, contextualLabel, referrer, currentSection])

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (typeof window !== 'undefined') {
        const fromPath = window.location.pathname
        const targetPath = referrer.sameOrigin && referrer.path ? referrer.path : href

        window.__debugEvents = window.__debugEvents ?? []
        window.__debugEvents.push({ type: 'BackLinkClick', payload: { path: targetPath, from: fromPath } })
      }

      if (referrer.sameOrigin) {
        event.preventDefault()
        router.back()
      }
    },
    [href, referrer, router],
  )

  const classes = [
    'inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/60',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link ref={linkRef} href={href} onClick={handleClick} aria-label={computedLabel} className={classes}>
      <span aria-hidden="true">←</span>
      <span>{computedLabel}</span>
    </Link>
  )
}
