import { useEffect, useRef, useCallback } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { bridge, type BreathPattern, type BreathResult } from "./bridge";

interface Props {
  locale: "en" | "ja";
}

type Phase = "idle" | "inhale" | "hold" | "exhale" | "complete";

const patterns: Record<BreathPattern, { inhale: number; hold: number; exhale: number }> = {
  "555": { inhale: 5, hold: 5, exhale: 5 },
  "478": { inhale: 4, hold: 7, exhale: 8 },
};

const durations = [60, 180, 300]; // 1, 3, 5 minutes

const translations = {
  en: {
    start: "Start",
    stop: "Stop",
    restart: "Restart",
    inhale: "Inhale",
    hold: "Hold",
    exhale: "Exhale",
    complete: "Complete!",
    pattern555: "5-5-5",
    pattern478: "4-7-8",
    duration1: "1 min",
    duration3: "3 min",
    duration5: "5 min",
    cycles: (n: number) => `${n} cycles completed`,
    wellDone: "Great job! Take a moment to notice how you feel.",
  },
  ja: {
    start: "開始",
    stop: "停止",
    restart: "もう一度",
    inhale: "吸う",
    hold: "止める",
    exhale: "吐く",
    complete: "完了！",
    pattern555: "5-5-5",
    pattern478: "4-7-8",
    duration1: "1分",
    duration3: "3分",
    duration5: "5分",
    cycles: (n: number) => `${n}サイクル完了`,
    wellDone: "お疲れさまでした。今の気持ちに意識を向けてみてください。",
  },
};

export function Breath({ locale }: Props) {
  const pattern = useSignal<BreathPattern>("555");
  const targetDuration = useSignal(180);
  const phase = useSignal<Phase>("idle");
  const countdown = useSignal(0);
  const elapsedTime = useSignal(0);
  const completedCycles = useSignal(0);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const t = useComputed(() => translations[locale]);
  const currentPattern = useComputed(() => patterns[pattern.value]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextPhase = useCallback(() => {
    const p = currentPattern.value;

    if (phase.value === "inhale") {
      phase.value = "hold";
      countdown.value = p.hold;
      bridge.sendEvent({ type: "phase_change", phase: "hold" });
    } else if (phase.value === "hold") {
      phase.value = "exhale";
      countdown.value = p.exhale;
      bridge.sendEvent({ type: "phase_change", phase: "exhale" });
    } else if (phase.value === "exhale") {
      completedCycles.value += 1;

      // Check if we've reached the target duration
      if (elapsedTime.value >= targetDuration.value) {
        clearTimer();
        phase.value = "complete";

        const result: BreathResult = {
          exercise: "breath",
          pattern: pattern.value,
          duration: elapsedTime.value,
          completedCycles: completedCycles.value,
        };
        bridge.sendEvent({ type: "session_complete", result });
      } else {
        // Start next cycle
        phase.value = "inhale";
        countdown.value = p.inhale;
        bridge.sendEvent({ type: "phase_change", phase: "inhale" });
      }
    }
  }, [currentPattern, clearTimer]);

  const tick = useCallback(() => {
    if (phase.value === "idle" || phase.value === "complete") return;

    elapsedTime.value = Math.floor((Date.now() - startTimeRef.current) / 1000);

    if (countdown.value > 1) {
      countdown.value -= 1;
    } else {
      nextPhase();
    }
  }, [nextPhase]);

  const start = useCallback(() => {
    const p = currentPattern.value;

    phase.value = "inhale";
    countdown.value = p.inhale;
    elapsedTime.value = 0;
    completedCycles.value = 0;
    startTimeRef.current = Date.now();

    bridge.sendEvent({ type: "session_start", exercise: "breath" });
    bridge.sendEvent({ type: "phase_change", phase: "inhale" });

    clearTimer();
    timerRef.current = window.setInterval(tick, 1000);
  }, [currentPattern, clearTimer, tick]);

  const stop = useCallback(() => {
    clearTimer();
    phase.value = "idle";
    countdown.value = 0;
    bridge.sendEvent({ type: "session_abort", reason: "user_stopped" });
  }, [clearTimer]);

  const restart = useCallback(() => {
    phase.value = "idle";
    countdown.value = 0;
    elapsedTime.value = 0;
    completedCycles.value = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  if (phase.value === "complete") {
    return (
      <div class="complete-container" data-testid="breath-complete">
        <div class="complete-icon">🧘</div>
        <h2 class="complete-title">{t.value.complete}</h2>
        <p class="complete-message">{t.value.cycles(completedCycles.value)}</p>
        <p class="complete-message">{t.value.wellDone}</p>
        <button class="restart-btn" onClick={restart} data-testid="breath-restart">
          {t.value.restart}
        </button>
      </div>
    );
  }

  const isRunning = phase.value !== "idle";
  const phaseLabel =
    phase.value === "inhale"
      ? t.value.inhale
      : phase.value === "hold"
        ? t.value.hold
        : phase.value === "exhale"
          ? t.value.exhale
          : "";

  return (
    <div class="breath-container" data-testid="breath-exercise">
      <div class={`breath-circle ${phase.value}`} data-testid="breath-circle">
        {isRunning && <span class="breath-timer">{countdown.value}</span>}
      </div>

      {isRunning && (
        <div class="breath-info">
          <div class="breath-phase" data-testid="breath-phase">
            {phaseLabel}
          </div>
        </div>
      )}

      <div class="breath-controls">
        {!isRunning && (
          <>
            <div class="control-group">
              <button
                class={`control-btn ${pattern.value === "555" ? "active" : ""}`}
                onClick={() => (pattern.value = "555")}
                data-testid="pattern-555"
              >
                {t.value.pattern555}
              </button>
              <button
                class={`control-btn ${pattern.value === "478" ? "active" : ""}`}
                onClick={() => (pattern.value = "478")}
                data-testid="pattern-478"
              >
                {t.value.pattern478}
              </button>
            </div>

            <div class="control-group">
              {durations.map((d) => (
                <button
                  key={d}
                  class={`control-btn ${targetDuration.value === d ? "active" : ""}`}
                  onClick={() => (targetDuration.value = d)}
                  data-testid={`duration-${d}`}
                >
                  {d === 60 ? t.value.duration1 : d === 180 ? t.value.duration3 : t.value.duration5}
                </button>
              ))}
            </div>
          </>
        )}

        <button
          class="start-btn"
          onClick={isRunning ? stop : start}
          data-testid={isRunning ? "breath-stop" : "breath-start"}
        >
          {isRunning ? t.value.stop : t.value.start}
        </button>
      </div>
    </div>
  );
}
