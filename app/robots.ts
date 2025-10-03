import type { MetadataRoute } from 'next'

import { resolveSiteOrigin } from '@/lib/config/site'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteOrigin()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
