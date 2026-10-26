import express from "express";
import { aiRecommendController } from "../controller/aiRecommend.controller.ts";

const router = express.Router();

// POST /api/aiRecommend/recommendByAi
// Body: RankPreferences (kidsFriendly, apartmentFriendly, energyLevel, size, ...)
router.post("/recommendByAi", aiRecommendController);

export default router;
