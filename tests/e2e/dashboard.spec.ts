import { test, expect } from '@playwright/test';

test('Dashboard carrega e exibe cabeçalho', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await expect(page.locator('h1')).toHaveText(/Dashboard de Status da Construção/i);
});
