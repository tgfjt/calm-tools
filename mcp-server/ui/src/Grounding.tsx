import { useEffect, useRef, useCallback } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { bridge, type GroundingResult } from "./bridge";

interface Props {
  locale: "en" | "ja";
}

type Screen = "start" | "step" | "complete";

interface Step {
  key: "see" | "touch" | "hear" | "smell" | "taste";
  count: number;
}

const steps: Step[] = [
  { key: "see", count: 5 },
  { key: "touch", count: 4 },
  { key: "hear", count: 3 },
  { key: "smell", count: 2 },
  { key: "taste", count: 1 },
];

const translations = {
  en: {
    title: "54321 Grounding",
    description: "This technique helps you stay present by engaging your senses.",
    start: "Start",
    next: "Next",
    finish: "Finish",
    restart: "Try Again",
    complete: "Well Done!",
    wellDone: "You've completed the grounding exercise. Take a moment to notice how you feel.",
    steps: {
      see: (n: number) => `Name ${n} things you can SEE`,
      touch: (n: number) => `Name ${n} things you can TOUCH`,
      hear: (n: number) => `Name ${n} things you can HEAR`,
      smell: (n: number) => `Name ${n} things you can SMELL`,
      taste: (n: number) => `Name ${n} thing you can TASTE`,
    },
    placeholders: {
      see: "I see...",
      touch: "I can touch...",
      hear: "I hear...",
      smell: "I smell...",
      taste: "I taste...",
    },
  },
  ja: {
    title: "54321グラウンディング",
    description: "五感を使って今この瞬間に意識を向けるテクニックです。",
    start: "開始",
    next: "次へ",
    finish: "完了",
    restart: "もう一度",
    complete: "お疲れさまでした！",
    wellDone: "グラウンディングエクササイズが完了しました。今の気持ちに意識を向けてみてください。",
    steps: {
      see: (n: number) => `見えるものを${n}つ挙げてください`,
      touch: (n: number) => `触れるものを${n}つ挙げてください`,
      hear: (n: number) => `聞こえるものを${n}つ挙げてください`,
      smell: (n: number) => `匂いがするものを${n}つ挙げてください`,
      taste: (n: number) => `味がするものを${n}つ挙げてください`,
    },
    placeholders: {
      see: "見えるもの...",
      touch: "触れるもの...",
      hear: "聞こえるもの...",
      smell: "匂い...",
      taste: "味...",
    },
  },
};

export function Grounding({ locale }: Props) {
  const screen = useSignal<Screen>("start");
  const currentStepIndex = useSignal(0);
  const responses = useSignal<Record<string, string[]>>({
    see: [],
    touch: [],
    hear: [],
    smell: [],
    taste: [],
  });
  const currentInputs = useSignal<string[]>([]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const t = useComputed(() => translations[locale]);
  const currentStep = useComputed(() => steps[currentStepIndex.value]);

  // Initialize inputs when step changes
  useEffect(() => {
    if (screen.value === "step") {
      currentInputs.value = Array(currentStep.value.count).fill("");
      // Focus first input after render
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [currentStepIndex.value, screen.value]);

  const startExercise = useCallback(() => {
    screen.value = "step";
    currentStepIndex.value = 0;
    responses.value = {
      see: [],
      touch: [],
      hear: [],
      smell: [],
      taste: [],
    };
    bridge.sendEvent({ type: "session_start", exercise: "grounding" });
  }, []);

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const newInputs = [...currentInputs.value];
      newInputs[index] = value;
      currentInputs.value = newInputs;
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (index < currentStep.value.count - 1) {
          inputRefs.current[index + 1]?.focus();
        } else {
          nextStep();
        }
      }
    },
    []
  );

  const nextStep = useCallback(() => {
    const step = currentStep.value;
    const filledInputs = currentInputs.value.filter((v) => v.trim() !== "");

    // Save responses
    const newResponses = { ...responses.value };
    newResponses[step.key] = filledInputs;
    responses.value = newResponses;

    if (currentStepIndex.value < steps.length - 1) {
      currentStepIndex.value += 1;
    } else {
      // Complete
      screen.value = "complete";

      const result: GroundingResult = {
        exercise: "grounding",
        responses: {
          see: newResponses.see,
          touch: newResponses.touch,
          hear: newResponses.hear,
          smell: newResponses.smell,
          taste: newResponses.taste,
        },
      };
      bridge.sendEvent({ type: "session_complete", result });
    }
  }, []);

  const restart = useCallback(() => {
    screen.value = "start";
    currentStepIndex.value = 0;
  }, []);

  const canProceed = useComputed(() => {
    return currentInputs.value.some((v) => v.trim() !== "");
  });

  if (screen.value === "start") {
    return (
      <div class="grounding-container" data-testid="grounding-start">
        <div class="complete-container">
          <div class="complete-icon">🌿</div>
          <h2 class="complete-title">{t.value.title}</h2>
          <p class="complete-message">{t.value.description}</p>
          <button class="start-btn" onClick={startExercise} data-testid="grounding-start-btn">
            {t.value.start}
          </button>
        </div>
      </div>
    );
  }

  if (screen.value === "complete") {
    return (
      <div class="grounding-container" data-testid="grounding-complete">
        <div class="complete-container">
          <div class="complete-icon">✨</div>
          <h2 class="complete-title">{t.value.complete}</h2>
          <p class="complete-message">{t.value.wellDone}</p>
          <button class="restart-btn" onClick={restart} data-testid="grounding-restart">
            {t.value.restart}
          </button>
        </div>
      </div>
    );
  }

  const step = currentStep.value;
  const stepTitle = t.value.steps[step.key](step.count);
  const placeholder = t.value.placeholders[step.key];
  const isLastStep = currentStepIndex.value === steps.length - 1;

  return (
    <div class="grounding-container" data-testid="grounding-step">
      <div class="grounding-progress">
        {steps.map((s, i) => (
          <div
            key={s.key}
            class={`progress-dot ${i === currentStepIndex.value ? "active" : ""} ${i < currentStepIndex.value ? "complete" : ""}`}
            data-testid={`progress-${s.key}`}
          />
        ))}
      </div>

      <div class="grounding-step">
        <h3 class="step-title" data-testid="step-title">
          {stepTitle}
        </h3>

        <div class="step-inputs">
          {Array.from({ length: step.count }, (_, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              class="step-input"
              placeholder={placeholder}
              value={currentInputs.value[i] || ""}
              onInput={(e) => handleInputChange(i, (e.target as HTMLInputElement).value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              data-testid={`input-${step.key}-${i}`}
            />
          ))}
        </div>

        <button
          class="next-btn"
          onClick={nextStep}
          disabled={!canProceed.value}
          data-testid="grounding-next"
        >
          {isLastStep ? t.value.finish : t.value.next}
        </button>
      </div>
    </div>
  );
}
