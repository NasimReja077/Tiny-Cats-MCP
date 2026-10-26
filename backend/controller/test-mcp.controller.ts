import type { Request, Response } from "express";
import { getMcpClient, callMcpTool, listMcpTools } from "../services/mcp.service.ts";
import { generateAiResponse } from "../services/gemini.service.ts";

/**
 * GET /api/mcp/test-mcp
 * Demo: list tools → call recommend_cats → summarize with Gemini
 */
export const testMcpController = async (req: Request, res: Response) => {
  try {
    // Optional overrides from query or body
    const kidsFriendly =
      req.body?.kidsFriendly ?? req.query?.kidsFriendly === "true" ?? true;
    const apartmentFriendly =
      req.body?.apartmentFriendly ?? req.query?.apartmentFriendly === "true" ?? true;

    // 1. List tools (debug)
    const tools = await listMcpTools();

    // 2. Call MCP tool
    const result = await callMcpTool("recommend_cats", {
      kidsFriendly: Boolean(kidsFriendly),
      apartmentFriendly: Boolean(apartmentFriendly),
      limit: 5,
    });

    // 3. Extract text content safely
    const content = result.content as Array<{ type: string; text?: string }>;
    const catsData =
      content?.[0]?.type === "text" && content[0].text
        ? content[0].text
        : JSON.stringify(result);

    // 4. Ask Gemini to summarize
    const prompt = `
You are a helpful cat adoption advisor.

Here are ranked cats from our MCP tool (JSON):
${catsData}

Write a short, friendly recommendation:
- Highlight the top 1–3 matches
- Mention why they fit (kids / apartment / energy if present)
- Keep it under 200 words
- Use Markdown with clear headings
`;

    const aiResponse = await generateAiResponse(prompt);

    return res.status(200).json({
      success: true,
      message: "MCP + Gemini demo",
      data: {
        tools: tools.tools?.map((t) => t.name) ?? [],
        mcpResult: catsData,
        aiResponse,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "MCP test failed. Is the backend and mcp_server path correct?";
    return res.status(500).json({
      success: false,
      message,
    });
  }
};

/**
 * GET /api/mcp/tools
 * List available MCP tools only
 */
export const listMcpToolsController = async (_req: Request, res: Response) => {
  try {
    const tools = await listMcpTools();
    return res.status(200).json({
      success: true,
      data: tools.tools ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list tools";
    return res.status(500).json({ success: false, message });
  }
};

/**
 * POST /api/mcp/call
 * Body: { name: string, arguments?: object }
 * Generic MCP tool caller
 */
export const callMcpToolController = async (req: Request, res: Response) => {
  try {
    const { name, arguments: args = {} } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Tool 'name' is required",
      });
    }

    const result = await callMcpTool(name, args);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "MCP call failed";
    return res.status(500).json({ success: false, message });
  }
};
