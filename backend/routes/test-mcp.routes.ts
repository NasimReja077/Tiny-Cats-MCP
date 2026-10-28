import express from "express";
import {
  testMcpController,
  listMcpToolsController,
  callMcpToolController,
} from "../controller/test-mcp.controller.ts";

const router = express.Router();

// GET  /api/mcp/test-mcp   — demo: call tool + Groq summary
router.get("/test-mcp", testMcpController);

// GET  /api/mcp/tools      — list available MCP tools
router.get("/tools", listMcpToolsController);

// POST /api/mcp/call  — generic tool call { name, arguments }
router.post("/call", callMcpToolController);

export default router;
