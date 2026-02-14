import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all pages from sidebar', async ({ page }) => {
    await page.goto('/');

    // Navigate to API Docs
    await page.click('text=API Docs');
    await expect(page).toHaveURL(/\/api-docs/);

    // Navigate to Rate Limits
    await page.click('text=Rate Limits');
    await expect(page).toHaveURL(/\/rate-limits/);

    // Navigate to Shell
    await page.click('text=Shell');
    await expect(page).toHaveURL(/\/shell/);

    // Navigate to CLI Help
    await page.click('text=CLI Help');
    await expect(page).toHaveURL(/\/cli-help/);

    // Navigate to Monitoring
    await page.click('text=Monitoring');
    await expect(page).toHaveURL(/\/monitoring/);

    // Navigate to Settings
    await page.click('text=Settings');
    await expect(page).toHaveURL(/\/settings/);

    // Navigate back to Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/');
  });

  test('should highlight active nav link', async ({ page }) => {
    await page.goto('/');
    const dashboardLink = page.locator('.sidebar a.active');
    await expect(dashboardLink).toBeVisible();
  });

  test('should maintain layout across pages', async ({ page }) => {
    const pages = ['/', '/api-docs', '/rate-limits', '/monitoring', '/settings'];

    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('.sidebar')).toBeVisible();
      await expect(page.locator('.header')).toBeVisible();
    }
  });
});
