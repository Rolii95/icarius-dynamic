import { siteOrigin } from '@/lib/config/site'

import { POSTS } from '../posts'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const buildFeed = () => {
  const items = POSTS.map((post) => {
    const postUrl = `${siteOrigin}/blog/${post.slug}`
    const pubDate = new Date(post.date).toUTCString()

    return `    <item>\n` +
      `      <title>${escapeXml(post.title)}</title>\n` +
      `      <link>${postUrl}</link>\n` +
      `      <guid>${postUrl}</guid>\n` +
      `      <description>${escapeXml(post.summary)}</description>\n` +
      `      <pubDate>${pubDate}</pubDate>\n` +
      `    </item>`
  }).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>Icarius Blog</title>',
    `    <link>${siteOrigin}/blog</link>`,
    '    <description>Latest posts from the Icarius blog.</description>',
    '    <language>en-US</language>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter(Boolean)
    .join('\n')
}

export const GET = async () => {
  const feed = buildFeed()

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
