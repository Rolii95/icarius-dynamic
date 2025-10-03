import { afterEach, describe, expect, it, vi } from 'vitest'

const setEnv = (value: string | undefined) => {
  if (typeof value === 'string') {
    process.env.NEXT_PUBLIC_SITE_URL = value
  } else {
    delete process.env.NEXT_PUBLIC_SITE_URL
  }
}

describe('resolveSiteOrigin', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL

  afterEach(() => {
    setEnv(originalEnv)
    vi.resetModules()
  })

  it('normalizes the configured site URL when present', async () => {
    vi.resetModules()
    setEnv('https://example.com/')

    const { resolveSiteOrigin } = await import('./site')

    expect(resolveSiteOrigin()).toBe('https://example.com')
  })

  it('derives an origin when the scheme is omitted', async () => {
    vi.resetModules()
    setEnv('example.com/blog')

    const { resolveSiteOrigin } = await import('./site')

    expect(resolveSiteOrigin()).toBe('https://example.com')
  })

  it('falls back to the default when the env value is empty', async () => {
    vi.resetModules()
    setEnv('   ')

    const { defaultSiteUrl, resolveSiteOrigin } = await import('./site')

    expect(resolveSiteOrigin()).toBe(defaultSiteUrl)
  })

  it('falls back to the default when the env value is invalid', async () => {
    vi.resetModules()
    setEnv('http://exa mple.com')

    const { defaultSiteUrl, resolveSiteOrigin } = await import('./site')

    expect(resolveSiteOrigin()).toBe(defaultSiteUrl)
  })

  it('exposes a shared siteOrigin constant', async () => {
    vi.resetModules()
    setEnv('https://shared.example/')

    const { resolveSiteOrigin, siteOrigin } = await import('./site')

    expect(siteOrigin).toBe('https://shared.example')
    expect(siteOrigin).toBe(resolveSiteOrigin())
  })
})
