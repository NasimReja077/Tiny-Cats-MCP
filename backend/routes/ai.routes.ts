import express from "express";
import { askAiController } from "../controller/ai.controller.ts";
import { requireClerkAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

// POST /api/ai/ask  { prompt: string }
router.post("/ask", requireClerkAuth, askAiController);

export default router;
