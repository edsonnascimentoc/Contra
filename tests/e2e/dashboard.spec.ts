import { test, expect } from './auth-setup';

test('Dashboard carrega e exibe cabeçalho após login', async ({ authenticatedPage: page }) => {
  // O authenticatedPage já realiza o login e redireciona para o dashboard
  await expect(page.locator('h1')).toHaveText(/Dashboard de Status da Construção/i);
});
