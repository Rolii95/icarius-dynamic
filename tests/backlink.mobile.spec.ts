import { test, expect } from '@playwright/test'
import type { Locator } from '@playwright/test'

const mobileViewport = { width: 390, height: 844 }

async function assertTapTarget(locator: Locator) {
  const box = await locator.boundingBox()
  expect(box).not.toBeNull()
  if (!box) {
    return
  }

  expect(box.height).toBeGreaterThanOrEqual(44)
  expect(box.width).toBeGreaterThanOrEqual(44)
}

test.describe('Mobile BackLink behaviour', () => {
  test.use({ viewport: mobileViewport })

  const listPages = [
    { name: 'services', from: '/', to: '/services', fallbackHref: '/services' },
    { name: 'packages', from: '/', to: '/packages', fallbackHref: '/packages' },
  ] as const

  for (const scenario of listPages) {
    test(`${scenario.name} back link goes back on history navigation`, async ({ page }) => {
      await page.goto(scenario.from)
      await page.goto(scenario.to)

      const backLink = page.locator('[data-back-label]')
      await expect(backLink).toBeVisible()
      await assertTapTarget(backLink)
      await expect(backLink).toHaveAttribute('data-back-href', scenario.fallbackHref)

      await Promise.all([
        page.waitForURL((url) => url.pathname === scenario.from),
        backLink.click(),
      ])
    })

    test(`${scenario.name} back link exposes fallback on direct load`, async ({ page }) => {
      await page.goto(scenario.to)

      const backLink = page.locator('[data-back-label]')
      await expect(backLink).toBeVisible()
      await assertTapTarget(backLink)
      await expect(backLink).toHaveAttribute('href', scenario.fallbackHref)
    })
  }

  const workScenario = {
    from: '/work',
    to: '/work/global-hcm-replacement',
    fallbackHref: '/work',
  } as const

  test('work detail back link returns to listing on mobile', async ({ page }) => {
    await page.goto(workScenario.from)
    await page.goto(workScenario.to)

    const backLink = page.locator('[data-back-label]')
    await expect(backLink).toBeVisible()
    await assertTapTarget(backLink)
    await expect(backLink).toHaveAttribute('data-back-href', workScenario.fallbackHref)

    await Promise.all([
      page.waitForURL((url) => url.pathname === workScenario.from),
      backLink.click(),
    ])
  })

  test('work detail back link falls back when loaded directly', async ({ page }) => {
    await page.goto(workScenario.to)

    const backLink = page.locator('[data-back-label]')
    await expect(backLink).toBeVisible()
    await assertTapTarget(backLink)
    await expect(backLink).toHaveAttribute('href', workScenario.fallbackHref)
  })
})
