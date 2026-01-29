import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";
import { registerResources } from "./resources.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "calm-tools",
    version: "0.0.1",
  });

  registerTools(server);
  registerResources(server);

  return server;
}

// Main entry point
async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
