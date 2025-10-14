import type { Metadata } from 'next'

import Link from 'next/link'

import servicesData from '@/data/services.json'

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

type Service = {
  id: string
  title: string
  oneLiner: string
  bullets?: string[]
  chips: string
  featuredCaseStudies?: string[]
}

const services = servicesData as Service[]
const whatYouGet = Array.from(
  new Set(
    services
      .flatMap((service) => service.bullets ?? [])
      .filter((bullet): bullet is string => Boolean(bullet?.trim()))
  )
)

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
        {whatYouGet.length > 0 ? (
          <ul
            className="text-lg text-slate-300 space-y-2 list-disc pl-6 marker:text-sky-300"
            aria-label="Key outcomes you can expect"
          >
            {whatYouGet.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </PageHeader>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="space-y-10">
          <div className="grid gap-8 md:grid-cols-2" role="list" aria-label="Services Icarius offers">
            {services.map((service) => (
              <article
                key={service.id}
                aria-labelledby={`service-${service.id}`}
                className="rounded-xl border border-slate-800 bg-slate-950/40 p-6"
                role="listitem"
              >
                <h2 id={`service-${service.id}`} className="text-xl font-medium text-white">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm text-slate-300">{service.oneLiner}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {service.chips}
                </p>
              </article>
            ))}
          </div>

          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h2 className="text-2xl font-semibold text-white">Related case studies</h2>
            <p className="text-sm text-slate-300">
              Explore how these engagements brought each service pillar to life with measurable outcomes.
            </p>
            <div className="space-y-6">
              {services.map((service) => (
                <div key={`${service.id}-related`} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {service.title}
                  </h3>
                  <ul className="space-y-2" aria-label={`Case studies related to ${service.title}`}>
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
