import { test, expect } from '@playwright/test';

test.describe('e2e', () => {
  test.skip(() => !process.env.E2E_RUN, 'Set E2E_RUN=1 with dev server running');

  test('home loads', async ({ page }) => {
  await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
