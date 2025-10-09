import type { Metadata } from 'next'

import Link from 'next/link'

import { CASE_STUDIES } from '@/app/work/case-studies'
import { Section } from '@/components/Section'
import { PageHeader } from '@/components/PageHeader'

const title = 'HR technology consulting packages | Icarius Consulting'
const description =
  'Compare diagnostic sprints, programme leadership, and fractional support designed to unlock HR technology outcomes quickly and sustainably.'

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
      'Three-week assessment that quantifies risk, value, and priority backlog so leadership can decide fast.',
    relatedCaseStudies: ['payroll-consolidation'],
  },
  {
    name: 'Transformation partner',
    summary:
      'Embedded programme leadership to establish cadence, unblock vendors, and keep stakeholders aligned.',
    relatedCaseStudies: ['global-hcm-replacement'],
  },
  {
    name: 'Fractional operator',
    summary:
      'Part-time senior operator who stabilises change, mentors leads, and leaves a playbook behind.',
    relatedCaseStudies: ['hr-ops-ai-assistant'],
  },
]

export default function PackagesPage() {
  const caseStudyMap = new Map(CASE_STUDIES.map((study) => [study.slug, study]))

  return (
    <Section className="py-16" style={{ minHeight: '500px' }}>
      <PageHeader
        title="Packages"
        className="mb-10"
        headingClassName="text-4xl font-semibold tracking-tight heading-underline"
        contentClassName="max-w-3xl space-y-4"
        backHref="/"
        backLabel="Back to home"
      >
        <p className="text-lg text-slate-300">
          Choose the level of partnership you need—from rapid assessment through to embedded transformation leadership.
          Every package flexes to your geography, team structure, and internal capacity.
        </p>
      </PageHeader>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((offer) => (
            <article
              key={offer.name}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/40 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
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
    </Section>
  )
}
