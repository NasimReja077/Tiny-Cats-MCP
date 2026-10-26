import express from "express";
import { askAiController } from "../controller/ai.controller.ts";

const router = express.Router();

// POST /api/ai/ask  { prompt: string }
router.post("/ask", askAiController);

export default router;
