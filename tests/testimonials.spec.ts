import { test, expect } from "@playwright/test";

const links = [
  "/work/global-hcm-replacement",
  "/work/payroll-consolidation",
  "/work/hr-ops-ai-assistant",
];

test("testimonial links open case study pages", async ({ page }) => {
  await page.goto("/");
  for (const href of links) {
    const link = page.locator(`a[href="${href}"]`).first();
    if (await link.count()) {
      const [nav] = await Promise.all([page.waitForNavigation(), link.click()]);
      expect(nav?.ok()).toBeTruthy();
      await expect(page.locator("h1")).toBeVisible();
      await page.goBack();
    }
  }
});

test("homepage testimonial links are correct and navigable", async ({ page }) => {
  await page.goto("/");
  
  // Check that all three testimonial links exist on the homepage
  for (const href of links) {
    const link = page.locator(`a[href="${href}"]`).filter({ hasText: "View full case study" });
    await expect(link).toBeVisible();
  }
});
