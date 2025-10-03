'use client'

import { FormEvent, useState } from 'react'

export type NewsletterFormProps = {
  className?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (status === 'loading') {
      return
    }

    setStatus('loading')
    setFeedback(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          (payload && typeof payload.message === 'string' && payload.message) ||
          'Something went wrong. Please try again.'

        setStatus('error')
        setFeedback(message)
        return
      }

      setStatus('success')
      setFeedback(
        (payload && typeof payload.message === 'string' && payload.message) || 'Thanks for subscribing! We will be in touch soon.'
      )
      setEmail('')
    } catch (error) {
      console.error('Failed to submit newsletter form', error)
      setStatus('error')
      setFeedback('Something went wrong. Please try again.')
    }
  }

  const buttonLabel = status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed' : 'Subscribe'
  const disabled = status === 'loading' || status === 'success'

  const formClasses = [
    'flex flex-col gap-3 sm:flex-row sm:items-center',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <form className={formClasses} onSubmit={handleSubmit} noValidate>
      <label className="relative flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-20px_rgba(59,130,246,0.75)] transition hover:shadow-[0_22px_55px_-18px_rgba(14,165,233,0.8)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {buttonLabel}
      </button>
      {feedback && (
        <p
          className={`text-xs ${
            status === 'success'
              ? 'text-emerald-300'
              : status === 'error'
                ? 'text-red-300'
                : 'text-slate-300'
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  )
}
