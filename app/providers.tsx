'use client'

import { useEffect } from 'react'

function observeSections() {
  const observed = new Set<Element>()
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Use more relaxed threshold on mobile to prevent jank
  const isMobile = window.innerWidth < 768
  
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          // Once element is in view, stop observing to reduce overhead
          if (prefersReducedMotion || isMobile) {
            intersectionObserver.unobserve(entry.target)
          }
        } else {
          entry.target.classList.remove('in-view')
        }
      })
    },
    {
      // Larger root margin on mobile to trigger earlier and reduce jank
      rootMargin: isMobile ? '50px 0px -5% 0px' : '0px 0px -10% 0px',
      threshold: isMobile ? 0.05 : 0.1,
    }
  )

  const register = () => {
    document.querySelectorAll('.observe').forEach((element) => {
      if (!observed.has(element)) {
        observed.add(element)
        intersectionObserver.observe(element)
      }
    })
  }

  register()

  const mutationObserver = new MutationObserver(() => {
    register()
  })

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })

  return () => {
    mutationObserver.disconnect()
    observed.forEach((element) => intersectionObserver.unobserve(element))
    intersectionObserver.disconnect()
  }
}

export function ViewObserver() {
  useEffect(() => {
    return observeSections()
  }, [])

  return null
}
