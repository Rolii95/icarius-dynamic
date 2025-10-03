import React from 'react'

type ArticleJsonLdProps = {
  url: string
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  publisher?: string
  image: string
}

export function ArticleJsonLd({
  url,
  title,
  description,
  datePublished,
  dateModified,
  author,
  publisher = 'Icarius Consulting',
  image,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher,
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
