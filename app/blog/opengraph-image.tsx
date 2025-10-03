import { createBlogOgImage } from '@/lib/blog-og-image'
import { OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const alt = 'Icarius Insights — Icarius Consulting blog overview'
export const contentType = 'image/png'

export default function Image() {
  return createBlogOgImage({
    title: 'Icarius Insights',
    tagline: 'HR transformation, delivery, and AI guidance from Icarius Consulting',
  })
}
