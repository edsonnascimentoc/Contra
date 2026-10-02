import { test as base, expect, type Page } from '@playwright/test';

// Definir o tipo para as nossas fixtures
type MyFixtures = {
  authenticatedPage: Page;
};

// Extender o test base para incluir login automático com tipagem correta
export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('http://localhost:4173/login');
    await page.fill('input[type="email"]', 'admin@nationalgroup.in');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Esperar redirecionar para o dashboard
    await expect(page).toHaveURL(/http:\/\/localhost:4173\/?/, { timeout: 10000 });
    
    // Garantir que o h1 do dashboard carregou para confirmar login
    await expect(page.locator('h1')).toHaveText(/Dashboard de Status da Construção/i, { timeout: 10000 });
    
    await use(page);
  },
});

export { expect };
