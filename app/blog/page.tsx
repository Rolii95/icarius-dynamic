import type { Metadata } from 'next'

import { BlogIndex } from './blog-index'
import { SORTED_POSTS } from './posts'

const title = 'HRIT advisory HR systems audit HR AI PMO insights library'
const description =
  'See how our HRIT advisory strategies, HR systems audit tactics, HR AI adoption, and PMO leadership keep transformations focused on tangible impact.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: {
    title,
    description,
    url: '/blog',
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

export default function BlogPage() {
  return (
    <BlogIndex posts={SORTED_POSTS} heading={title} description={description} />
  )
}
