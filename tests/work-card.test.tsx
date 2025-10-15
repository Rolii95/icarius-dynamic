import React, { type ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { WorkCard } from '@/components/WorkCard'
import type { CaseStudy } from '@/app/work/case-studies'

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const baseStudy: CaseStudy = {
  slug: 'example-case',
  title: 'Example Case',
  summary: 'Summary copy',
  resultsSummary: 'Results summary copy',
  seoTitle: 'Example Case SEO Title',
  seoDescription: 'Example Case SEO Description',
  hero: {
    eyebrow: 'Eyebrow',
    title: 'Hero Title',
    description: 'Hero description copy.',
  },
  overview: {
    client: 'Client',
    industry: 'Industry',
    geography: 'Global',
    timeframe: '6 weeks',
    services: ['Advisory'],
  },
  challenge: ['Challenge one'],
  approach: [{ heading: 'Approach', description: 'Approach description.' }],
  outcomes: [{ label: 'Outcome', value: 'Value' }],
}

const createStudy = (meta?: CaseStudy['meta']): CaseStudy => ({
  ...baseStudy,
  challenge: [...baseStudy.challenge],
  approach: baseStudy.approach.map((item) => ({ ...item })),
  outcomes: baseStudy.outcomes.map((item) => ({ ...item })),
  meta,
})

describe('WorkCard', () => {
  it('renders reading time when provided', () => {
    const study = createStudy({ label: 'Case study', readingTime: 5 })

    render(<WorkCard study={study} />)

    expect(screen.getByText('5 min read')).toBeInTheDocument()
    expect(screen.getByLabelText('5 minutes read')).toBeInTheDocument()
  })

  it('omits reading time when data missing', () => {
    const study = createStudy(undefined)

    expect(study.meta?.readingTime).toBeUndefined()
    render(<WorkCard study={study} />)

    expect(screen.queryByText(/min read/i)).toBeNull()
  })
})
