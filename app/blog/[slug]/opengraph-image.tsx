import { createBlogOgImage } from '@/lib/blog-og-image'
import { OG_IMAGE_SIZE } from '@/lib/og-image'

import { POSTS } from '../posts'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const alt = 'Icarius Insights blog article artwork'
export const contentType = 'image/png'

type OgImageProps = {
  params: {
    slug: string
  }
}

export default function Image({ params }: OgImageProps) {
  const slug = params.slug
  const post = POSTS.find(entry => entry.slug === slug)

  const title = post?.title ?? 'Icarius Insights'
  const tagline = post?.tags?.length
    ? post.tags.join(' • ')
    : 'HR transformation perspectives from Icarius Consulting'

  return createBlogOgImage({ title, tagline })
}
