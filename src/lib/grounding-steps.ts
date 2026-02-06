export type StepCategory = 'sight' | 'touch' | 'sound' | 'smell' | 'taste';

export const stepConfigs: { count: number; category: StepCategory }[] = [
  { count: 5, category: 'sight' },
  { count: 4, category: 'touch' },
  { count: 3, category: 'sound' },
  { count: 2, category: 'smell' },
  { count: 1, category: 'taste' },
];

export function totalSteps(): number {
  return stepConfigs.length;
}

export function progress(currentStep: number): number {
  return (currentStep / stepConfigs.length) * 100;
}

export function isLastStep(currentStep: number): boolean {
  return currentStep >= stepConfigs.length - 1;
}
