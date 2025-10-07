'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function GoBackButton() {
  const router = useRouter()

  const handleGoBack = () => {
    // Try to go back, but if there's no history, fallback to homepage
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleGoBack()
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoBack}
      onKeyDown={handleKeyDown}
      aria-label="Go back to previous page"
      className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition-all hover:shadow-xl hover:bg-[color:var(--primary-2)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-2)]"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>Go back</span>
    </button>
  )
}
