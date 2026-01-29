import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/preact";
import { Grounding } from "./Grounding";

// Mock the bridge module
vi.mock("./bridge", () => ({
  bridge: {
    sendEvent: vi.fn(),
  },
}));

describe("Grounding Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders start screen initially", () => {
    render(<Grounding locale="en" />);

    expect(screen.getByTestId("grounding-start")).toBeDefined();
    expect(screen.getByTestId("grounding-start-btn")).toBeDefined();
    expect(screen.getByText("54321 Grounding")).toBeDefined();
  });

  it("starts exercise when start button is clicked", async () => {
    const { bridge } = await import("./bridge");

    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    expect(bridge.sendEvent).toHaveBeenCalledWith({
      type: "session_start",
      exercise: "grounding",
    });
    expect(screen.getByTestId("grounding-step")).toBeDefined();
  });

  it("shows 5 inputs for the first step (see)", async () => {
    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("input-see-0")).toBeDefined();
      expect(screen.getByTestId("input-see-1")).toBeDefined();
      expect(screen.getByTestId("input-see-2")).toBeDefined();
      expect(screen.getByTestId("input-see-3")).toBeDefined();
      expect(screen.getByTestId("input-see-4")).toBeDefined();
    });
  });

  it("disables next button when no inputs are filled", async () => {
    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    await waitFor(() => {
      const nextBtn = screen.getByTestId("grounding-next");
      expect(nextBtn.hasAttribute("disabled")).toBe(true);
    });
  });

  it("enables next button when at least one input is filled", async () => {
    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    await waitFor(() => {
      const input = screen.getByTestId("input-see-0") as HTMLInputElement;
      fireEvent.input(input, { target: { value: "desk" } });
    });

    const nextBtn = screen.getByTestId("grounding-next");
    expect(nextBtn.hasAttribute("disabled")).toBe(false);
  });

  it("progresses to next step when next button is clicked", async () => {
    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    await waitFor(() => {
      const input = screen.getByTestId("input-see-0") as HTMLInputElement;
      fireEvent.input(input, { target: { value: "desk" } });
    });

    fireEvent.click(screen.getByTestId("grounding-next"));

    // Should now show touch step with 4 inputs
    await waitFor(() => {
      expect(screen.getByTestId("input-touch-0")).toBeDefined();
      expect(screen.getByTestId("input-touch-1")).toBeDefined();
      expect(screen.getByTestId("input-touch-2")).toBeDefined();
      expect(screen.getByTestId("input-touch-3")).toBeDefined();
    });
  });

  it("shows progress dots correctly", async () => {
    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    await waitFor(() => {
      const seeDot = screen.getByTestId("progress-see");
      expect(seeDot.classList.contains("active")).toBe(true);
    });
  });

  it("completes exercise after all steps", async () => {
    const { bridge } = await import("./bridge");

    render(<Grounding locale="en" />);

    fireEvent.click(screen.getByTestId("grounding-start-btn"));

    // Step 1: see (5 inputs)
    await waitFor(() => {
      fireEvent.input(screen.getByTestId("input-see-0"), { target: { value: "desk" } });
    });
    fireEvent.click(screen.getByTestId("grounding-next"));

    // Step 2: touch (4 inputs)
    await waitFor(() => {
      fireEvent.input(screen.getByTestId("input-touch-0"), { target: { value: "keyboard" } });
    });
    fireEvent.click(screen.getByTestId("grounding-next"));

    // Step 3: hear (3 inputs)
    await waitFor(() => {
      fireEvent.input(screen.getByTestId("input-hear-0"), { target: { value: "fan" } });
    });
    fireEvent.click(screen.getByTestId("grounding-next"));

    // Step 4: smell (2 inputs)
    await waitFor(() => {
      fireEvent.input(screen.getByTestId("input-smell-0"), { target: { value: "coffee" } });
    });
    fireEvent.click(screen.getByTestId("grounding-next"));

    // Step 5: taste (1 input)
    await waitFor(() => {
      fireEvent.input(screen.getByTestId("input-taste-0"), { target: { value: "water" } });
    });
    fireEvent.click(screen.getByTestId("grounding-next"));

    // Should show complete screen
    await waitFor(() => {
      expect(screen.getByTestId("grounding-complete")).toBeDefined();
    });

    expect(bridge.sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "session_complete",
        result: expect.objectContaining({
          exercise: "grounding",
        }),
      })
    );
  });

  it("renders in Japanese when locale is ja", () => {
    render(<Grounding locale="ja" />);

    expect(screen.getByText("54321グラウンディング")).toBeDefined();
    expect(screen.getByTestId("grounding-start-btn").textContent).toBe("開始");
  });
});
