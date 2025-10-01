import type { Metadata } from 'next'
export async function generateStaticParams(){ return [] }
export default async function BlogPost({ params }: { params: { slug: string }}){ const MDX = (await import(`@/content/posts/${params.slug}.mdx`)).default; return (<article className="prose max-w-none"><MDX /></article>) }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata>{ return { title: params.slug.replace(/-/g,' ') + ' — Icarius Insights' } }
