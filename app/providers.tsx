'use client'

import { useEffect } from 'react'

function observeSections() {
  const observed = new Set<Element>()
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        } else {
          entry.target.classList.remove('in-view')
        }
      })
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
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
