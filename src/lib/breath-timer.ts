export type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';
export type Pattern = '555' | '478';
export type Duration = 60 | 180 | 300;

export const patternConfigs = {
  '555': { inhale: 5, hold: 5, exhale: 5 },
  '478': { inhale: 4, hold: 7, exhale: 8 },
} as const;

export const durationValues: Duration[] = [60, 180, 300];

export function nextPhase(current: Phase): Phase {
  const order: Phase[] = ['inhale', 'hold', 'exhale'];
  const idx = order.indexOf(current);
  if (idx === -1) return 'inhale';
  if (idx < order.length - 1) return order[idx + 1];
  return 'inhale';
}

export function phaseDuration(pattern: Pattern, phase: Phase): number {
  if (phase === 'idle' || phase === 'complete') return 0;
  return patternConfigs[pattern][phase];
}

export function cycleDuration(pattern: Pattern): number {
  const p = patternConfigs[pattern];
  return p.inhale + p.hold + p.exhale;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
