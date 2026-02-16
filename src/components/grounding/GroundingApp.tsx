import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { css } from '../../../styled-system/css';
import { token } from '../../../styled-system/tokens';
import {
  initDB,
  saveGroundingSession,
  getGroundingSessions,
  deleteGroundingSession,
  type GroundingSession,
  type GroundingStepResponse,
} from '../../lib/db';
import { stepResponseSchema } from '../../lib/schemas';
import { getTranslations, type Locale } from '../../i18n';

interface Props {
  locale: Locale;
}

type Screen = 'start' | 'step' | 'complete' | 'history';
type StepCategory = 'sight' | 'touch' | 'sound' | 'smell' | 'taste';

const stepConfigs: { count: number; category: StepCategory }[] = [
  { count: 5, category: 'sight' },
  { count: 4, category: 'touch' },
  { count: 3, category: 'sound' },
  { count: 2, category: 'smell' },
  { count: 1, category: 'taste' },
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
    fontWeight: 200,
    color: token('colors.grounding.text'),
    marginBottom: '10px',
  }),
  subtitle: css({
    fontSize: '1.1rem',
    color: token('colors.grounding.textLight'),
    fontWeight: 200,
  }),
  main: css({
    background: token('colors.grounding.bg'),
    borderRadius: '30px',
    padding: '40px',
    boxShadow: token('shadows.card'),
    border: '1px solid rgba(200,184,168,0.2)',
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
    color: token('colors.grounding.text'),
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
    boxShadow: token('shadows.btn'),
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: token('shadows.cardHover'),
    },
  }),
  btnFull: css({
    width: '100%',
  }),
  btnPrimary: css({
    background: token('gradients.groundingBtn'),
    color: '#1a1510',
  }),
  btnSecondary: css({
    background: 'white',
    color: token('colors.grounding.text'),
    _hover: {
      background: token('colors.grounding.hoverBg'),
    },
  }),
  progressBar: css({
    width: '100%',
    height: '8px',
    background: token('colors.grounding.progressBg'),
    borderRadius: '10px',
    marginBottom: '30px',
    overflow: 'hidden',
  }),
  progressFill: css({
    height: '100%',
    background: token('gradients.groundingProgress'),
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
    color: token('colors.grounding.text'),
  }),
  instruction: css({
    fontSize: '1.1rem',
    marginBottom: '30px',
    color: token('colors.grounding.textLight'),
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
    border: `2px solid ${token('colors.grounding.borderWhiteMax')}`,
    borderRadius: '20px',
    fontSize: '1rem',
    background: 'white',
    color: token('colors.grounding.text'),
    transition: 'all 0.3s ease',
    _focus: {
      outline: 'none',
      borderColor: token('colors.grounding.purple'),
      boxShadow: `0 0 0 3px ${token('colors.grounding.purpleAlpha')}`,
    },
    _placeholder: {
      color: token('colors.grounding.textLight'),
    },
  }),
  validationError: css({
    background: token('colors.error.bg'),
    color: token('colors.error.text'),
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
    color: token('colors.grounding.text'),
  }),
  completeMessage: css({
    fontSize: '1.2rem',
    lineHeight: 2,
    marginBottom: '40px',
    color: token('colors.grounding.text'),
  }),
  historyTitle: css({
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '1.8rem',
    color: token('colors.grounding.text'),
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
    boxShadow: token('shadows.softMedium'),
    transition: 'all 0.2s ease',
    _hover: {
      boxShadow: token('shadows.softStrong'),
      borderLeft: `3px solid ${token('colors.grounding.purple')}`,
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
    color: token('colors.grounding.textLight'),
  }),
  deleteBtn: css({
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: token('colors.grounding.textLight'),
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    opacity: 0,
    _hover: {
      background: token('colors.error.hoverBg'),
      color: token('colors.error.accent'),
    },
  }),
  historySummary: css({
    fontSize: '0.95rem',
    color: token('colors.grounding.text'),
    lineHeight: 1.6,
  }),
  historyCategory: css({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    marginRight: '8px',
    marginTop: '8px',
    background: token('colors.grounding.blue'),
    color: token('colors.grounding.text'),
  }),
  emptyHistory: css({
    textAlign: 'center',
    padding: '40px',
    color: token('colors.grounding.textLight'),
  }),
  emptySheep: css({
    fontSize: '4rem',
    marginBottom: '15px',
    opacity: 0.5,
  }),
  fieldset: css({
    border: 'none',
    padding: 0,
    margin: 0,
  }),
  visuallyHidden: css({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  }),
};

export default function GroundingApp({ locale }: Props) {
  const i18n = getTranslations(locale);

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
    const stepConfig = stepConfigs[currentStep.value];
    const stepI18n = i18n.grounding.steps[stepConfig.category];
    const inputs = inputRefs.current.slice(0, stepConfig.count);
    const values = inputs.map((input) => input?.value?.trim() || '');

    const result = stepResponseSchema.safeParse(values);
    if (!result.success) {
      validationError.value = result.error.issues[0].message;
      setTimeout(() => {
        validationError.value = null;
      }, 3000);
      return;
    }

    responses.value = [
      ...responses.value,
      {
        step: currentStep.value,
        category: stepConfig.category,
        title: stepI18n.title,
        data: values,
      },
    ];

    if (currentStep.value < stepConfigs.length - 1) {
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
    if (confirm(i18n.grounding.confirmCancel)) {
      screen.value = 'start';
    }
  };

  const handleDeleteSession = async (id: number) => {
    if (confirm(i18n.grounding.confirmDelete)) {
      try {
        await deleteGroundingSession(id);
        await loadHistory();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.isComposing || e.keyCode === 229) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const stepConfig = stepConfigs[currentStep.value];
      if (index < stepConfig.count - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        nextStep();
      }
    }
  };

  const progress = ((currentStep.value + 1) / stepConfigs.length) * 100;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const { year, month, day } = i18n.grounding.dateFormat;
    if (year) {
      // Japanese format: YYYY年M月D日 HH:MM
      return `${date.getFullYear()}${year}${date.getMonth() + 1}${month}${date.getDate()}${day} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    // English format: M/D/YYYY HH:MM
    return `${date.getMonth() + 1}${month}${date.getDate()}${day}${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // WebMCP: register tools based on current screen
  useEffect(() => {
    if (!('modelContext' in navigator)) return;

    const mc = navigator.modelContext!;

    const textResult = (text: string): WebMCPToolResult => ({
      content: [{ type: 'text', text }],
    });

    const interact = <T,>(
      agent: WebMCPAgent | undefined,
      cb: () => T | Promise<T>,
    ): T | Promise<T> => (agent ? agent.requestUserInteraction(cb) : cb());

    const startTool: WebMCPTool = {
      name: 'start-grounding-session',
      description:
        'Start a new 5-4-3-2-1 grounding exercise session. The exercise guides through 5 senses: sight (5 items), touch (4), sound (3), smell (2), taste (1).',
      inputSchema: { type: 'object', properties: {} },
      execute: (_params, agent) =>
        interact(agent, () => {
          startSession();
          return textResult(
            'Grounding session started. Current step: sight (5 items). Use submit-grounding-step to provide responses.',
          );
        }),
    };

    const submitStepTool: WebMCPTool = {
      name: 'submit-grounding-step',
      description:
        'Submit responses for the current grounding step. Each step requires a specific number of text responses matching the sense category.',
      inputSchema: {
        type: 'object',
        properties: {
          responses: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Array of text responses for the current step. Must match the required count: sight=5, touch=4, sound=3, smell=2, taste=1.',
          },
        },
        required: ['responses'],
      },
      execute: (params, agent) =>
        interact(agent, async () => {
          const values = params.responses as string[];
          const step = stepConfigs[currentStep.value];
          const stepTrans = i18n.grounding.steps[step.category];

          if (values.length !== step.count) {
            return textResult(
              `Error: Expected ${step.count} responses for "${step.category}", got ${values.length}.`,
            );
          }

          const result = stepResponseSchema.safeParse(values);
          if (!result.success) {
            return textResult(`Validation error: ${result.error.issues[0].message}`);
          }

          responses.value = [
            ...responses.value,
            {
              step: currentStep.value,
              category: step.category,
              title: stepTrans.title,
              data: values,
            },
          ];

          if (currentStep.value < stepConfigs.length - 1) {
            currentStep.value++;
            const next = stepConfigs[currentStep.value];
            return textResult(
              `Step "${step.category}" completed. Next: "${next.category}" (${next.count} items).`,
            );
          }

          await saveGroundingSession({
            timestamp: new Date().toISOString(),
            responses: responses.value,
          });
          await loadHistory();
          screen.value = 'complete';
          return textResult('All steps completed! Grounding session saved.');
        }),
    };

    const getStatusTool: WebMCPTool = {
      name: 'get-grounding-status',
      description: 'Get the current state of the grounding exercise.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        const step = stepConfigs[currentStep.value];
        return textResult(
          JSON.stringify({
            screen: screen.value,
            currentStep: currentStep.value,
            category: step.category,
            requiredCount: step.count,
            completedSteps: responses.value.length,
            totalSteps: stepConfigs.length,
          }),
        );
      },
    };

    const getHistoryTool: WebMCPTool = {
      name: 'get-grounding-history',
      description: 'Retrieve all past grounding exercise sessions from IndexedDB.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        const sessions = await getGroundingSessions();
        return textResult(JSON.stringify(sessions));
      },
    };

    const cancelTool: WebMCPTool = {
      name: 'cancel-grounding-session',
      description: 'Cancel the current grounding session and return to the start screen.',
      inputSchema: { type: 'object', properties: {} },
      execute: (_params, agent) =>
        interact(agent, () => {
          screen.value = 'start';
          return textResult('Session cancelled. Returned to start screen.');
        }),
    };

    const finishTool: WebMCPTool = {
      name: 'finish-grounding',
      description: 'Dismiss the completion screen and return to start.',
      inputSchema: { type: 'object', properties: {} },
      execute: (_params, agent) =>
        interact(agent, () => {
          screen.value = 'start';
          return textResult('Returned to start screen.');
        }),
    };

    const deleteSessionTool: WebMCPTool = {
      name: 'delete-grounding-session',
      description: 'Delete a grounding session from history by its ID.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'number',
            description: 'The ID of the session to delete.',
          },
        },
        required: ['sessionId'],
      },
      execute: (params, agent) => {
        const id = params.sessionId as number;
        return interact(agent, async () => {
          await deleteGroundingSession(id);
          await loadHistory();
          return textResult(`Session ${id} deleted.`);
        });
      },
    };

    const backToStartTool: WebMCPTool = {
      name: 'back-to-start',
      description: 'Navigate from the history screen back to start.',
      inputSchema: { type: 'object', properties: {} },
      execute: (_params, agent) =>
        interact(agent, () => {
          screen.value = 'start';
          return textResult('Returned to start screen.');
        }),
    };

    const toolsByScreen: Record<Screen, WebMCPTool[]> = {
      start: [startTool, getHistoryTool],
      step: [submitStepTool, getStatusTool, cancelTool],
      complete: [finishTool, getHistoryTool],
      history: [getHistoryTool, deleteSessionTool, backToStartTool],
    };

    mc.provideContext({ tools: toolsByScreen[screen.value] });
  }, [screen.value]);

  const stepConfig = stepConfigs[currentStep.value];
  const stepI18n = i18n.grounding.steps[stepConfig.category];

  const getPlaceholder = (i: number) => {
    if (i === 1) return stepI18n.placeholderFirst;
    return stepI18n.placeholderN.replace('{n}', String(i));
  };

  return (
    <div class={styles.container} data-testid="grounding-app">
      <header class={styles.header}>
        <h1 class={styles.title}>{i18n.grounding.title}</h1>
        <p class={styles.subtitle}>{i18n.grounding.subtitle}</p>
      </header>

      <main class={styles.main} data-testid="grounding-main">
        {/* Start screen */}
        {screen.value === 'start' && (
          <div class="screen" data-testid="grounding-screen-start">
            <div class={styles.sheepWelcome}>
              <div class={`${styles.sheep} sheep`}>🐑</div>
              <p class={styles.welcomeText}>
                {i18n.grounding.welcomeText.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx === 0 && <br />}
                  </span>
                ))}
              </p>
            </div>
            <button
              class={`${styles.btn} ${styles.btnFull} ${styles.btnPrimary}`}
              onClick={startSession}
              data-testid="grounding-start-btn"
            >
              {i18n.grounding.startBtn}
            </button>
            <button
              class={`${styles.btn} ${styles.btnFull} ${styles.btnSecondary}`}
              onClick={() => (screen.value = 'history')}
              data-testid="grounding-history-btn"
            >
              {i18n.grounding.historyBtn}
            </button>
          </div>
        )}

        {/* Step screen */}
        {screen.value === 'step' && (
          <div class="screen" data-testid="grounding-screen-step">
            <div class={styles.progressBar} data-testid="grounding-progress-bar">
              <div class={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                nextStep();
              }}
              data-testid="grounding-step-form"
            >
              <fieldset class={styles.fieldset}>
                <legend class={styles.visuallyHidden}>{stepI18n.title}</legend>
                <div class={styles.stepContent}>
                  <div class={`${styles.stepSheep} sheep`}>🐑</div>
                  <h2 class={styles.stepTitle}>{stepI18n.title}</h2>
                  <p class={styles.instruction}>{stepI18n.instruction}</p>
                  <div class={styles.inputContainer}>
                    {Array.from({ length: stepConfig.count }).map((_, i) => {
                      const inputId = `grounding-input-${stepConfig.category}-${i}`;
                      const hasError = validationError.value !== null;
                      return (
                        <div class={styles.inputItem} key={i}>
                          <label htmlFor={inputId} class={styles.visuallyHidden}>
                            {i18n.grounding.accessibilityLabels.inputLabel.replace('{n}', String(i + 1))}
                          </label>
                          <input
                            id={inputId}
                            type="text"
                            class={styles.input}
                            placeholder={getPlaceholder(i + 1)}
                            data-testid={`grounding-input-${stepConfig.category}-${i}`}
                            aria-describedby={hasError ? 'grounding-validation-error' : undefined}
                            aria-invalid={hasError ? 'true' : undefined}
                            ref={(el) => {
                              if (el) inputRefs.current[i] = el;
                            }}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                          />
                        </div>
                      );
                    })}
                    {validationError.value && (
                      <div
                        id="grounding-validation-error"
                        class={styles.validationError}
                        role="alert"
                        aria-live="assertive"
                        data-testid="grounding-validation-error"
                      >
                        {validationError.value}
                      </div>
                    )}
                  </div>
                  <div class={styles.buttonGroup}>
                    <button
                      type="button"
                      class={`${styles.btn} ${styles.btnSecondary} ${styles.buttonGroupBtn}`}
                      onClick={cancelSession}
                      data-testid="grounding-cancel-btn"
                    >
                      {i18n.grounding.cancelBtn}
                    </button>
                    <button
                      type="submit"
                      class={`${styles.btn} ${styles.btnPrimary} ${styles.buttonGroupBtn}`}
                      data-testid="grounding-next-btn"
                    >
                      {i18n.grounding.nextBtn}
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        )}

        {/* Complete screen */}
        {screen.value === 'complete' && (
          <div class="screen" data-testid="grounding-screen-complete">
            <div class={styles.completeContent}>
              <div class={`${styles.sheepCelebrate} sheep-celebrate`}>🐑</div>
              <h2 class={styles.completeTitle}>{i18n.grounding.completeTitle}</h2>
              <p class={styles.completeMessage}>
                {i18n.grounding.completeMessage.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx === 0 && <br />}
                  </span>
                ))}
              </p>
              <button
                class={`${styles.btn} ${styles.btnFull} ${styles.btnPrimary}`}
                onClick={() => (screen.value = 'start')}
                data-testid="grounding-finish-btn"
              >
                {i18n.grounding.endBtn}
              </button>
            </div>
          </div>
        )}

        {/* History screen */}
        {screen.value === 'history' && (
          <div class="screen" data-testid="grounding-screen-history">
            <h2 class={styles.historyTitle}>{i18n.grounding.historyTitle}</h2>
            <div class={styles.historyList}>
              {history.value.length === 0 ? (
                <div class={styles.emptyHistory}>
                  <div class={`${styles.emptySheep} sheep`}>🐑</div>
                  <p>
                    {i18n.grounding.noHistory}
                    <br />
                    {i18n.grounding.noHistoryHint}
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
                        title={i18n.grounding.deleteTitle}
                        aria-label={`${i18n.grounding.deleteTitle}: ${formatDate(session.timestamp)}`}
                        data-testid={`grounding-delete-btn-${session.id}`}
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
            <button
              class={`${styles.btn} ${styles.btnFull} ${styles.btnSecondary}`}
              onClick={() => (screen.value = 'start')}
              data-testid="grounding-back-btn"
            >
              {i18n.grounding.backBtn}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
