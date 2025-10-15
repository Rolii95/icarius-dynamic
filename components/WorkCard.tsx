import Link from 'next/link'

import type { CaseStudy } from '@/app/work/case-studies'

type WorkCardProps = {
  study: CaseStudy
}

function formatReadingTime(readingTime?: number) {
  if (!readingTime || Number.isNaN(readingTime)) {
    return undefined
  }

  const rounded = Math.max(1, Math.round(readingTime))
  const label = `${rounded} minute${rounded === 1 ? '' : 's'} read`

  return { label, text: `${rounded} min read` }
}

export function WorkCard({ study }: WorkCardProps) {
  const readingTime = formatReadingTime(study.meta?.readingTime)

  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex h-full flex-col justify-between rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-950/40 p-6 transition hover:border-slate-500/60 hover:bg-slate-900/50 lift-card"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">{study.hero.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{study.title}</h2>
        <p className="mt-3 text-sm text-slate-300">{study.summary}</p>
        {study.meta ? (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="uppercase tracking-[0.2em]">{study.meta.label}</span>
            {readingTime ? (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className="reading-time normal-case tracking-normal"
                  aria-label={readingTime.label}
                >
                  {readingTime.text}
                </span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex items-center text-sm font-medium text-sky-300">
        <span>View case study</span>
        <span aria-hidden className="ml-2 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  )
}
