import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { CASE_STUDIES } from '../case-studies'
import { Section } from '@/components/Section'

type Params = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }))
}

export function generateMetadata({ params }: Params): Metadata {
  const study = CASE_STUDIES.find((item) => item.slug === params.slug)

  if (!study) {
    return {
      title: 'Case study — Icarius Consulting',
      description: 'Explore case studies from the Icarius Consulting team.',
      alternates: {
        canonical: `/work/${params.slug}`,
      },
      openGraph: {
        title: 'Case study — Icarius Consulting',
        description: 'Explore case studies from the Icarius Consulting team.',
        url: `/work/${params.slug}`,
        images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Case study — Icarius Consulting',
        description: 'Explore case studies from the Icarius Consulting team.',
        images: [{ url: '/twitter-image', width: 1200, height: 630 }],
      },
      robots: { index: true, follow: true },
    }
  }

  return {
    title: study.seoTitle,
    description: study.seoDescription,
    alternates: {
      canonical: `/work/${study.slug}`,
    },
    openGraph: {
      title: study.seoTitle,
      description: study.seoDescription,
      url: `/work/${study.slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: study.seoTitle,
      description: study.seoDescription,
      images: [{ url: '/twitter-image', width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  }
}

export default function CaseStudyPage({ params }: Params) {
  const study = CASE_STUDIES.find((item) => item.slug === params.slug)

  if (!study) {
    notFound()
  }

  const snapshot = [
    { label: 'Client', value: study.overview.client },
    { label: 'Industry', value: study.overview.industry },
    { label: 'Geography', value: study.overview.geography },
    { label: 'Timeframe', value: study.overview.timeframe },
    { label: 'Services', value: study.overview.services.join(', ') },
  ]

  return (
    <article className="py-16">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <Link
          href="/work"
          className="inline-flex items-center text-sm font-medium text-sky-300 transition hover:text-sky-200"
        >
          <span aria-hidden className="mr-2">←</span>
          Back to work
        </Link>

        <header className="mt-8 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/80">{study.hero.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">{study.hero.title}</h1>
          <p className="text-lg text-slate-300">{study.hero.description}</p>
        </header>

        <Section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-950/40 p-6">
            <h2 className="text-base font-semibold text-white">Project snapshot</h2>
            <dl className="mt-4 text-sm text-slate-300">
              {snapshot.map((item, index) => (
                <Fragment key={item.label}>
                  <dt
                    className={`text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 ${index !== 0 ? 'mt-4' : ''}`}
                  >
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-white">{item.value}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
          <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-950/40 p-6">
            <h2 className="text-base font-semibold text-white">Headline outcomes</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {study.outcomes.map((outcome) => (
                <li key={outcome.label} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{outcome.label}</div>
                  <div className="mt-2 text-xl font-semibold text-white">{outcome.value}</div>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section className="mt-12 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold text-white">The challenge</h2>
            <ul className="mt-4 space-y-3 text-base text-slate-300">
              {study.challenge.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-sky-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Our approach</h2>
            <div className="mt-4 space-y-6">
              {study.approach.map((item) => (
                <div key={item.heading} className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-950/40 p-6">
                  <h3 className="text-lg font-semibold text-white">{item.heading}</h3>
                  <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {study.testimonial ? (
          <Section className="mt-12 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-900/50 p-8">
            <blockquote className="text-xl font-medium text-white">“{study.testimonial.quote}”</blockquote>
            <p className="mt-4 text-sm text-slate-300">
              — {study.testimonial.person}, {study.testimonial.role}
            </p>
          </Section>
        ) : null}
      </div>
    </article>
  )
}
