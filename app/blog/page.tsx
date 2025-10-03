import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'

import { Section } from '@/components/Section'

export const metadata: Metadata = {
  title: 'Insights — Icarius Consulting',
  description: 'Browse articles and updates from the Icarius Consulting team.',
  alternates: { canonical: '/blog' },
}

export default async function BlogIndex(){
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
