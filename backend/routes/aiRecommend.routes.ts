import express from "express";
import { aiRecommendController } from "../controller/aiRecommend.controller.ts";
import { requireClerkAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

// POST /api/aiRecommend/recommendByAi
// Body: RankPreferences (kidsFriendly, apartmentFriendly, energyLevel, size, ...)
router.post("/recommendByAi", requireClerkAuth, aiRecommendController);

export default router;
