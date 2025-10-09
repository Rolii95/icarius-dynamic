import type { ReactNode } from 'react'

import { BackLink } from './BackLink'

type PageHeaderProps = {
  title: ReactNode
  label?: string
  href?: string
  contextualLabel?: boolean
  className?: string
  headingClassName?: string
  contentClassName?: string
  backLinkClassName?: string
  overlapPx?: number
  eyebrow?: ReactNode
  children?: ReactNode
}

export function PageHeader({
  title,
  label,
  href,
  contextualLabel = true,
  className,
  headingClassName,
  contentClassName,
  backLinkClassName,
  overlapPx,
  eyebrow,
  children,
}: PageHeaderProps) {
  const containerClassName = [
    'container relative mx-auto px-4 md:px-6 [--overlap:2px] sm:[--overlap:4px]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const contentClasses = ['mx-auto max-w-4xl space-y-4', contentClassName]
    .filter(Boolean)
    .join(' ')

  const headingClasses = [
    'text-3xl font-semibold tracking-tight text-white sm:text-4xl',
    headingClassName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={containerClassName} data-backlink-container>
      <div className="mx-auto max-w-4xl">
        <div className="relative z-50 mb-4 w-fit isolate pointer-events-auto">
          <BackLink
            label={label}
            href={href}
            contextualLabel={contextualLabel}
            className={backLinkClassName}
            overlapPx={overlapPx}
          />
        </div>
        <div
          className={contentClasses}
          style={{ marginLeft: 'max(calc(var(--back-w, 12ch) - var(--overlap, 4px)), 0px)' }}
        >
          {eyebrow}
          <h1 className={headingClasses}>{title}</h1>
          {children}
        </div>
      </div>
    </header>
  )
}
