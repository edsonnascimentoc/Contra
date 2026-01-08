import { test, expect } from '@playwright/test';

test('Dashboard carrega e exibe cabeçalho', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await expect(page.locator('h1')).toHaveText(/Construction Status Dashboard|Gerenciamento de Mão de Obra/i);
});
