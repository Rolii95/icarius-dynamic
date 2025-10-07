import type { Metadata } from 'next'

import Link from 'next/link'

import { CASE_STUDIES } from '@/app/work/case-studies'
import { Section } from '@/components/Section'
import { ConditionalGoBackButton } from '@/components/ConditionalGoBackButton'

const title = 'HRIT advisory HR systems audit HR AI PMO packages catalog'
const description =
  'Compare HRIT advisory retainers, HR systems audit sprints, HR AI readiness labs, and PMO accelerators designed to balance rapid value with long-term governance.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/packages' },
  openGraph: {
    title,
    description,
    url: '/packages',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/twitter-image', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

const packages = [
  {
    name: 'Diagnostic sprint',
    summary:
      'A three-week assessment that surfaces quick wins, risks, and a prioritised roadmap for change.',
    relatedCaseStudies: ['payroll-consolidation'],
  },
  {
    name: 'Transformation partner',
    summary:
      'Embedded leadership across delivery squads to guide major platform or process rollouts.',
    relatedCaseStudies: ['global-hcm-replacement'],
  },
  {
    name: 'Fractional operator',
    summary:
      'Part-time executive support to keep initiatives moving while you hire permanent leadership.',
    relatedCaseStudies: ['hr-ops-ai-assistant'],
  },
]

export default function PackagesPage() {
  const caseStudyMap = new Map(CASE_STUDIES.map((study) => [study.slug, study]))

  return (
    <Section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-6 flex items-center gap-2">
          <ConditionalGoBackButton />
          <h1 className="min-w-0 text-4xl font-semibold tracking-tight">Packages</h1>
        </div>
        <div className="space-y-10">
          <header className="space-y-4">
            <p className="text-lg text-slate-300">
              These outlines show how we typically partner with clients. Every package can be adjusted
              to match your stage, geography, and team structure.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((offer) => (
              <article
                key={offer.name}
                className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
              >
                <h2 className="text-2xl font-semibold text-white">{offer.name}</h2>
                <p className="mt-4 text-sm text-slate-300">{offer.summary}</p>
                <div className="mt-6 space-y-2 text-sm">
                  {offer.relatedCaseStudies?.map((slug) => {
                    const study = caseStudyMap.get(slug)

                    if (!study) return null

                    return (
                      <p key={slug} className="text-slate-400">
                        See how we applied this package in{' '}
                        <Link
                          href={`/work/${slug}`}
                          className="font-medium text-sky-300 transition hover:text-sky-200"
                        >
                          {study.title}
                        </Link>{' '}
                        — {study.resultsSummary}
                      </p>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
