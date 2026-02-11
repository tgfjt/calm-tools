import { test as base } from '@playwright/test';
import { homePage } from './pages/HomePage';
import { breathPage } from './pages/BreathPage';
import { groundingPage } from './pages/GroundingPage';

type Fixtures = {
  homePage: ReturnType<typeof homePage>;
  breathPage: ReturnType<typeof breathPage>;
  groundingPage: ReturnType<typeof groundingPage>;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(homePage(page));
  },
  breathPage: async ({ page }, use) => {
    await use(breathPage(page));
  },
  groundingPage: async ({ page }, use) => {
    await use(groundingPage(page));
  },
});

export { expect } from '@playwright/test';
