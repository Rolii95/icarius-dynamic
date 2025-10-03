import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Section } from '@/components/Section'

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

export default async function BlogIndex() {
  const dir = path.join(process.cwd(), 'content', 'posts')
  const files = (await fs.readdir(dir)).filter(f => f.endsWith('.mdx'))
  return (
    <Section className="py-12">
      <h1 className="text-3xl font-semibold">Insights</h1>
      <ul className="mt-4 grid gap-3">
        {files.map(f => {
          const slug = f.replace(/\.mdx$/, '')
          return <li key={slug}><Link className="mini-link" href={`/blog/${slug}`}>{slug.replace(/-/g,' ')}</Link></li>
        })}
      </ul>
    </Section>
  )
}
