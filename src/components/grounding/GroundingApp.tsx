import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import {
  initDB,
  saveGroundingSession,
  getGroundingSessions,
  deleteGroundingSession,
  type GroundingSession,
  type GroundingStepResponse,
} from '../../lib/db';
import { stepResponseSchema } from '../../lib/schemas';

type Screen = 'start' | 'step' | 'complete' | 'history';

const steps = [
  {
    title: '見えるもの 5つ',
    instruction: 'いま、目に見えるものを5つ、ゆっくり見つけてください。',
    count: 5,
    category: 'sight',
    placeholder: (i: number) => (i === 1 ? '例）やわらかい雲、青い空...' : `${i}つ目`),
  },
  {
    title: '触れるもの 4つ',
    instruction: 'まわりにあって、触れることができるものを4つ見つけてください。',
    count: 4,
    category: 'touch',
    placeholder: (i: number) => (i === 1 ? '例）つめたい机、ふわふわのクッション...' : `${i}つ目`),
  },
  {
    title: '聞こえるもの 3つ',
    instruction: '耳をすませて、いま聞こえる音を3つ見つけてください。',
    count: 3,
    category: 'sound',
    placeholder: (i: number) => (i === 1 ? '例）鳥のさえずり、風の音...' : `${i}つ目`),
  },
  {
    title: '匂うもの 2つ',
    instruction: 'まわりの匂いに意識を向けて、2つ見つけてください。',
    count: 2,
    category: 'smell',
    placeholder: (i: number) => (i === 1 ? '例）コーヒーの香り、草の匂い...' : `${i}つ目`),
  },
  {
    title: '味わうもの 1つ',
    instruction: 'いま、口の中で感じられる味を1つ見つけてください。',
    count: 1,
    category: 'taste',
    placeholder: () => '例）お茶の味、口の中のやさしい味...',
  },
];

export default function GroundingApp() {
  const screen = useSignal<Screen>('start');
  const currentStep = useSignal(0);
  const responses = useSignal<GroundingStepResponse[]>([]);
  const validationError = useSignal<string | null>(null);
  const history = useSignal<GroundingSession[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    initDB().then(() => loadHistory()).catch(console.error);
  }, []);

  const loadHistory = async () => {
    try {
      const sessions = await getGroundingSessions();
      history.value = sessions.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const startSession = () => {
    currentStep.value = 0;
    responses.value = [];
    validationError.value = null;
    screen.value = 'step';
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const nextStep = () => {
    const step = steps[currentStep.value];
    const inputs = inputRefs.current.slice(0, step.count);
    const values = inputs.map((input) => input?.value?.trim() || '');

    const result = stepResponseSchema.safeParse(values);
    if (!result.success) {
      validationError.value = result.error.errors[0].message;
      setTimeout(() => {
        validationError.value = null;
      }, 3000);
      return;
    }

    responses.value = [
      ...responses.value,
      {
        step: currentStep.value,
        category: step.category,
        title: step.title,
        data: values,
      },
    ];

    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    try {
      await saveGroundingSession({
        timestamp: new Date().toISOString(),
        responses: responses.value,
      });
      await loadHistory();
      screen.value = 'complete';
    } catch (error) {
      console.error('セッションの保存に失敗しました:', error);
    }
  };

  const cancelSession = () => {
    if (confirm('途中ですが、やめますか？')) {
      screen.value = 'start';
    }
  };

  const handleDeleteSession = async (id: number) => {
    if (confirm('この記録を削除しますか？')) {
      try {
        await deleteGroundingSession(id);
        await loadHistory();
      } catch (error) {
        console.error('削除に失敗しました:', error);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.isComposing || e.keyCode === 229) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const step = steps[currentStep.value];
      if (index < step.count - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        nextStep();
      }
    }
  };

  const progress = ((currentStep.value + 1) / steps.length) * 100;
  const step = steps[currentStep.value];

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div class="grounding-container">
      <header>
        <h1>54321</h1>
        <p class="subtitle">グラウンディング</p>
      </header>

      <main>
        {/* スタート画面 */}
        {screen.value === 'start' && (
          <div class="screen active">
            <div class="sheep-welcome">
              <div class="sheep">🐑</div>
              <p class="welcome-text">
                深呼吸をして、<br />
                今この瞬間に意識を向けましょう。
              </p>
            </div>
            <button class="btn btn-primary" onClick={startSession}>
              はじめる
            </button>
            <button class="btn btn-secondary" onClick={() => (screen.value = 'history')}>
              履歴を見る
            </button>
          </div>
        )}

        {/* ステップ画面 */}
        {screen.value === 'step' && (
          <div class="screen active">
            <div class="progress-bar">
              <div class="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div class="step-content">
              <div class="sheep">🐑</div>
              <h2 id="step-title">{step.title}</h2>
              <p class="instruction">{step.instruction}</p>
              <div class="input-container">
                {Array.from({ length: step.count }).map((_, i) => (
                  <div class="input-item" key={i}>
                    <input
                      type="text"
                      placeholder={step.placeholder(i + 1)}
                      ref={(el) => {
                        if (el) inputRefs.current[i] = el;
                      }}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                  </div>
                ))}
                {validationError.value && (
                  <div class="validation-error">{validationError.value}</div>
                )}
              </div>
              <div class="button-group">
                <button class="btn btn-secondary" onClick={cancelSession}>
                  やめる
                </button>
                <button class="btn btn-primary" onClick={nextStep}>
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 完了画面 */}
        {screen.value === 'complete' && (
          <div class="screen active">
            <div class="complete-content">
              <div class="sheep-celebrate">🐑</div>
              <h2>おつかれさまでした</h2>
              <p class="complete-message">
                今この瞬間に、<br />
                あなたはしっかりとつながっています。
              </p>
              <button class="btn btn-primary" onClick={() => (screen.value = 'start')}>
                おわる
              </button>
            </div>
          </div>
        )}

        {/* 履歴画面 */}
        {screen.value === 'history' && (
          <div class="screen active">
            <h2>履歴</h2>
            <div class="history-list">
              {history.value.length === 0 ? (
                <div class="empty-history">
                  <div class="sheep">🐑</div>
                  <p>
                    まだ記録がありません。
                    <br />
                    はじめてのセッションを始めましょう。
                  </p>
                </div>
              ) : (
                history.value.map((session) => (
                  <div class="history-item" key={session.id}>
                    <div class="history-header">
                      <div class="history-date">🌙 {formatDate(session.timestamp)}</div>
                      <button
                        class="delete-btn"
                        onClick={() => session.id && handleDeleteSession(session.id)}
                        title="削除"
                      >
                        ×
                      </button>
                    </div>
                    <div class="history-summary">
                      {session.responses.map((response) => {
                        const filled = response.data.filter((d) => d.length > 0);
                        return filled.length > 0 ? (
                          <div class="history-category" key={response.step}>
                            {response.title}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button class="btn btn-secondary" onClick={() => (screen.value = 'start')}>
              戻る
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
