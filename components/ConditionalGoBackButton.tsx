'use client'

import { usePathname } from 'next/navigation'
import { GoBackButton } from '@/components/GoBackButton'

export function ConditionalGoBackButton({ className }: { className?: string }) {
  const pathname = usePathname()

  // Show Go back button on all pages except:
  // - Homepage (/)
  // - Nested subpages (e.g., /services/[slug], /work/[slug], /blog/[slug])
  const shouldShowGoBack = pathname !== '/' && !pathname.match(/\/[^/]+\/[^/]+/)

  if (!shouldShowGoBack) {
    return null
  }

  return <GoBackButton className={className} />
}
