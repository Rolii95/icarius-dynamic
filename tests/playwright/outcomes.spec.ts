import { test, expect } from '@playwright/test'

// Quick visual test: verify outcomes card stacks/looks correct at mobile width
test.describe('Case study outcomes', () => {
  test('mobile layout stacks and no overflow', async ({ page }) => {
    await page.goto('http://localhost:3000/work/global-hcm-replacement')
    await page.setViewportSize({ width: 375, height: 800 })

    const outcomes = page.locator('#results').locator('..').locator('ul')
    await expect(outcomes).toBeVisible()

    // Snapshot the block for visual regression
    const card = page.locator('#results').locator('..')
    await expect(card).toHaveScreenshot('outcomes-mobile.png')
  })
})
