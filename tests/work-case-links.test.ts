import React from 'react'
import { describe, expect, it } from 'vitest'

import CaseStudyPage from '../app/work/[slug]/page'
import { CASE_STUDIES } from '../app/work/case-studies'

// Ensure JSX runtime is available when rendering server components in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).React = React

describe('Work case study links', () => {
  it('renders every work card destination without throwing', () => {
    CASE_STUDIES.forEach((study) => {
      expect(() => {
        const result = CaseStudyPage({ params: { slug: study.slug } })
        expect(result).toBeTruthy()
      }).not.toThrow()
    })
  })
})
