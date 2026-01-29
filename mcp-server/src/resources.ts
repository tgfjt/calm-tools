import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getUiHtml(): string {
  const uiPath = join(__dirname, "ui", "index.html");

  if (existsSync(uiPath)) {
    return readFileSync(uiPath, "utf-8");
  }

  // Fallback for development - return placeholder
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calm Tools</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  </style>
</head>
<body>
  <div>
    <h1>Calm Tools</h1>
    <p>UI is being built...</p>
  </div>
</body>
</html>`;
}

export function registerResources(server: McpServer): void {
  // Resource: ui://calm - The main calm tools UI
  server.resource("ui://calm", "Calm Tools UI - Breathing and Grounding exercises", async () => {
    const html = getUiHtml();
    return {
      contents: [
        {
          uri: "ui://calm",
          mimeType: "text/html",
          text: html,
        },
      ],
    };
  });
}
