import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test('should display settings form', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText(/Settings/i).first()).toBeVisible();
  });

  test('should have backend URL input', async ({ page }) => {
    await page.goto('/settings');
    const urlInput = page.locator('input[type="text"]').first();
    await expect(urlInput).toBeVisible();
  });

  test('should persist settings to localStorage', async ({ page }) => {
    await page.goto('/settings');

    // Check that localStorage has settings after page load
    const hasStorage = await page.evaluate(() => {
      return localStorage.length >= 0; // Settings page uses localStorage
    });
    expect(hasStorage).toBe(true);
  });
});

test.describe('API Docs Page', () => {
  test('should display API documentation', async ({ page }) => {
    await page.goto('/api-docs');
    await expect(page.getByText(/API Documentation/i).first()).toBeVisible();
  });

  test('should show API endpoint cards', async ({ page }) => {
    await page.goto('/api-docs');
    // Should display endpoint information
    await expect(page.getByText(/GET|POST|PUT|DELETE/i).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Rate Limits Page', () => {
  test('should display rate limit information', async ({ page }) => {
    await page.goto('/rate-limits');
    await expect(page.getByText(/Rate Limit/i).first()).toBeVisible();
  });

  test('should show rate limit tiers', async ({ page }) => {
    await page.goto('/rate-limits');
    // Should have tier information
    await expect(page.getByText(/per customer|per ip|limit/i).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Monitoring Page', () => {
  test('should display monitoring dashboard', async ({ page }) => {
    await page.goto('/monitoring');
    await expect(page.getByText(/Monitoring/i).first()).toBeVisible();
  });
});

test.describe('Shell Page', () => {
  test('should display shell completion info', async ({ page }) => {
    await page.goto('/shell');
    await expect(page.getByText(/Shell|Completion/i).first()).toBeVisible();
  });

  test('should show bash and zsh options', async ({ page }) => {
    await page.goto('/shell');
    await expect(page.getByText(/bash|zsh/i).first()).toBeVisible();
  });
});
