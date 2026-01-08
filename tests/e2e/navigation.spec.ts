import { test, expect } from '@playwright/test';

test.describe('Navegação principal', () => {
  test('Dashboard, Labor, Materials e Daily Updates', async ({ page }) => {
    // Dashboard
    await page.goto('http://localhost:4173/');
    await expect(page.locator('h1')).toHaveText(/Construction Status Dashboard/i);

    // Labor
    await page.click('a[href="/labor"]');
    await expect(page.locator('h1')).toHaveText(/Gerenciamento de Mão de Obra/i);

    // Materials
    await page.click('a[href="/materials"]');
    await expect(page.locator('h1')).toHaveText(/Materials & Plant & Machinery/i);

    // Daily Updates
    await page.click('a[href="/daily-updates"]');
    await expect(page.locator('h1')).toHaveText(/Daily Updates/i);
  });
});
