import { promises as fs } from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export async function generateStaticParams(){
  const dir = path.join(process.cwd(), 'content', 'posts')
  const files = (await fs.readdir(dir)).filter(f => f.endsWith('.mdx'))
  return files.map(f => ({ slug: f.replace(/\.mdx$/, '') }))
}

export default async function BlogPost({ params }: { params: { slug: string }}){
  const MDX = (await import(`@/content/posts/${params.slug}.mdx`)).default
  return (
    <article className="prose prose-invert max-w-none">
      <MDX />
    </article>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata>{
  return { title: params.slug.replace(/-/g,' ') + ' — Icarius Insights' }
}
