import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const OpenCalmSchema = z.object({
  exercise: z.enum(["breath", "grounding"]).describe("Which exercise to open"),
  config: z
    .object({
      pattern: z.enum(["555", "478"]).optional().describe("Breathing pattern"),
      duration: z.number().optional().describe("Duration in seconds"),
      locale: z.enum(["en", "ja"]).optional().describe("UI language"),
    })
    .optional()
    .describe("Exercise configuration"),
});

const SendGuidanceSchema = z.object({
  message: z.string().describe("Message to display in the UI"),
  type: z
    .enum(["guidance", "encouragement"])
    .optional()
    .default("guidance")
    .describe("Message type"),
});

export function registerTools(server: McpServer): void {
  // Tool: open_calm - Opens the calm exercise UI
  server.tool(
    "open_calm",
    "Open a calming exercise UI. Choose 'breath' for breathing exercises (5-5-5 or 4-7-8 patterns) or 'grounding' for 54321 grounding technique.",
    OpenCalmSchema.shape,
    async ({ exercise, config }) => {
      return {
        content: [
          {
            type: "text",
            text: `Opening ${exercise} exercise${config ? ` with config: ${JSON.stringify(config)}` : ""}...`,
          },
        ],
        // UI resource association for MCP Apps
        _meta: {
          ui: "ui://calm",
          uiContext: { exercise, config },
        },
      };
    }
  );

  // Tool: send_guidance - Sends a message to the UI
  server.tool(
    "send_guidance",
    "Send a guidance or encouragement message to display in the Calm Tools UI.",
    SendGuidanceSchema.shape,
    async ({ message, type }) => {
      return {
        content: [
          {
            type: "text",
            text: `Sent ${type} message to UI: "${message}"`,
          },
        ],
        _meta: {
          uiMessage: { type, message },
        },
      };
    }
  );
}
