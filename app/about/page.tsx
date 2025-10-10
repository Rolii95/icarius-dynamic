import type { Metadata } from 'next'

import { Section } from '@/components/Section'
import { PageHeader } from '@/components/PageHeader'

const title = 'About Icarius Consulting | HR technology specialists'
const description =
  'Meet the HRIT advisors who combine enterprise-scale delivery experience with boutique pace to land HR technology change that sticks.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    title,
    description,
    url: '/about',
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

export default function AboutPage() {
  return (
    <Section className="py-16" style={{ minHeight: '400px' }}>
      <PageHeader
        title="About Icarius Consulting"
        headingClassName="text-4xl font-semibold tracking-tight heading-underline"
        contentClassName="max-w-3xl space-y-6"
      >
        <p className="text-lg text-slate-300">
          Icarius Consulting partners with product, design, and engineering leaders to ship roadmap commitments without the usual enterprise drag. We pair enterprise-scale experience with boutique pace so teams deliver what customers actually need.
        </p>
        <p className="text-slate-300">
          Our leads have scaled platforms, reworked onboarding, and launched AI assistants across regulated industries. The playbooks cover vendor orchestration, experimentation, and measurement so stakeholders stay confident in every milestone.
        </p>
        <p className="text-slate-300">
          We embed alongside your team, co-own ceremonies, and leave behind operating models that keep momentum compounding. Launches stick, teams stay calm, and your roadmap keeps moving after we step away.
        </p>
      </PageHeader>
    </Section>
  )
}
