import type { MetadataRoute } from 'next'

import { resolveSiteOrigin } from '@/lib/config/site'

import { CASE_STUDIES } from './work/case-studies'
import { POSTS } from './blog/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteOrigin()

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
  const blogPostRoutes = POSTS.map(({ slug }) => `/blog/${slug}`)

  return [...staticRoutes, ...caseStudyRoutes, ...blogPostRoutes].map((route) => ({
    url: route === '/' ? siteUrl : `${siteUrl}${route}`,
  }))
}
