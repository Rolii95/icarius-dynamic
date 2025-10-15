'use client'

import Image from 'next/image'
import { useCallback, useMemo } from 'react'
import type { MouseEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { track } from '@/lib/analytics'

export type PackageCardProps = {
  id: string
  title: string
  subtitle?: string
  price?: string
  chips?: string
  features?: string[]
  imageSrc?: string
  ctaHref?: string
  ctaLabel?: string
  variant?: 'compact' | 'full'
  className?: string
}

const baseClasses =
  'package-card group relative flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/50 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60 focus-within:border-[color:var(--primary)]/50 lift-card'
const variantPadding: Record<'compact' | 'full', string> = {
  compact: 'p-5 sm:p-6',
  full: 'p-6',
}

const featureLimitByVariant: Record<'compact' | 'full', number | null> = {
  compact: 3,
  full: null,
}

export function PackageCard({
  id,
  title,
  subtitle,
  price,
  chips,
  features = [],
  imageSrc,
  ctaHref,
  ctaLabel,
  variant = 'full',
  className,
}: PackageCardProps) {
  const classes = [baseClasses, variantPadding[variant], className].filter(Boolean).join(' ')

  const featureLimit = featureLimitByVariant[variant]
  const displayedFeatures =
    typeof featureLimit === 'number' ? features.slice(0, featureLimit) : features
  const remainingFeatureCount = features.length - displayedFeatures.length

  const planForTracking = useMemo(() => {
    if (!ctaHref) return id

    try {
      const url = new URL(ctaHref, 'https://example.com')
      return url.searchParams.get('plan') ?? id
    } catch (error) {
      return id
    }
  }, [ctaHref, id])

  const handleCtaClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!ctaHref) return

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

      track('BookCallClick', { cta: 'package-card', plan: planForTracking })
    },
    [ctaHref, planForTracking],
  )

  const ctaClasses = [
    'mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] text-slate-950 shadow-[0_12px_25px_rgba(12,18,30,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(12,18,30,0.45)] focus-visible:outline-[color:var(--primary)]/60',
  ].join(' ')

  return (
    <article role="article" className={classes} data-variant={variant}>
      {imageSrc ? (
        <div className="relative mb-6 overflow-hidden rounded-xl">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={imageSrc}
              alt={`${title} illustration`}
              fill
              className="h-full w-full object-cover"
              sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col">
        <div className="space-y-3">
          <h3 className="package-title text-xl font-semibold text-white">{title}</h3>
          {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
          {chips ? (
            <p className="package-meta text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              {chips}
            </p>
          ) : null}
          {price ? (
            <p className="package-price text-3xl font-bold tracking-tight text-white">{price}</p>
          ) : null}
        </div>

        {displayedFeatures.length > 0 ? (
          <ul className="package-features mt-6 flex flex-col gap-2 text-sm text-slate-300">
            {displayedFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle2 aria-hidden className="h-4 w-4 text-sky-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {remainingFeatureCount > 0 ? (
          <p className="mt-2 text-xs text-slate-400">
            + {remainingFeatureCount} more included
          </p>
        ) : null}

        {ctaHref && ctaLabel ? (
          <a
            role="button"
            className={ctaClasses}
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ctaLabel} for ${title}`}
            data-cta="package-card"
            data-plan={planForTracking}
            onClick={handleCtaClick}
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </article>
  )
}
