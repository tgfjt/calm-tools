import { useSignal, useComputed } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { css } from '../../../styled-system/css';
import { token } from '../../../styled-system/tokens';
import {
  initDB,
  saveBreathSession,
  getBreathSessions,
  type BreathSession,
} from '../../lib/db';
import { getTranslations, type Locale } from '../../i18n';

interface Props {
  locale: Locale;
}

type Pattern = '555' | '478';
type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';
type Duration = 60 | 180 | 300;

const patternConfigs = {
  '555': { inhale: 5, hold: 5, exhale: 5 },
  '478': { inhale: 4, hold: 7, exhale: 8 },
};

const durationValues: Duration[] = [60, 180, 300];

const styles = {
  container: css({
    textAlign: 'center',
    zIndex: 1,
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
  }),
  title: css({
    fontSize: '1.8rem',
    fontWeight: 200,
    marginBottom: '2rem',
    letterSpacing: '0.3em',
    opacity: 0.9,
    color: token('colors.breath.muted'),
  }),
  patternSelection: css({
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  }),
  patternBtn: css({
    background: token('colors.breath.surfaceHover'),
    border: `2px solid ${token('colors.breath.border')}`,
    color: token('colors.breath.muted'),
    padding: '1.2rem 1.5rem',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '160px',
    _hover: {
      background: token('colors.breath.surfaceStrong'),
      borderColor: token('colors.breath.borderStrong'),
      transform: 'translateY(-2px)',
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  }),
  patternBtnSelected: css({
    background: token('colors.breath.surfaceStronger'),
    borderColor: token('colors.breath.borderStronger'),
  }),
  patternName: css({
    fontSize: '1.2rem',
    fontWeight: 300,
    letterSpacing: '0.15em',
    marginBottom: '0.5rem',
  }),
  patternDesc: css({
    fontSize: '0.85rem',
    opacity: 0.7,
    letterSpacing: '0.05em',
    lineHeight: 1.4,
    whiteSpace: 'pre-line',
  }),
  durationSelection: css({
    marginBottom: '2rem',
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  }),
  durationBtn: css({
    background: token('colors.breath.surface'),
    border: `1px solid ${token('colors.breath.borderWeak')}`,
    color: token('colors.breath.muted'),
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    opacity: 0.7,
    _hover: {
      opacity: 1,
      background: token('colors.breath.surfaceMedium'),
    },
    _disabled: {
      cursor: 'not-allowed',
    },
  }),
  durationBtnSelected: css({
    opacity: 1,
    background: token('colors.breath.surfaceStrong'),
    borderColor: token('colors.breath.borderStrong'),
  }),
  breathCircle: css({
    width: '280px',
    height: '280px',
    margin: '0 auto 3rem',
    position: 'relative',
  }),
  circle: css({
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: token('gradients.breathCircle'),
    border: `1.5px solid ${token('colors.breath.border')}`,
    transition: 'all 0.3s ease',
  }),
  circleContent: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  }),
  phaseCountdown: css({
    fontSize: '4rem',
    fontWeight: 200,
    lineHeight: 1,
    color: token('colors.breath.muted'),
    minHeight: '4.5rem',
  }),
  instruction: css({
    fontSize: '1.5rem',
    fontWeight: 300,
    letterSpacing: '0.2em',
    minHeight: '2rem',
    color: token('colors.breath.accentLight'),
    marginTop: '0.5rem',
    whiteSpace: 'nowrap',
  }),
  timer: css({
    fontSize: '1rem',
    fontWeight: 300,
    marginBottom: '2rem',
    fontVariantNumeric: 'tabular-nums',
    color: token('colors.breath.muted'),
    opacity: 0.6,
  }),
  controls: css({
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '3rem',
  }),
  controlBtn: css({
    background: token('colors.breath.surfaceMedium'),
    border: `1px solid ${token('colors.breath.borderMedium')}`,
    color: token('colors.breath.muted'),
    padding: '1rem 2.5rem',
    fontSize: '1rem',
    fontWeight: 300,
    borderRadius: '30px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.1em',
    _hover: {
      background: token('colors.breath.surfaceStronger'),
      transform: 'translateY(-2px)',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  }),
  history: css({
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: `1px solid ${token('colors.breath.borderWeak')}`,
  }),
  historyTitle: css({
    fontSize: '1.2rem',
    fontWeight: 300,
    marginBottom: '1.5rem',
    letterSpacing: '0.2em',
    opacity: 0.8,
    color: token('colors.breath.muted'),
  }),
  stats: css({
    fontSize: '0.9rem',
    opacity: 0.7,
    color: token('colors.breath.textAlt'),
    marginBottom: '1rem',
  }),
  historyList: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '0 1rem',
  }),
  historyItem: css({
    background: token('colors.breath.surface'),
    padding: '0.8rem 1.2rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `1px solid ${token('colors.breath.borderWeaker')}`,
    color: token('colors.breath.textAlt'),
  }),
  historyDate: css({
    opacity: 0.7,
    fontSize: '0.85rem',
  }),
};

export default function BreathApp({ locale }: Props) {
  const i18n = getTranslations(locale);

  const selectedPattern = useSignal<Pattern>('555');
  const selectedDuration = useSignal<Duration>(60);
  const phase = useSignal<Phase>('idle');
  const phaseCountdown = useSignal(0);
  const remainingTime = useSignal(60);
  const isRunning = useSignal(false);
  const history = useSignal<BreathSession[]>([]);

  const timerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);
  const cycleTimeoutRef = useRef<number | null>(null);

  const circleClass = useComputed(() => {
    if (phase.value === 'idle' || phase.value === 'complete') return '';
    const suffix = selectedPattern.value === '478' ? '-478' : '';
    const phaseMap = {
      inhale: `breathing-in${suffix}`,
      hold: `holding${suffix}`,
      exhale: `breathing-out${suffix}`,
    };
    return phaseMap[phase.value] || '';
  });

  const instruction = useComputed(() => {
    return i18n.breath.phases[phase.value];
  });

  useEffect(() => {
    initDB()
      .then(() => loadHistory())
      .catch(console.error);

    return () => {
      clearAllTimers();
    };
  }, []);

  const loadHistory = async () => {
    try {
      const sessions = await getBreathSessions();
      history.value = sessions.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
  };

  const startPhaseCountdown = (seconds: number) => {
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    phaseCountdown.value = seconds;

    phaseTimerRef.current = window.setInterval(() => {
      if (phaseCountdown.value > 1) {
        phaseCountdown.value--;
      }
    }, 1000);
  };

  const runBreathingCycle = () => {
    if (!isRunning.value) return;

    const p = patternConfigs[selectedPattern.value];

    phase.value = 'inhale';
    startPhaseCountdown(p.inhale);

    cycleTimeoutRef.current = window.setTimeout(() => {
      if (!isRunning.value) return;
      phase.value = 'hold';
      startPhaseCountdown(p.hold);

      cycleTimeoutRef.current = window.setTimeout(() => {
        if (!isRunning.value) return;
        phase.value = 'exhale';
        startPhaseCountdown(p.exhale);

        cycleTimeoutRef.current = window.setTimeout(() => {
          if (isRunning.value && remainingTime.value > 0) {
            runBreathingCycle();
          }
        }, p.exhale * 1000);
      }, p.hold * 1000);
    }, p.inhale * 1000);
  };

  const start = () => {
    if (isRunning.value) return;

    isRunning.value = true;
    runBreathingCycle();

    timerRef.current = window.setInterval(() => {
      remainingTime.value--;
      if (remainingTime.value <= 0) {
        complete();
      }
    }, 1000);
  };

  const complete = async () => {
    clearAllTimers();
    isRunning.value = false;
    phase.value = 'complete';
    phaseCountdown.value = 0;

    await saveBreathSession({
      timestamp: new Date().toISOString(),
      completed: true,
      duration: selectedDuration.value,
      pattern: selectedPattern.value,
    });
    await loadHistory();

    setTimeout(() => reset(), 3000);
  };

  const reset = async () => {
    if (isRunning.value) {
      await saveBreathSession({
        timestamp: new Date().toISOString(),
        completed: false,
        duration: selectedDuration.value - remainingTime.value,
        pattern: selectedPattern.value,
      });
      await loadHistory();
    }

    clearAllTimers();
    isRunning.value = false;
    phase.value = 'idle';
    remainingTime.value = selectedDuration.value;
    phaseCountdown.value = 0;
  };

  const selectDuration = (d: Duration) => {
    if (isRunning.value) return;
    selectedDuration.value = d;
    remainingTime.value = d;
  };

  const selectPattern = (p: Pattern) => {
    if (isRunning.value) return;
    selectedPattern.value = p;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${i18n.breath.remaining} ${m}:${String(s).padStart(2, '0')}`;
  };

  const completedCount = useComputed(
    () => history.value.filter((s) => s.completed).length
  );

  return (
    <div class={styles.container} data-testid="breath-app">
      <h1 class={styles.title}>{i18n.breath.title}</h1>

      <div class={styles.patternSelection} data-testid="breath-pattern-selection">
        {(['555', '478'] as Pattern[]).map((p) => (
          <button
            key={p}
            class={`${styles.patternBtn} ${selectedPattern.value === p ? styles.patternBtnSelected : ''}`}
            onClick={() => selectPattern(p)}
            disabled={isRunning.value}
            data-testid={`breath-pattern-${p}`}
          >
            <div class={styles.patternName}>{i18n.breath.patterns[p].name}</div>
            <div class={styles.patternDesc}>{i18n.breath.patterns[p].desc}</div>
          </button>
        ))}
      </div>

      <div class={styles.durationSelection} data-testid="breath-duration-selection">
        {durationValues.map((d) => (
          <button
            key={d}
            class={`${styles.durationBtn} ${selectedDuration.value === d ? styles.durationBtnSelected : ''}`}
            onClick={() => selectDuration(d)}
            disabled={isRunning.value}
            data-testid={`breath-duration-${d}`}
          >
            {i18n.breath.durations[String(d) as '60' | '180' | '300']}
          </button>
        ))}
      </div>

      <div class={styles.breathCircle} data-testid="breath-circle">
        <div class={`${styles.circle} circle ${circleClass.value}`} />
        <div class={styles.circleContent}>
          <div class={styles.phaseCountdown} data-testid="breath-phase-countdown">
            {phaseCountdown.value > 0 ? phaseCountdown.value : ''}
          </div>
          <div class={styles.instruction} data-testid="breath-instruction">{instruction.value}</div>
        </div>
      </div>

      <div class={styles.timer} data-testid="breath-timer">{formatTime(remainingTime.value)}</div>

      <div class={styles.controls} data-testid="breath-controls">
        <button class={styles.controlBtn} onClick={start} disabled={isRunning.value} data-testid="breath-start-btn">
          {i18n.breath.start}
        </button>
        <button class={styles.controlBtn} onClick={reset} disabled={!isRunning.value && phase.value === 'idle'} data-testid="breath-reset-btn">
          {i18n.breath.reset}
        </button>
      </div>

      <div class={styles.history} data-testid="breath-history">
        <h2 class={styles.historyTitle}>{i18n.breath.history}</h2>
        <div class={styles.stats}>
          {history.value.length === 0
            ? i18n.breath.noRecords
            : i18n.breath.stats
                .replace('{total}', String(history.value.length))
                .replace('{completed}', String(completedCount.value))}
        </div>
        <div class={styles.historyList}>
          {history.value.slice(0, 10).map((session) => {
            const date = new Date(session.timestamp);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            return (
              <div class={styles.historyItem} key={session.id}>
                <span>
                  {session.completed ? `✓ ${i18n.breath.completed}` : i18n.breath.interrupted} ({session.pattern})
                </span>
                <span class={styles.historyDate}>{dateStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
