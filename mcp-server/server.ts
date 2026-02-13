import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";

console.log("Starting Calm Tools MCP Apps server...");

const server = new McpServer({
  name: "calm-tools",
  version: "0.0.1",
});

// Resource URIs
const breathResourceUri = "ui://calm-tools/breath.html";
const groundingResourceUri = "ui://calm-tools/grounding.html";

// Tool: open_breath - Opens the breathing exercise UI
registerAppTool(
  server,
  "open_breath",
  {
    title: "Open Breath Exercise",
    description:
      "Open a breathing exercise UI. Supports 5-5-5 (inhale-hold-exhale 5 seconds each) or 4-7-8 (inhale 4, hold 7, exhale 8) patterns.",
    inputSchema: {},
    _meta: { ui: { resourceUri: breathResourceUri } },
  },
  async () => {
    const data = { exercise: "breath", pattern: "555", locale: "ja" };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: data,
    };
  }
);

// Tool: open_grounding - Opens the grounding exercise UI
registerAppTool(
  server,
  "open_grounding",
  {
    title: "Open Grounding Exercise",
    description:
      "Open a 54321 grounding exercise UI. Helps users focus on 5 things they see, 4 they touch, 3 they hear, 2 they smell, 1 they taste.",
    inputSchema: {},
    _meta: { ui: { resourceUri: groundingResourceUri } },
  },
  async () => {
    const data = { exercise: "grounding", locale: "ja" };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: data,
    };
  }
);

// Tool: send_guidance - Sends a message to the UI
registerAppTool(
  server,
  "send_guidance",
  {
    title: "Send Guidance",
    description:
      "Send a guidance or encouragement message to display in the Calm Tools UI during an exercise.",
    inputSchema: {},
    _meta: {},
  },
  async () => {
    const data = { type: "guidance", message: "Keep going!" };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: data,
    };
  }
);

// Helper to read bundled HTML
async function readBundledHtml(): Promise<string> {
  const htmlPath = path.join(import.meta.dirname, "dist", "ui", "index.html");
  try {
    return await fs.readFile(htmlPath, "utf-8");
  } catch {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Calm Tools</title>
  <style>
    body { font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #1a1a2e; color: white; }
  </style>
</head>
<body>
  <div>
    <h1>Calm Tools</h1>
    <p>Run <code>npm run build</code> first.</p>
  </div>
</body>
</html>`;
  }
}

// Resource: breath UI
registerAppResource(
  server,
  breathResourceUri,
  breathResourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    const html = await readBundledHtml();
    return {
      contents: [{ uri: breathResourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  }
);

// Resource: grounding UI
registerAppResource(
  server,
  groundingResourceUri,
  groundingResourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    const html = await readBundledHtml();
    return {
      contents: [{ uri: groundingResourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  }
);

// Express HTTP server
const app = express();
app.use(cors());
app.use(express.json());

// UIからのログを受け取る
app.post("/log", (req, res) => {
  console.log("[UI LOG]", req.body);
  res.json({ ok: true });
});

app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Calm Tools MCP server listening on http://localhost:${PORT}/mcp`);
  console.log("");
  console.log("To connect to Claude:");
  console.log("  1. Run: npm run tunnel");
  console.log("  2. Copy the cloudflared URL");
  console.log("  3. Add as Custom Connector in Claude Settings");
});
