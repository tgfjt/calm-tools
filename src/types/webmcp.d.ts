interface WebMCPToolContent {
  type: 'text';
  text: string;
}

interface WebMCPToolResult {
  content: WebMCPToolContent[];
}

interface WebMCPAgent {
  requestUserInteraction<T>(cb: () => T | Promise<T>): Promise<T>;
}

interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute(
    params: Record<string, unknown>,
    agent: WebMCPAgent,
  ): WebMCPToolResult | Promise<WebMCPToolResult>;
}

interface ModelContext {
  provideContext(ctx: { tools: WebMCPTool[] }): void;
  registerTool(tool: WebMCPTool): void;
  unregisterTool(name: string): void;
}

interface Navigator {
  readonly modelContext?: ModelContext;
}
