import type { Metadata } from 'next'

import Link from 'next/link'

import { CASE_STUDIES } from '@/app/work/case-studies'
import { Section } from '@/components/Section'
import { ConditionalGoBackButton } from '@/components/ConditionalGoBackButton'

const title = 'HRIT advisory HR systems audit HR AI PMO services playbooks'
const description =
  'Explore HRIT advisory roadmaps, HR systems audit accelerators, HR AI experiments, and PMO toolkits aligning teams and platforms around measurable outcomes.'

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
    title: 'Operating model design',
    description:
      'Align roles, systems, and processes around the outcomes that matter most so teams can scale',
    featuredCaseStudies: ['global-hcm-replacement', 'payroll-consolidation'],
  },
  {
    title: 'Platform implementation leadership',
    description:
      'Navigate ERP, HRIS, or billing deployments with a partner who has led global rollouts before.',
    featuredCaseStudies: ['global-hcm-replacement'],
  },
  {
    title: 'Process optimisation sprints',
    description:
      'Identify waste, codify best practices, and automate the manual steps that slow delivery.',
    featuredCaseStudies: ['payroll-consolidation'],
  },
  {
    title: 'Fractional operations support',
    description:
      'Bridge leadership gaps or accelerate change with an embedded, outcomes-focused operator.',
    featuredCaseStudies: ['hr-ops-ai-assistant'],
  },
]

export default function ServicesPage() {
  const caseStudyMap = new Map(CASE_STUDIES.map((study) => [study.slug, study]))

  return (
    <Section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <ConditionalGoBackButton />
        <div className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Services</h1>
            <p className="text-lg text-slate-300">
              Each engagement is tailored to your stage of growth, but the pillars below outline how
              we typically help founders and operators remove operational friction.
            </p>
          </header>
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
              Explore how these engagements brought each service pillar to life.
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
