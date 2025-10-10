import type { Metadata } from 'next'
import type { ReactNode } from 'react'


const defaultTitle = 'Insights for HRIT, payroll & AI enablement'
const defaultDescription =
  'See how our HRIS change, payroll stabilisation, analytics, and HR AI playbooks keep transformations focused on measurable impact.'

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: '%s | Icarius Insights',
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: '/blog',
    images: [{ url: '/blog/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: '/blog/opengraph-image', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="prose prose-invert mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  )
}
