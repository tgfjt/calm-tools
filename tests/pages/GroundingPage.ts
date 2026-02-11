import type { Page } from '@playwright/test';

export function groundingPage(page: Page) {
  const app = page.locator('[data-testid="grounding-app"]');
  const startBtn = page.locator('[data-testid="grounding-start-btn"]');
  const historyBtn = page.locator('[data-testid="grounding-history-btn"]');
  const stepForm = page.locator('[data-testid="grounding-step-form"]');
  const nextBtn = page.locator('[data-testid="grounding-next-btn"]');
  const cancelBtn = page.locator('[data-testid="grounding-cancel-btn"]');
  const progressBar = page.locator('[data-testid="grounding-progress-bar"]');
  const validationError = page.locator('[data-testid="grounding-validation-error"]');
  const completeScreen = page.locator('[data-testid="grounding-screen-complete"]');
  const finishBtn = page.locator('[data-testid="grounding-finish-btn"]');
  const historyScreen = page.locator('[data-testid="grounding-screen-history"]');
  const backBtn = page.locator('[data-testid="grounding-back-btn"]');

  const getInput = (category: string, index: number) =>
    page.locator(`[data-testid="grounding-input-${category}-${index}"]`);

  const fillStep = async (category: string, count: number, values?: string[]) => {
    for (let i = 0; i < count; i++) {
      await getInput(category, i).fill(values?.[i] || `テスト入力${i + 1}`);
    }
  };

  const nextStep = () => nextBtn.click();

  const fillAndNextStep = async (category: string, count: number) => {
    await fillStep(category, count);
    await nextStep();
  };

  const steps = [
    { category: 'sight', count: 5 },
    { category: 'touch', count: 4 },
    { category: 'sound', count: 3 },
    { category: 'smell', count: 2 },
    { category: 'taste', count: 1 },
  ];

  return {
    app,
    startBtn,
    historyBtn,
    stepForm,
    nextBtn,
    cancelBtn,
    progressBar,
    validationError,
    completeScreen,
    finishBtn,
    historyScreen,
    backBtn,
    getInput,
    goto: async () => {
      await page.goto('/grounding');
      await page.waitForLoadState('networkidle');
    },
    startSession: () => startBtn.click(),
    fillStep,
    nextStep,
    fillAndNextStep,
    completeAllSteps: async () => {
      for (const step of steps) {
        await fillAndNextStep(step.category, step.count);
      }
    },
    goToHistory: () => historyBtn.click(),
    cancelSession: async () => {
      page.on('dialog', (dialog) => dialog.accept());
      await cancelBtn.click();
    },
  };
}
