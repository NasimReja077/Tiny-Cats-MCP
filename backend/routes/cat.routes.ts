import express from "express";
import {
  createCatController,
  deleteCatController,
  getAllCatsController,
  getSingleCatController,
  recommendCatsController,
  rankCatsController,
  searchCatController,
  updateCatImageController,
} from "../controller/cat.controller.ts";
import { requireClerkAuth } from "../middlewares/auth.middleware.ts";
import { uploadCatImage } from "../middlewares/upload.middleware.ts";

const router = express.Router();

// Create
router.post("/create", requireClerkAuth, uploadCatImage, createCatController);

// Search (must be before /:id)
router.get("/search/all", searchCatController);

// Exact-match recommend (legacy)
router.post("/recommend", recommendCatsController);

// Score-based ranking
router.post("/rank", rankCatsController);

// Update a cat's image
router.patch(
  "/:id/image",
  requireClerkAuth,
  uploadCatImage,
  updateCatImageController,
);

router.delete("/:id", requireClerkAuth, deleteCatController);

// List all
router.get("/", getAllCatsController);

// Get one by id (keep last among GETs)
router.get("/:id", getSingleCatController);

export default router;
