import { test, expect } from './auth-setup';

test.describe('Navegação principal', () => {
  test('Dashboard, Labor, Materials e Daily Updates após login', async ({ authenticatedPage: page }) => {
    // Dashboard (já logado via authenticatedPage)
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
