import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: {
    slug: string
  }
}

type PostModule = {
  default: ComponentType
  metadata?: {
    title?: string
    description?: string
  }
}

function isModuleNotFound(error: unknown) {
  const missingModuleByCode =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND'
  const missingModuleByMessage =
    error instanceof Error && error.message.includes('Cannot find module')

  return missingModuleByCode || missingModuleByMessage
}

async function loadPostModule(slug: string): Promise<PostModule> {
  try {
    return (await import(`@/content/posts/${slug}.mdx`)) as PostModule
  } catch (error) {
    if (isModuleNotFound(error)) {
      notFound()
    }

    throw error
  }
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content/posts')
  let entries: string[] = []

  try {
    entries = await fs.readdir(postsDir)
  } catch (error) {
    const isMissingDirectory =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'

    if (isMissingDirectory) {
      return []
    }

    throw error
  }

  return entries
    .filter((entry) => entry.endsWith('.mdx'))
    .map((entry) => ({ slug: entry.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const postModule = await loadPostModule(params.slug)
  const metadata = postModule.metadata

  if (!metadata?.title || !metadata?.description) {
    throw new Error(`Missing metadata export for blog post: ${params.slug}`)
  }

  const { title, description } = metadata

  return {
    title,
    description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${params.slug}`,
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
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = params

  const postModule = await loadPostModule(slug)
  const metadata = postModule.metadata

  if (!metadata?.title || !metadata?.description) {
    throw new Error(`Missing metadata export for blog post: ${slug}`)
  }

  const Post = postModule.default

  return (
    <article className="prose prose-invert mx-auto">
      <Post />
    </article>
  )
}
