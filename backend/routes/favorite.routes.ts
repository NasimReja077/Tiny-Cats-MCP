import express from "express";
import {
  getFavoritesController,
  clearFavoritesController,
  setFavoriteController,
} from "../controller/favorite.controller.ts";
import { requireClerkAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.use(requireClerkAuth);
router.get("/", getFavoritesController);
router.delete("/", clearFavoritesController);
router.patch("/:id", setFavoriteController);

export default router;
