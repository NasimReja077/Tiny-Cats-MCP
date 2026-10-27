import express from "express";
import { updateProfileController } from "../controller/profile.controller.ts";
import { requireClerkAuth } from "../middlewares/auth.middleware.ts";
import { uploadProfileImage } from "../middlewares/upload.middleware.ts";

const router = express.Router();

router.patch(
  "/",
  requireClerkAuth,
  uploadProfileImage,
  updateProfileController,
);

export default router;
