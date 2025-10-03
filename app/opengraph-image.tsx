import { createOgImage, OG_IMAGE_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_IMAGE_SIZE
export const alt = 'Icarius Consulting — HRIT Advisory & Delivery'

export default function Image() {
  return createOgImage()
}
