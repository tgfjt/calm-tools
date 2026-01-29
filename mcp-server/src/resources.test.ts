import { describe, it, expect, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerResources } from "./resources.js";

describe("Resources", () => {
  it("registers ui://calm resource", () => {
    const mockResource = vi.fn();
    const mockServer = {
      resource: mockResource,
    } as unknown as McpServer;

    registerResources(mockServer);

    expect(mockResource).toHaveBeenCalledTimes(1);

    const resourceCall = mockResource.mock.calls[0];
    expect(resourceCall[0]).toBe("ui://calm");
    expect(resourceCall[1]).toContain("Calm Tools");
  });

  it("ui://calm resource handler returns HTML", async () => {
    let resourceHandler: Function | undefined;
    const mockServer = {
      resource: vi.fn((_uri, _desc, handler) => {
        resourceHandler = handler;
      }),
    } as unknown as McpServer;

    registerResources(mockServer);

    const result = await resourceHandler!();

    expect(result.contents).toHaveLength(1);
    expect(result.contents[0].uri).toBe("ui://calm");
    expect(result.contents[0].mimeType).toBe("text/html");
    expect(result.contents[0].text).toContain("<!DOCTYPE html>");
    expect(result.contents[0].text).toContain("Calm Tools");
  });
});
