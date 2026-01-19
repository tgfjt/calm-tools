import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { css } from '../../../styled-system/css';
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

const styles = {
  container: css({
    maxWidth: '600px',
    width: '100%',
    padding: '20px',
  }),
  header: css({
    textAlign: 'center',
    marginBottom: '30px',
  }),
  title: css({
    fontSize: '2.5rem',
    color: '#5a5a5a',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.08)',
  }),
  subtitle: css({
    fontSize: '1.1rem',
    color: '#8a8a8a',
    fontWeight: 300,
  }),
  main: css({
    background: '#fef9f3',
    borderRadius: '30px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  }),
  sheepWelcome: css({
    textAlign: 'center',
    marginBottom: '40px',
  }),
  sheep: css({
    fontSize: '6rem',
    marginBottom: '20px',
  }),
  welcomeText: css({
    fontSize: '1.2rem',
    lineHeight: 2,
    color: '#5a5a5a',
  }),
  btn: css({
    padding: '16px 32px',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: 500,
    marginBottom: '15px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    },
  }),
  btnFull: css({
    width: '100%',
  }),
  btnPrimary: css({
    background: 'linear-gradient(135deg, #ffd6e0, #e8d9f5)',
    color: '#5a5a5a',
  }),
  btnSecondary: css({
    background: 'white',
    color: '#5a5a5a',
    _hover: {
      background: '#f8f9fa',
    },
  }),
  progressBar: css({
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '10px',
    marginBottom: '30px',
    overflow: 'hidden',
  }),
  progressFill: css({
    height: '100%',
    background: 'linear-gradient(90deg, #ffd6e0, #e8d9f5)',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  }),
  stepContent: css({
    textAlign: 'center',
  }),
  stepSheep: css({
    fontSize: '4rem',
    marginBottom: '20px',
  }),
  stepTitle: css({
    fontSize: '1.8rem',
    marginBottom: '15px',
    color: '#5a5a5a',
  }),
  instruction: css({
    fontSize: '1.1rem',
    marginBottom: '30px',
    color: '#8a8a8a',
    lineHeight: 1.8,
  }),
  inputContainer: css({
    marginBottom: '30px',
  }),
  inputItem: css({
    marginBottom: '15px',
  }),
  input: css({
    width: '100%',
    padding: '12px 20px',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '20px',
    fontSize: '1rem',
    background: 'white',
    color: '#5a5a5a',
    transition: 'all 0.3s ease',
    _focus: {
      outline: 'none',
      borderColor: '#e8d9f5',
      boxShadow: '0 0 0 3px rgba(232, 217, 245, 0.3)',
    },
    _placeholder: {
      color: '#8a8a8a',
    },
  }),
  validationError: css({
    background: 'rgba(231, 76, 60, 0.1)',
    color: '#c0392b',
    padding: '12px 16px',
    borderRadius: '12px',
    marginTop: '10px',
    fontSize: '0.9rem',
    textAlign: 'center',
  }),
  buttonGroup: css({
    display: 'flex',
    gap: '15px',
  }),
  buttonGroupBtn: css({
    flex: 1,
    marginBottom: 0,
  }),
  completeContent: css({
    textAlign: 'center',
  }),
  sheepCelebrate: css({
    fontSize: '6rem',
    marginBottom: '20px',
  }),
  completeTitle: css({
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#5a5a5a',
  }),
  completeMessage: css({
    fontSize: '1.2rem',
    lineHeight: 2,
    marginBottom: '40px',
    color: '#5a5a5a',
  }),
  historyTitle: css({
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '1.8rem',
    color: '#5a5a5a',
  }),
  historyList: css({
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '30px',
  }),
  historyItem: css({
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    _hover: {
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      borderLeft: '3px solid #e8d9f5',
    },
  }),
  historyHeader: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  }),
  historyDate: css({
    fontSize: '0.9rem',
    color: '#8a8a8a',
  }),
  deleteBtn: css({
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#8a8a8a',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    opacity: 0,
    _hover: {
      background: 'rgba(255, 100, 100, 0.2)',
      color: '#e74c3c',
    },
  }),
  historySummary: css({
    fontSize: '0.95rem',
    color: '#5a5a5a',
    lineHeight: 1.6,
  }),
  historyCategory: css({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    marginRight: '8px',
    marginTop: '8px',
    background: '#d4e4f7',
    color: '#5a5a5a',
  }),
  emptyHistory: css({
    textAlign: 'center',
    padding: '40px',
    color: '#8a8a8a',
  }),
  emptySheep: css({
    fontSize: '4rem',
    marginBottom: '15px',
    opacity: 0.5,
  }),
};

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
    <div class={styles.container}>
      <header class={styles.header}>
        <h1 class={styles.title}>54321</h1>
        <p class={styles.subtitle}>グラウンディング</p>
      </header>

      <main class={styles.main}>
        {/* スタート画面 */}
        {screen.value === 'start' && (
          <div class="screen">
            <div class={styles.sheepWelcome}>
              <div class={`${styles.sheep} sheep`}>🐑</div>
              <p class={styles.welcomeText}>
                深呼吸をして、<br />
                今この瞬間に意識を向けましょう。
              </p>
            </div>
            <button class={`${styles.btn} ${styles.btnFull} ${styles.btnPrimary}`} onClick={startSession}>
              はじめる
            </button>
            <button class={`${styles.btn} ${styles.btnFull} ${styles.btnSecondary}`} onClick={() => (screen.value = 'history')}>
              履歴を見る
            </button>
          </div>
        )}

        {/* ステップ画面 */}
        {screen.value === 'step' && (
          <div class="screen">
            <div class={styles.progressBar}>
              <div class={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div class={styles.stepContent}>
              <div class={`${styles.stepSheep} sheep`}>🐑</div>
              <h2 class={styles.stepTitle}>{step.title}</h2>
              <p class={styles.instruction}>{step.instruction}</p>
              <div class={styles.inputContainer}>
                {Array.from({ length: step.count }).map((_, i) => (
                  <div class={styles.inputItem} key={i}>
                    <input
                      type="text"
                      class={styles.input}
                      placeholder={step.placeholder(i + 1)}
                      ref={(el) => {
                        if (el) inputRefs.current[i] = el;
                      }}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                  </div>
                ))}
                {validationError.value && (
                  <div class={`${styles.validationError} validation-error`}>{validationError.value}</div>
                )}
              </div>
              <div class={styles.buttonGroup}>
                <button class={`${styles.btn} ${styles.btnSecondary} ${styles.buttonGroupBtn}`} onClick={cancelSession}>
                  やめる
                </button>
                <button class={`${styles.btn} ${styles.btnPrimary} ${styles.buttonGroupBtn}`} onClick={nextStep}>
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 完了画面 */}
        {screen.value === 'complete' && (
          <div class="screen">
            <div class={styles.completeContent}>
              <div class={`${styles.sheepCelebrate} sheep-celebrate`}>🐑</div>
              <h2 class={styles.completeTitle}>おつかれさまでした</h2>
              <p class={styles.completeMessage}>
                今この瞬間に、<br />
                あなたはしっかりとつながっています。
              </p>
              <button class={`${styles.btn} ${styles.btnFull} ${styles.btnPrimary}`} onClick={() => (screen.value = 'start')}>
                おわる
              </button>
            </div>
          </div>
        )}

        {/* 履歴画面 */}
        {screen.value === 'history' && (
          <div class="screen">
            <h2 class={styles.historyTitle}>履歴</h2>
            <div class={styles.historyList}>
              {history.value.length === 0 ? (
                <div class={styles.emptyHistory}>
                  <div class={`${styles.emptySheep} sheep`}>🐑</div>
                  <p>
                    まだ記録がありません。
                    <br />
                    はじめてのセッションを始めましょう。
                  </p>
                </div>
              ) : (
                history.value.map((session) => (
                  <div class={styles.historyItem} key={session.id}>
                    <div class={styles.historyHeader}>
                      <div class={styles.historyDate}>🌙 {formatDate(session.timestamp)}</div>
                      <button
                        class={styles.deleteBtn}
                        onClick={() => session.id && handleDeleteSession(session.id)}
                        title="削除"
                      >
                        ×
                      </button>
                    </div>
                    <div class={styles.historySummary}>
                      {session.responses.map((response) => {
                        const filled = response.data.filter((d) => d.length > 0);
                        return filled.length > 0 ? (
                          <div class={styles.historyCategory} key={response.step}>
                            {response.title}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button class={`${styles.btn} ${styles.btnFull} ${styles.btnSecondary}`} onClick={() => (screen.value = 'start')}>
              戻る
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
