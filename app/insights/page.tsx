import type { Metadata } from 'next'

import { BlogIndex } from '@/app/blog/blog-index'
import { SORTED_POSTS } from '@/app/blog/posts'

const heading = 'Insights for HR technology leaders'
const title = `${heading} | Icarius Consulting`
const description =
  'Playbooks, frameworks, and commentary on delivering HR technology change with measurable impact across HR, payroll, and employee experience.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/insights' },
  openGraph: {
    title,
    description,
    url: '/insights',
    images: [{ url: '/blog/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/blog/opengraph-image', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function InsightsPage() {
  return <BlogIndex posts={SORTED_POSTS} heading={heading} description={description} />
}
