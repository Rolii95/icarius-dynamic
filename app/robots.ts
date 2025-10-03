import type { MetadataRoute } from 'next'

const FALLBACK_SITE_URL = 'https://www.icarius-consulting.com'

function resolveSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL
  const normalisedInput = configuredSiteUrl.endsWith('/')
    ? configuredSiteUrl.slice(0, -1)
    : configuredSiteUrl

  try {
    return new URL(normalisedInput).origin
  } catch {
    try {
      return new URL(`https://${normalisedInput}`).origin
    } catch {
      return FALLBACK_SITE_URL
    }
  }
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
