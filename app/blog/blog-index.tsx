'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { Section } from '@/components/Section'
import { PageHeader } from '@/components/PageHeader'

import type { Post } from './posts'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

interface BlogIndexProps {
  posts: Post[]
  heading: string
  description: string
}

export function BlogIndex({ posts, heading, description }: BlogIndexProps) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const unique = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => unique.add(tag)))
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [posts])

  const filteredPosts = useMemo(() => {
    const normalizedQuery = normalize(query)

    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags.includes(activeTag)

      if (!normalizedQuery) {
        return matchesTag
      }

      const haystack = normalize(
        `${post.title} ${post.summary} ${post.tags.join(' ')}`,
      )

      return matchesTag && haystack.includes(normalizedQuery)
    })
  }, [posts, query, activeTag])

  return (
    <div className="not-prose">
      <Section className="py-12" style={{ minHeight: '400px' }}>
        <PageHeader
          title={heading}
          className="mb-8 not-prose"
          headingClassName="md:text-4xl"
          contentClassName="max-w-3xl space-y-3"
          backLinkClassName="text-indigo-300 transition hover:text-indigo-200 focus-visible:outline-indigo-300/60"
          eyebrow={
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-300/80">Insights</p>
          }
          href="/"
          label="Back to home"
          contextualLabel={false}
        >
          <p className="text-base text-slate-300 md:text-lg">{description}</p>
        </PageHeader>

        <div className="container mx-auto mt-8 flex flex-col gap-6 px-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex-1 lg:max-w-md">
            <span className="sr-only">Search articles</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by keyword"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-base text-slate-100 shadow-inner outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60"
              type="search"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-400 hover:text-slate-100"
              >
                Clear
              </button>
            ) : null}
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                activeTag === null
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100'
                  : 'border-slate-700 bg-slate-900/40 text-slate-200 hover:border-indigo-400'
              }`}
            >
              All topics
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setActiveTag((current) => (current === tag ? null : tag))
                }
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  activeTag === tag
                    ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100'
                    : 'border-slate-700 bg-slate-900/40 text-slate-200 hover:border-indigo-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="container mx-auto mt-10 grid gap-6 px-4 md:grid-cols-2 md:px-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-indigo-400 hover:bg-slate-900/60"
            >
              <article className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">•</span>
                  <span>{post.tags.join(' / ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>5 min read</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-50 transition group-hover:text-indigo-200">
                  {post.title}
                </h2>
                <p className="flex-1 text-sm text-slate-300 md:text-base">
                  {post.summary}
                </p>
                <span className="text-sm font-medium text-indigo-300 transition group-hover:text-indigo-100">
                  Read more →
                </span>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="container mx-auto mt-10 px-4 text-sm text-slate-400 md:px-6">
            No articles match your filters yet. Try clearing the search or choosing a different topic.
          </p>
        ) : null}
      </Section>
    </div>
  )
}
