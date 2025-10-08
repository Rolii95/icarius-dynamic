import { describe, expect, it } from 'vitest'

import { __BACKLINK_INTERNALS__ } from '../components/BackLink'

const computeDefaults = (path: string) => {
  const section = __BACKLINK_INTERNALS__.getSectionFromPath(path)
  const label = __BACKLINK_INTERNALS__.SECTION_LABELS[section] ?? 'Back'
  const href = __BACKLINK_INTERNALS__.SECTION_FALLBACKS[section] ?? '/'

  return { label, href }
}

describe('BackLink defaults', () => {
  it('returns home label and href for contact page', () => {
    const defaults = computeDefaults('/contact')

    expect(defaults.label).toBe('Back to home')
    expect(defaults.href).toBe('/')
  })

  it('returns home label and href for about page', () => {
    const defaults = computeDefaults('/about')

    expect(defaults.label).toBe('Back to home')
    expect(defaults.href).toBe('/')
  })

  it('uses work context for nested work entries', () => {
    const defaults = computeDefaults('/work/sample-case')

    expect(defaults.label).toBe('Back to work')
    expect(defaults.href).toBe('/work')
  })
})
