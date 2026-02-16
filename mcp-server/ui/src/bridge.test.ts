import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ExerciseConfig, BreathResult, GroundingResult } from "./bridge";

// Test the bridge types and event structures
describe("Bridge Types", () => {
  it("ExerciseConfig accepts valid breath config", () => {
    const config: ExerciseConfig = {
      exercise: "breath",
      pattern: "478",
      duration: 180,
      locale: "ja",
    };

    expect(config.exercise).toBe("breath");
    expect(config.pattern).toBe("478");
    expect(config.duration).toBe(180);
    expect(config.locale).toBe("ja");
  });

  it("ExerciseConfig accepts valid grounding config", () => {
    const config: ExerciseConfig = {
      exercise: "grounding",
      locale: "en",
    };

    expect(config.exercise).toBe("grounding");
    expect(config.locale).toBe("en");
  });

  it("BreathResult has correct structure", () => {
    const result: BreathResult = {
      exercise: "breath",
      pattern: "555",
      duration: 300,
      completedCycles: 5,
    };

    expect(result.exercise).toBe("breath");
    expect(result.pattern).toBe("555");
    expect(result.duration).toBe(300);
    expect(result.completedCycles).toBe(5);
  });

  it("GroundingResult has correct structure", () => {
    const result: GroundingResult = {
      exercise: "grounding",
      responses: {
        see: ["desk", "monitor", "plant", "window", "book"],
        touch: ["keyboard", "mouse", "chair", "desk"],
        hear: ["fan", "traffic", "typing"],
        smell: ["coffee", "air freshener"],
        taste: ["water"],
      },
    };

    expect(result.exercise).toBe("grounding");
    expect(result.responses.see).toHaveLength(5);
    expect(result.responses.touch).toHaveLength(4);
    expect(result.responses.hear).toHaveLength(3);
    expect(result.responses.smell).toHaveLength(2);
    expect(result.responses.taste).toHaveLength(1);
  });
});

// Test the CalmEvent types
describe("CalmEvent Types", () => {
  it("session_start event has correct structure", () => {
    const event = { type: "session_start" as const, exercise: "breath" as const };
    expect(event.type).toBe("session_start");
    expect(event.exercise).toBe("breath");
  });

  it("phase_change event has correct structure", () => {
    const event = { type: "phase_change" as const, phase: "inhale" as const };
    expect(event.type).toBe("phase_change");
    expect(event.phase).toBe("inhale");
  });

  it("session_complete event has correct structure", () => {
    const result: BreathResult = {
      exercise: "breath",
      pattern: "478",
      duration: 180,
      completedCycles: 3,
    };
    const event = { type: "session_complete" as const, result };
    expect(event.type).toBe("session_complete");
    expect(event.result.exercise).toBe("breath");
  });

  it("session_abort event has correct structure", () => {
    const event = { type: "session_abort" as const, reason: "user_stopped" };
    expect(event.type).toBe("session_abort");
    expect(event.reason).toBe("user_stopped");
  });

  it("need_help event has correct structure", () => {
    const event = { type: "need_help" as const, context: "feeling anxious" };
    expect(event.type).toBe("need_help");
    expect(event.context).toBe("feeling anxious");
  });
});

// Test ClaudeMessage types
describe("ClaudeMessage Types", () => {
  it("guidance message has correct structure", () => {
    const message = { type: "guidance" as const, text: "Breathe slowly..." };
    expect(message.type).toBe("guidance");
    expect(message.text).toBe("Breathe slowly...");
  });

  it("encouragement message has correct structure", () => {
    const message = { type: "encouragement" as const, text: "Great job!" };
    expect(message.type).toBe("encouragement");
    expect(message.text).toBe("Great job!");
  });
});
