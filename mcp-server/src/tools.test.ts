import { describe, it, expect, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools.js";

describe("Tools", () => {
  it("registers open_calm and send_guidance tools", () => {
    const mockTool = vi.fn();
    const mockServer = {
      tool: mockTool,
    } as unknown as McpServer;

    registerTools(mockServer);

    expect(mockTool).toHaveBeenCalledTimes(2);

    // Check open_calm registration
    const openCalmCall = mockTool.mock.calls[0];
    expect(openCalmCall[0]).toBe("open_calm");
    expect(openCalmCall[1]).toContain("calming exercise");

    // Check send_guidance registration
    const sendGuidanceCall = mockTool.mock.calls[1];
    expect(sendGuidanceCall[0]).toBe("send_guidance");
    expect(sendGuidanceCall[1]).toContain("guidance");
  });

  it("open_calm handler returns correct response for breath", async () => {
    let toolHandler: Function | undefined;
    const mockServer = {
      tool: vi.fn((_name, _desc, _schema, handler) => {
        if (_name === "open_calm") {
          toolHandler = handler;
        }
      }),
    } as unknown as McpServer;

    registerTools(mockServer);

    const result = await toolHandler!({
      exercise: "breath",
      config: { pattern: "478", duration: 180 },
    });

    expect(result.content[0].text).toContain("breath");
    expect(result._meta?.ui).toBe("ui://calm");
    expect(result._meta?.uiContext?.exercise).toBe("breath");
    expect(result._meta?.uiContext?.config?.pattern).toBe("478");
  });

  it("open_calm handler returns correct response for grounding", async () => {
    let toolHandler: Function | undefined;
    const mockServer = {
      tool: vi.fn((_name, _desc, _schema, handler) => {
        if (_name === "open_calm") {
          toolHandler = handler;
        }
      }),
    } as unknown as McpServer;

    registerTools(mockServer);

    const result = await toolHandler!({ exercise: "grounding" });

    expect(result.content[0].text).toContain("grounding");
    expect(result._meta?.ui).toBe("ui://calm");
    expect(result._meta?.uiContext?.exercise).toBe("grounding");
  });

  it("send_guidance handler returns correct response", async () => {
    let toolHandler: Function | undefined;
    const mockServer = {
      tool: vi.fn((_name, _desc, _schema, handler) => {
        if (_name === "send_guidance") {
          toolHandler = handler;
        }
      }),
    } as unknown as McpServer;

    registerTools(mockServer);

    const result = await toolHandler!({
      message: "Take a deep breath",
      type: "encouragement",
    });

    expect(result.content[0].text).toContain("encouragement");
    expect(result.content[0].text).toContain("Take a deep breath");
    expect(result._meta?.uiMessage?.type).toBe("encouragement");
  });
});
