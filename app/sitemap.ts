import type { MetadataRoute } from 'next'

import { CASE_STUDIES } from './work/case-studies'
import { POSTS } from './blog/posts'

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

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl()

  const staticRoutes = [
    '/',
    '/about',
    '/services',
    '/work',
    '/packages',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
  ]

  const caseStudyRoutes = CASE_STUDIES.map((study) => `/work/${study.slug}`)
  const blogPostRoutes = POSTS.map((post) => `/blog/${post.slug}`)

  return [...staticRoutes, ...caseStudyRoutes, ...blogPostRoutes].map((route) => ({
    url: route === '/' ? siteUrl : `${siteUrl}${route}`,
  }))
}
