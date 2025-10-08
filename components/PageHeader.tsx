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
    'container mx-auto px-4 md:px-6 [--overlap:2px] sm:[--overlap:4px]',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const innerClassName = ['mx-auto max-w-4xl space-y-4', contentClassName].filter(Boolean).join(' ')
  const headingClasses = ['text-3xl font-semibold tracking-tight text-white', headingClassName]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={containerClassName} data-backlink-container>
      <div className="mb-2">
        <BackLink
          label={label}
          href={href}
          contextualLabel={contextualLabel}
          className={backLinkClassName}
          overlapPx={overlapPx}
        />
      </div>
      <div className={innerClassName}>
        {eyebrow}
        <h1
          className={headingClasses}
          style={{ marginLeft: 'calc(var(--back-w, 0px) - var(--overlap, 4px))' }}
        >
          {title}
        </h1>
        {children}
      </div>
    </header>
  )
}
