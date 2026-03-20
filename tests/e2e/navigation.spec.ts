import { test, expect } from '@playwright/test';

test.describe('Navegação principal', () => {
  test('Dashboard, Labor, Materials e Daily Updates', async ({ page }) => {
    // Dashboard
    await page.goto('http://localhost:4173/');
    await expect(page.locator('h1')).toHaveText(/Dashboard de Status da Construção/i);

    // Labor
    await page.click('a[href="/labor"]');
    await expect(page.locator('h1')).toHaveText(/Gestão de Mão de Obra/i);

    // Materials
    await page.click('a[href="/materials"]');
    await expect(page.locator('h1')).toHaveText(/Materiais e P&M/i);

    // Daily Updates
    await page.click('a[href="/daily-updates"]');
    await expect(page.locator('h1')).toHaveText(/Atualizações Diárias/i);
  });
});
