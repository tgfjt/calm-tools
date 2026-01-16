import { z } from 'zod';

// 54321法：少なくとも1つは入力が必要
export const stepResponseSchema = z.array(z.string()).refine(
  (arr) => arr.some((s) => s.trim().length > 0),
  { message: '少なくとも1つ入力してください' }
);

export type StepResponse = z.infer<typeof stepResponseSchema>;
