import { App, PostMessageTransport } from "@modelcontextprotocol/ext-apps";

export type ExerciseType = "breath" | "grounding";
export type BreathPattern = "555" | "478";

export interface ExerciseConfig {
  exercise?: ExerciseType;
  pattern?: BreathPattern;
  duration?: number;
  locale?: "en" | "ja";
}

export interface BreathResult {
  exercise: "breath";
  pattern: BreathPattern;
  duration: number;
  completedCycles: number;
}

export interface GroundingResult {
  exercise: "grounding";
  responses: {
    see: string[];
    touch: string[];
    hear: string[];
    smell: string[];
    taste: string[];
  };
}

export type SessionResult = BreathResult | GroundingResult;

// Events emitted to Claude
export type CalmEvent =
  | { type: "session_start"; exercise: ExerciseType }
  | { type: "phase_change"; phase: "inhale" | "hold" | "exhale" }
  | { type: "session_complete"; result: SessionResult }
  | { type: "session_abort"; reason?: string }
  | { type: "need_help"; context: string };

// Messages received from Claude
export type ClaudeMessage =
  | { type: "guidance"; text: string }
  | { type: "encouragement"; text: string };

// Callback types
export type OnConfigReceived = (config: ExerciseConfig) => void;
export type OnMessageReceived = (message: ClaudeMessage) => void;

class CalmBridge {
  private app: App | null = null;
  private onConfig: OnConfigReceived | null = null;
  private onMessage: OnMessageReceived | null = null;
  private connected = false;

  async connect(): Promise<void> {
    if (this.connected) return;

    this.app = new App(
      { name: "CalmTools", version: "0.0.1" },
      {}, // capabilities
      { autoResize: true }
    );

    // Handle tool input (exercise config from Claude)
    this.app.ontoolinput = (params) => {
      const args = params.arguments as ExerciseConfig | undefined;
      if (args && this.onConfig) {
        this.onConfig(args);
      }
    };

    // Handle host context changes (theme, locale)
    this.app.onhostcontextchanged = (params) => {
      if (params.theme) {
        document.documentElement.dataset.theme = params.theme;
      }
    };

    // Handle teardown
    this.app.onteardown = async () => {
      console.log("CalmTools: teardown requested");
      return {};
    };

    try {
      // Connect using PostMessageTransport (for iframe communication)
      const transport = new PostMessageTransport(window.parent, window);
      await this.app.connect(transport);
      this.connected = true;

      // Apply initial theme from host context
      const context = this.app.getHostContext();
      if (context?.theme) {
        document.documentElement.dataset.theme = context.theme;
      }

      // Get initial config from tool context
      const toolInfo = context?.toolInfo;
      if (toolInfo?.arguments && this.onConfig) {
        this.onConfig(toolInfo.arguments as ExerciseConfig);
      }
    } catch (error) {
      console.warn("CalmTools: Failed to connect to host, running standalone", error);
      // Running standalone (not in MCP host)
    }
  }

  setOnConfig(callback: OnConfigReceived): void {
    this.onConfig = callback;
  }

  setOnMessage(callback: OnMessageReceived): void {
    this.onMessage = callback;
  }

  async sendEvent(event: CalmEvent): Promise<void> {
    if (!this.app || !this.connected) {
      console.log("CalmTools event (standalone):", event);
      return;
    }

    try {
      // Send event as model context update
      await this.app.updateModelContext({
        content: [
          {
            type: "text",
            text: JSON.stringify(event),
          },
        ],
      });

      // For session_complete, also send a message to trigger Claude's response
      if (event.type === "session_complete") {
        const result = event.result;
        let message: string;

        if (result.exercise === "breath") {
          message = `Breathing exercise completed: ${result.completedCycles} cycles of ${result.pattern} pattern in ${Math.round(result.duration / 60)} minutes.`;
        } else {
          message = `Grounding exercise completed. I identified: ${result.responses.see.length} things I see, ${result.responses.touch.length} things I touch, ${result.responses.hear.length} things I hear, ${result.responses.smell.length} things I smell, and ${result.responses.taste.length} thing I taste.`;
        }

        await this.app.sendMessage({
          role: "user",
          content: [{ type: "text", text: message }],
        });
      }
    } catch (error) {
      console.error("CalmTools: Failed to send event", error);
    }
  }

  getLocale(): "en" | "ja" {
    if (this.app && this.connected) {
      const context = this.app.getHostContext();
      if (context?.locale?.startsWith("ja")) {
        return "ja";
      }
    }
    // Fallback to browser language
    return navigator.language.startsWith("ja") ? "ja" : "en";
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Singleton instance
export const bridge = new CalmBridge();
