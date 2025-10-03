import type { MetadataRoute } from 'next'
import fs from 'fs/promises'
import path from 'path'

import { CASE_STUDIES } from './work/case-studies'

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

async function getBlogPostSlugs() {
  const postsDir = path.join(process.cwd(), 'content/posts')

  try {
    const entries = await fs.readdir(postsDir)

    return entries
      .filter((entry) => entry.endsWith('.mdx'))
      .map((entry) => entry.replace(/\.mdx$/, ''))
      .sort()
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
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const blogPostRoutes = (await getBlogPostSlugs()).map((slug) => `/blog/${slug}`)

  return [...staticRoutes, ...caseStudyRoutes, ...blogPostRoutes].map((route) => ({
    url: route === '/' ? siteUrl : `${siteUrl}${route}`,
  }))
}
