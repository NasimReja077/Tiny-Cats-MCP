import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getAllCatsTool,
  getCatByIdTool,
  recommendCatsTool,
  searchCatsTool,
} from "./tools/recommendCats.tool.ts";

const server = new McpServer({
  name: "tiny-cats",
  version: "1.1.0",
});

// ── recommend_cats (score-based rank) ───────────────────────────────
server.registerTool(
  "recommend_cats",
  {
    title: "Recommend cats",
    description:
      "Rank cats from the Tiny Cats database against lifestyle preferences. " +
      "Returns matchScore (0-100), reasons, and tradeOffs. " +
      "Send only the preferences the user mentioned (at least one required). " +
      "Use when the user asks for cat recommendations by kids, apartment, energy, size, etc.",
    inputSchema: {
      kidsFriendly: z
        .boolean()
        .optional()
        .describe("true if the home has children"),
      apartmentFriendly: z
        .boolean()
        .optional()
        .describe("true if the user lives in an apartment"),
      energyLevel: z
        .enum(["low", "medium", "high"])
        .optional()
        .describe("Desired activity level"),
      size: z
        .enum(["small", "medium", "large"])
        .optional()
        .describe("Desired body size"),
      minLifeSpan: z
        .number()
        .min(1)
        .max(40)
        .optional()
        .describe("Minimum life span in years"),
      lowAggression: z
        .boolean()
        .optional()
        .describe("Prefer calm / low-aggression cats"),
      limit: z
        .number()
        .min(1)
        .max(20)
        .optional()
        .describe("How many cats to return (default 5)"),
      minScore: z
        .number()
        .min(0)
        .max(100)
        .optional()
        .describe("Hide cats scoring below this (default 0)"),
    },
  },
  async (args) => {
    const hasOne =
      args.kidsFriendly !== undefined ||
      args.apartmentFriendly !== undefined ||
      args.energyLevel !== undefined ||
      args.size !== undefined ||
      args.minLifeSpan !== undefined ||
      args.lowAggression !== undefined;

    if (!hasOne) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              isError: true,
              message: "At least one preference is required",
            }),
          },
        ],
        isError: true,
      };
    }

    const result = await recommendCatsTool({
      ...(args.kidsFriendly !== undefined
        ? { kidsFriendly: args.kidsFriendly }
        : {}),
      ...(args.apartmentFriendly !== undefined
        ? { apartmentFriendly: args.apartmentFriendly }
        : {}),
      ...(args.energyLevel !== undefined ? { energyLevel: args.energyLevel } : {}),
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.minLifeSpan !== undefined ? { minLifeSpan: args.minLifeSpan } : {}),
      ...(args.lowAggression !== undefined
        ? { lowAggression: args.lowAggression }
        : {}),
      limit: args.limit ?? 5,
      minScore: args.minScore ?? 0,
    });

    const isError = Boolean(
      result && typeof result === "object" && "isError" in result && result.isError
    );

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      isError,
    };
  }
);

// ── get_all_cats ────────────────────────────────────────────────────
server.registerTool(
  "get_all_cats",
  {
    title: "Get all cats",
    description:
      "Return every cat in the Tiny Cats database. Use when the user wants a full list or overview.",
    inputSchema: {},
  },
  async () => {
    const result = await getAllCatsTool();
    const isError = Boolean(
      result && typeof result === "object" && "isError" in result && result.isError
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      isError,
    };
  }
);

// ── search_cats ─────────────────────────────────────────────────────
server.registerTool(
  "search_cats",
  {
    title: "Search cats",
    description:
      "Search cats by name or breed (case-insensitive). Use when the user looks for a specific name or breed.",
    inputSchema: {
      query: z.string().min(1).describe("Name or breed search text"),
      limit: z
        .number()
        .min(1)
        .max(50)
        .optional()
        .describe("Max results (default 10)"),
    },
  },
  async ({ query, limit }) => {
    const result = await searchCatsTool(query, limit ?? 10);
    const isError = Boolean(
      result && typeof result === "object" && "isError" in result && result.isError
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      isError,
    };
  }
);

// ── get_cat_by_id ───────────────────────────────────────────────────
server.registerTool(
  "get_cat_by_id",
  {
    title: "Get cat by ID",
    description:
      "Return one cat with full details by its MongoDB id. Use when you already have a cat id.",
    inputSchema: {
      id: z.string().min(1).describe("Cat MongoDB ObjectId"),
    },
  },
  async ({ id }) => {
    const result = await getCatByIdTool(id);
    const isError = Boolean(
      result && typeof result === "object" && "isError" in result && result.isError
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      isError,
    };
  }
);

// ── start ───────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("tiny-cats MCP server running (stdio)");
