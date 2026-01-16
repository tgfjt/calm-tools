import { useSignal, useComputed } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import {
  initDB,
  saveBreathSession,
  getBreathSessions,
  type BreathSession,
} from '../../lib/db';

type Pattern = '555' | '478';
type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';
type Duration = 60 | 180 | 300;

const patterns = {
  '555': { inhale: 5, hold: 5, exhale: 5, name: '5-5-5', desc: 'バランス型\nリフレッシュに' },
  '478': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8', desc: '鎮静型\n就寝前に' },
};

const durations: { value: Duration; label: string }[] = [
  { value: 60, label: '1分' },
  { value: 180, label: '3分' },
  { value: 300, label: '5分' },
];

export default function BreathApp() {
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

  const pattern = useComputed(() => patterns[selectedPattern.value]);

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
    const map: Record<Phase, string> = {
      idle: '準備ができたら開始',
      inhale: '吸って',
      hold: '止めて',
      exhale: '吐いて',
      complete: '完了しました',
    };
    return map[phase.value];
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

    const p = patterns[selectedPattern.value];

    // 吸う
    phase.value = 'inhale';
    startPhaseCountdown(p.inhale);

    cycleTimeoutRef.current = window.setTimeout(() => {
      if (!isRunning.value) return;
      // 止める
      phase.value = 'hold';
      startPhaseCountdown(p.hold);

      cycleTimeoutRef.current = window.setTimeout(() => {
        if (!isRunning.value) return;
        // 吐く
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
    return `残り ${m}:${String(s).padStart(2, '0')}`;
  };

  const completedCount = useComputed(
    () => history.value.filter((s) => s.completed).length
  );

  return (
    <div class="breath-container">
      <h1>深呼吸</h1>

      <div class="pattern-selection">
        {(['555', '478'] as Pattern[]).map((p) => (
          <button
            key={p}
            class={`pattern-btn ${selectedPattern.value === p ? 'selected' : ''}`}
            onClick={() => selectPattern(p)}
            disabled={isRunning.value}
          >
            <div class="pattern-name">{patterns[p].name}</div>
            <div class="pattern-desc">{patterns[p].desc}</div>
          </button>
        ))}
      </div>

      <div class="duration-selection">
        {durations.map((d) => (
          <button
            key={d.value}
            class={`duration-btn ${selectedDuration.value === d.value ? 'selected' : ''}`}
            onClick={() => selectDuration(d.value)}
            disabled={isRunning.value}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div class="breath-circle">
        <div class={`circle ${circleClass.value}`} />
        <div class="circle-content">
          <div class="phase-countdown">
            {phaseCountdown.value > 0 ? phaseCountdown.value : ''}
          </div>
          <div class="instruction">{instruction.value}</div>
        </div>
      </div>

      <div class="timer">{formatTime(remainingTime.value)}</div>

      <div class="controls">
        <button onClick={start} disabled={isRunning.value}>
          開始
        </button>
        <button onClick={reset} disabled={!isRunning.value && phase.value === 'idle'}>
          リセット
        </button>
      </div>

      <div class="history">
        <h2>履歴</h2>
        <div class="stats">
          {history.value.length === 0
            ? 'まだ記録がありません'
            : `合計 ${history.value.length} 回 / 完了 ${completedCount.value} 回`}
        </div>
        <div class="history-list">
          {history.value.slice(0, 10).map((session) => {
            const date = new Date(session.timestamp);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            return (
              <div class="history-item" key={session.id}>
                <span>
                  {session.completed ? '✓ 完了' : '中断'} ({session.pattern})
                </span>
                <span class="history-date">{dateStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
