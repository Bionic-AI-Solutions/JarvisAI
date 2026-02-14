import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('should load the dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jarvis AI/i);
  });

  test('should display the sidebar with navigation', async ({ page }) => {
    await page.goto('/');
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText('Dashboard')).toBeVisible();
    await expect(sidebar.getByText('API Docs')).toBeVisible();
    await expect(sidebar.getByText('Rate Limits')).toBeVisible();
    await expect(sidebar.getByText('Monitoring')).toBeVisible();
    await expect(sidebar.getByText('Settings')).toBeVisible();
  });

  test('should display the header with health status', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('.header');
    await expect(header).toBeVisible();
  });

  test('should show dashboard status cards', async ({ page }) => {
    await page.goto('/');
    // Dashboard should have status cards
    const cards = page.locator('.status-card');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display enterprise features section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Enterprise Features/i)).toBeVisible();
  });
});
