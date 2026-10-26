import type { Request, Response } from "express";
import { aiRecommendService } from "../services/aiRecommend.service.ts";
import type { RankPreferences } from "../services/cat.service.ts";

/**
 * POST /api/aiRecommend/recommendByAi
 * Body: RankPreferences (kidsFriendly, apartmentFriendly, energyLevel, ...)
 * Returns: { ranked, aiResponse }
 */
export const aiRecommendController = async (req: Request, res: Response) => {
  try {
    const prefs: RankPreferences = {
      kidsFriendly: req.body.kidsFriendly,
      apartmentFriendly: req.body.apartmentFriendly,
      energyLevel: req.body.energyLevel,
      size: req.body.size,
      minLifeSpan: req.body.minLifeSpan,
      lowAggression: req.body.lowAggression,
      limit: req.body.limit ?? 5,
      minScore: req.body.minScore,
    };

    const hasPreference =
      prefs.kidsFriendly !== undefined ||
      prefs.apartmentFriendly !== undefined ||
      prefs.energyLevel !== undefined ||
      prefs.size !== undefined ||
      prefs.minLifeSpan !== undefined ||
      prefs.lowAggression !== undefined;

    if (!hasPreference) {
      return res.status(400).json({
        success: false,
        message: "At least one preference is required",
      });
    }

    const { ranked, aiResponse } = await aiRecommendService(prefs);

    return res.status(200).json({
      success: true,
      message: "AI recommendation ready",
      count: ranked.results.length,
      data: {
        ranked,
        aiResponse,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI recommendation failed";
    return res.status(500).json({ success: false, message });
  }
};
