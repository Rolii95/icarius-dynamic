'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useDeepLinks() {
  const router = useRouter()

  return useCallback(
    (href: string) => {
      if (!href) {
        return
      }

      if (href.startsWith('http://') || href.startsWith('https://')) {
        window.open(href, '_blank', 'noopener,noreferrer')
        return
      }

      router.push(href)
    },
    [router],
  )
}
