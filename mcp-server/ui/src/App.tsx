import { useEffect } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";
import { bridge, type ExerciseType, type ClaudeMessage } from "./bridge";
import { Breath } from "./Breath";
import { Grounding } from "./Grounding";
import "./styles.css";

const translations = {
  en: {
    title: "Calm Tools",
    breath: "Breath",
    grounding: "Grounding",
    connecting: "Connecting...",
  },
  ja: {
    title: "Calm Tools",
    breath: "呼吸",
    grounding: "グラウンディング",
    connecting: "接続中...",
  },
};

export function App() {
  const exercise = useSignal<ExerciseType>("breath");
  const locale = useSignal<"en" | "ja">("en");
  const guidance = useSignal<string | null>(null);
  const ready = useSignal(false);

  const t = useComputed(() => translations[locale.value]);

  useEffect(() => {
    // Set up config handler
    bridge.setOnConfig((config) => {
      if (config.exercise) {
        exercise.value = config.exercise;
      }
      if (config.locale) {
        locale.value = config.locale;
      }
    });

    // Set up message handler
    bridge.setOnMessage((message: ClaudeMessage) => {
      if (message.type === "guidance" || message.type === "encouragement") {
        guidance.value = message.text;
        // Clear guidance after 5 seconds
        setTimeout(() => {
          guidance.value = null;
        }, 5000);
      }
    });

    // Connect to host
    bridge.connect().then(() => {
      locale.value = bridge.getLocale();
      ready.value = true;
    });
  }, []);

  if (!ready.value) {
    return (
      <div class="app loading">
        <p>{t.value.connecting}</p>
      </div>
    );
  }

  return (
    <div class="app">
      <header class="header">
        <h1>{t.value.title}</h1>
        <nav class="tabs">
          <button
            class={`tab ${exercise.value === "breath" ? "active" : ""}`}
            onClick={() => (exercise.value = "breath")}
            data-testid="tab-breath"
          >
            {t.value.breath}
          </button>
          <button
            class={`tab ${exercise.value === "grounding" ? "active" : ""}`}
            onClick={() => (exercise.value = "grounding")}
            data-testid="tab-grounding"
          >
            {t.value.grounding}
          </button>
        </nav>
      </header>

      <main class="main">
        {exercise.value === "breath" ? (
          <Breath locale={locale.value} />
        ) : (
          <Grounding locale={locale.value} />
        )}
      </main>

      {guidance.value && (
        <div class="guidance" data-testid="guidance">
          <p>{guidance.value}</p>
        </div>
      )}
    </div>
  );
}
