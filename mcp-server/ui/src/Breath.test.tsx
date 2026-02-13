import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/preact";
import { Breath } from "./Breath";

// Mock the bridge module
vi.mock("./bridge", () => ({
  bridge: {
    sendEvent: vi.fn(),
  },
}));

describe("Breath Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders idle state with pattern and duration controls", () => {
    render(<Breath locale="en" />);

    expect(screen.getByTestId("breath-exercise")).toBeDefined();
    expect(screen.getByTestId("pattern-555")).toBeDefined();
    expect(screen.getByTestId("pattern-478")).toBeDefined();
    expect(screen.getByTestId("duration-60")).toBeDefined();
    expect(screen.getByTestId("duration-180")).toBeDefined();
    expect(screen.getByTestId("duration-300")).toBeDefined();
    expect(screen.getByTestId("breath-start")).toBeDefined();
  });

  it("starts breathing exercise when start button is clicked", async () => {
    const { bridge } = await import("./bridge");

    render(<Breath locale="en" />);

    fireEvent.click(screen.getByTestId("breath-start"));

    expect(bridge.sendEvent).toHaveBeenCalledWith({
      type: "session_start",
      exercise: "breath",
    });
    expect(bridge.sendEvent).toHaveBeenCalledWith({
      type: "phase_change",
      phase: "inhale",
    });
    expect(screen.getByTestId("breath-phase").textContent).toBe("Inhale");
  });

  it("shows stop button during exercise", () => {
    render(<Breath locale="en" />);

    fireEvent.click(screen.getByTestId("breath-start"));

    expect(screen.getByTestId("breath-stop")).toBeDefined();
  });

  it("stops exercise when stop button is clicked", async () => {
    const { bridge } = await import("./bridge");

    render(<Breath locale="en" />);

    fireEvent.click(screen.getByTestId("breath-start"));
    fireEvent.click(screen.getByTestId("breath-stop"));

    expect(bridge.sendEvent).toHaveBeenCalledWith({
      type: "session_abort",
      reason: "user_stopped",
    });
  });

  it("changes pattern when pattern button is clicked", () => {
    render(<Breath locale="en" />);

    const pattern478 = screen.getByTestId("pattern-478");
    fireEvent.click(pattern478);

    expect(pattern478.classList.contains("active")).toBe(true);
  });

  it("changes duration when duration button is clicked", () => {
    render(<Breath locale="en" />);

    const duration60 = screen.getByTestId("duration-60");
    fireEvent.click(duration60);

    expect(duration60.classList.contains("active")).toBe(true);
  });

  it("renders in Japanese when locale is ja", () => {
    render(<Breath locale="ja" />);

    expect(screen.getByTestId("breath-start").textContent).toBe("開始");
  });

  // TODO: Fix fake timer interaction with Preact Signals
  it.skip("progresses through breathing phases", async () => {
    const { bridge } = await import("./bridge");

    render(<Breath locale="en" />);

    // Select 5-5-5 pattern (default) and start
    fireEvent.click(screen.getByTestId("breath-start"));

    // Initial phase should be inhale
    expect(screen.getByTestId("breath-phase").textContent).toBe("Inhale");

    // Advance through inhale (5 seconds - need 5 ticks of 1 second each)
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(1000);
    }

    // Should be in hold phase
    expect(screen.getByTestId("breath-phase").textContent).toBe("Hold");
    expect(bridge.sendEvent).toHaveBeenCalledWith({
      type: "phase_change",
      phase: "hold",
    });

    // Advance through hold (5 seconds)
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(1000);
    }

    // Should be in exhale phase
    expect(screen.getByTestId("breath-phase").textContent).toBe("Exhale");
    expect(bridge.sendEvent).toHaveBeenCalledWith({
      type: "phase_change",
      phase: "exhale",
    });
  });
});
