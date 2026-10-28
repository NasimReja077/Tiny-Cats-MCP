import type { Request, Response } from "express";
import { generateAiResponse } from "../services/groq.service.ts";

/**
 * POST /api/ai/ask
 * Body: { prompt: string }
 */
export const askAiController = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt;

    if (
      !prompt ||
      typeof prompt !== "string" ||
      !prompt.trim() ||
      prompt.length > 4000
    ) {
      return res.status(400).json({
        success: false,
        message: "prompt is required and must be 1–4000 characters",
      });
    }

    const result = await generateAiResponse(prompt.trim());

    return res.status(200).json({
      success: true,
      message: "AI responded",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    return res.status(500).json({ success: false, message });
  }
};
