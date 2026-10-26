import express from "express";
import {
  createCatController,
  getAllCatsController,
  getSingleCatController,
  recommendCatsController,
  rankCatsController,
  searchCatController,
} from "../controller/cat.controller.ts";

const router = express.Router();

// Create
router.post("/create", createCatController);

// Search (must be before /:id)
router.get("/search/all", searchCatController);

// Exact-match recommend (legacy)
router.post("/recommend", recommendCatsController);

// Score-based ranking
router.post("/rank", rankCatsController);

// List all
router.get("/", getAllCatsController);

// Get one by id (keep last among GETs)
router.get("/:id", getSingleCatController);

export default router;
