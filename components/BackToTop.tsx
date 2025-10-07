'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Show button after scrolling past the first viewport height
      setIsVisible(window.scrollY > window.innerHeight)
    }

    // Initial check
    onScroll()

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      scrollToTop()
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Scroll back to top"
      className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-[var(--surface)] shadow-lg backdrop-blur-lg transition-all hover:border-white/30 hover:bg-[var(--primary)] hover:shadow-xl hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-2)]"
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
    </button>
  )
}
