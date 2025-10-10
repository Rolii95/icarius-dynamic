import type { Metadata } from 'next'

import Link from 'next/link'

import { CASE_STUDIES } from '@/app/work/case-studies'
import { Section } from '@/components/Section'
import { PageHeader } from '@/components/PageHeader'

const title = 'HR technology services that land change | Icarius Consulting'
const description =
  'Explore HRIT advisory, programme leadership, audits, and AI enablement designed to move metrics faster while building internal confidence.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services' },
  openGraph: {
    title,
    description,
    url: '/services',
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

const services = [
  {
    title: 'HRIS Strategy & Roadmap',
    description: 'Right-size your HR stack and sequence change.',
    featuredCaseStudies: ['global-hcm-replacement'],
  },
  {
    title: 'AI Enablement for HR',
    description: 'Identify use-cases, pilots and guardrails; deploy safe HR copilots.',
    featuredCaseStudies: ['hr-ops-ai-assistant'],
  },
  {
    title: 'People Analytics & Reporting',
    description: 'Automate metrics and compliance; move from spreadsheets to self-serve.',
    featuredCaseStudies: ['hr-ops-ai-assistant'],
  },
  {
    title: 'Payroll & Time Stabilisation',
    description: 'Reduce errors and rework; meet payroll SLAs.',
    featuredCaseStudies: ['payroll-consolidation'],
  },
  {
    title: 'Integration Architecture',
    description: 'Design robust flows across HR, payroll, finance and IT.',
    featuredCaseStudies: ['global-hcm-replacement', 'payroll-consolidation'],
  },
  {
    title: 'Employee Experience & Service Delivery',
    description: 'Simplify journeys—onboarding, absence, helpdesk.',
    featuredCaseStudies: ['hr-ops-ai-assistant'],
  },
]

export default function ServicesPage() {
  const caseStudyMap = new Map(CASE_STUDIES.map((study) => [study.slug, study]))

  return (
    <Section className="py-16" style={{ minHeight: '600px' }}>
      <PageHeader
        title="What you get"
        className="mb-10"
        headingClassName="text-4xl font-semibold tracking-tight heading-underline"
        contentClassName="max-w-3xl space-y-4"
        backHref="/"
        backLabel="Back to home"
      >
        <ul className="text-lg text-slate-300 space-y-2">
          <li>Clear HRIS plan in week one</li>
          <li>Prototypes/pilots that answer the question</li>
          <li>Stabilised payroll & integrations</li>
          <li>Self-serve analytics your HR team trusts</li>
        </ul>
      </PageHeader>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="space-y-10">
          <dl className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="rounded-xl border border-slate-800 bg-slate-950/40 p-6">
                <dt className="text-xl font-medium text-white">{service.title}</dt>
                <dd className="mt-3 text-sm text-slate-300">{service.description}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h2 className="text-2xl font-semibold text-white">Related case studies</h2>
            <p className="text-sm text-slate-300">
              Explore how these engagements brought each service pillar to life with measurable outcomes.
            </p>
            <div className="space-y-6">
              {services.map((service) => (
                <div key={`${service.title}-related`} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {service.title}
                  </h3>
                  <ul className="space-y-2">
                    {service.featuredCaseStudies?.map((slug) => {
                      const study = caseStudyMap.get(slug)

                      if (!study) return null

                      return (
                        <li key={slug}>
                          <Link
                            href={`/work/${slug}`}
                            className="inline-flex items-baseline gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200"
                          >
                            <span>{study.title}</span>
                            <span aria-hidden>→</span>
                          </Link>
                          <p className="mt-1 text-xs text-slate-400">{study.resultsSummary}</p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
