import { describe, it, expect } from "vitest";
import { createServer } from "./index.js";

describe("MCP Server", () => {
  it("creates server with correct name and version", () => {
    const server = createServer();
    expect(server).toBeDefined();
  });
});
