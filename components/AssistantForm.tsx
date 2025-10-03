'use client'

import { FormEvent, useMemo, useState } from 'react'

type AssistantFormProps = {
  plan?: string | null
  className?: string
}

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/

export function AssistantForm({ plan, className }: AssistantFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [feedback, setFeedback] = useState('')
  const [status, setStatus] = useState<SubmitState>('idle')

  const isSubmitting = status === 'submitting'
  const computedPlan = useMemo(() => plan ?? undefined, [plan])
  const planLabel = useMemo(() => {
    if (!computedPlan) {
      return null
    }

    const parts = computedPlan.split(/[-_\s]+/g).filter(Boolean)
    if (parts.length === 0) {
      return computedPlan
    }

    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }, [computedPlan])

  const validate = (): FieldErrors => {
    const currentErrors: FieldErrors = {}

    if (!name.trim()) {
      currentErrors.name = 'Name is required.'
    }

    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      currentErrors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      currentErrors.email = 'Enter a valid email address.'
    }

    if (!message.trim()) {
      currentErrors.message = 'Message is required.'
    }

    return currentErrors
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setCompany('')
    setMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setStatus('idle')
    setFeedback('')

    const fieldErrors = validate()
    setErrors(fieldErrors)

    if (Object.keys(fieldErrors).length > 0) {
      setStatus('error')
      setFeedback('Please fix the errors in the form and try again.')
      return
    }

    setStatus('submitting')
    setFeedback('Sending your message…')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company: company.trim() ? company.trim() : undefined,
          plan: computedPlan,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const firstError = Array.isArray(payload.errors) ? payload.errors[0] : null
        const messageText =
          (typeof firstError?.message === 'string' && firstError.message) ||
          (typeof payload.error === 'string' ? payload.error : 'Something went wrong. Please try again later.')

        setStatus('error')
        setFeedback(messageText)
        return
      }

      setStatus('success')
      setFeedback('Thanks! We will be in touch shortly.')
      setErrors({})
      resetForm()
    } catch (error) {
      console.error('Failed to submit contact form', error)
      setStatus('error')
      setFeedback('Something went wrong. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="grid gap-4">
        {planLabel && (
          <p className="text-sm text-slate-300">Interested in the <strong>{planLabel}</strong> plan.</p>
        )}

        <label className="grid gap-1 text-left text-sm">
          <span className="text-slate-200">Name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'assistant-form-name-error' : undefined}
            className="rounded-md border border-[rgba(255,255,255,.12)] bg-transparent px-3 py-2"
            required
          />
          {errors.name && (
            <span id="assistant-form-name-error" className="text-xs text-red-400">
              {errors.name}
            </span>
          )}
        </label>

        <label className="grid gap-1 text-left text-sm">
          <span className="text-slate-200">Email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'assistant-form-email-error' : undefined}
            className="rounded-md border border-[rgba(255,255,255,.12)] bg-transparent px-3 py-2"
            required
          />
          {errors.email && (
            <span id="assistant-form-email-error" className="text-xs text-red-400">
              {errors.email}
            </span>
          )}
        </label>

        <label className="grid gap-1 text-left text-sm">
          <span className="text-slate-200">Company (optional)</span>
          <input
            type="text"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="rounded-md border border-[rgba(255,255,255,.12)] bg-transparent px-3 py-2"
          />
        </label>

        <label className="grid gap-1 text-left text-sm">
          <span className="text-slate-200">Message</span>
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'assistant-form-message-error' : undefined}
            className="min-h-[120px] resize-y rounded-md border border-[rgba(255,255,255,.12)] bg-transparent px-3 py-2"
            required
          />
          {errors.message && (
            <span id="assistant-form-message-error" className="text-xs text-red-400">
              {errors.message}
            </span>
          )}
        </label>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className="rounded-full bg-[color:var(--primary)] px-5 py-2 font-medium text-slate-900 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        </div>

        <p aria-live="polite" role="status" className="text-sm text-slate-200">
          {feedback}
        </p>
      </div>
    </form>
  )
}
