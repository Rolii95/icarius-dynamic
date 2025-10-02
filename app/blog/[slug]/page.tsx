import type { ComponentType } from 'react'
import fs from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'

interface BlogPageProps {
  params: {
    slug: string
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

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = params

  let Post: ComponentType

  try {
    Post = (await import(`@/content/posts/${slug}.mdx`)).default
  } catch (error) {
    const missingModuleByCode =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND'
    const missingModuleByMessage =
      error instanceof Error && error.message.includes('Cannot find module')
    const isMissingModule = missingModuleByCode || missingModuleByMessage

    if (isMissingModule) {
      notFound()
    }

    throw error
  }

  return (
    <article className="prose prose-invert mx-auto">
      <Post />
    </article>
  )
}
