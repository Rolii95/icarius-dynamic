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
          We specialise in HRIT advisory, AI enablement for HR and digital HR transformation.
        </p>
        <p className="text-slate-300">Small surface, high impact · Show work early · Measure improvements</p>
        <p className="text-slate-300">10+ HR programmes shipped · HRIS & payroll · People analytics · Change management</p>
      </PageHeader>
    </Section>
  )
}
