import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { uploadCatImage } from "../services/storage.service.ts";
import {
  getSingleCatService,
  createCatService,
  getAllCatsService,
  searchCatsService,
  recommendService,
  rankCatsService,
  updateCatImageService,
  deleteCatService,
} from "../services/cat.service.ts";

export const createCatController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  const body = req.body ?? {};
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.breed !== "string" ||
    !body.breed.trim() ||
    typeof body.description !== "string" ||
    !body.description.trim() ||
    !["low", "medium", "high"].includes(body.energyLevel)
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, breed, description, and a valid energyLevel are required",
    });
  }

  const allowedFields = [
    "name",
    "breed",
    "description",
    "energyLevel",
    "lifeSpan",
    "kidsFriendly",
    "apartmentFriendly",
    "color",
    "size",
    "aggressionLevel",
    "foodHabits",
    "tailSize",
    "grooming",
    "sheddingLevel",
    "vocalization",
    "hypoallergenic",
    "goodWithDogs",
    "goodWithOtherCats",
    "indoorOnly",
    "aloneTolerance",
    "isAvailable",
  ] as const;
  const payload: Record<string, unknown> = { createdByClerkId: userId };
  for (const field of allowedFields) {
    if (body[field] !== undefined) payload[field] = body[field];
  }
  if (req.file) {
    const uploadedImage = await uploadCatImage(req.file.buffer, req.file.originalname);
    payload.image = uploadedImage.url;
  }
  const result = await createCatService(payload);

  return res.status(201).json({
    success: true,
    message: "Cat created",
    data: result,
  });
};

export const deleteCatController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  const id = req.params.id as string;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid cat ID" });
  }

  const deletedCat = await deleteCatService(id, userId);
  if (!deletedCat) {
    const cat = await getSingleCatService(id);
    return res.status(cat ? 403 : 404).json({
      success: false,
      message: cat ? "You can only delete cats you created" : "Cat not found",
    });
  }
  return res.status(200).json({ success: true, message: "Cat deleted" });
};

export const getAllCatsController = async (_req: Request, res: Response) => {
  let result = await getAllCatsService();

  return res.status(200).json({
    success: true,
    message: "Cats fetched",
    data: result,
  });
};

export const getSingleCatController = async (req: Request, res: Response) => {
  let id = req.params.id as string;

  let result = await getSingleCatService(id);

  return res.status(200).json({
    success: true,
    message: "Cat fetched",
    data: result,
  });
};

export const searchCatController = async (req: Request, res: Response) => {
  let q = req.query.q as string;

  console.log(q);

  let result = await searchCatsService(q);

  return res.status(200).json({
    success: true,
    message: "Cats fetched",
    data: result,
  });
};

export const recommendCatsController = async (req: Request, res: Response) => {
  const { kidsFriendly, apartmentFriendly } = req.body;

  const result = await recommendService(kidsFriendly, apartmentFriendly);

  return res.status(200).json({
    success: true,
    message: "Cat fetched",
    data: result,
  });
};

export const rankCatsController = async (req: Request, res: Response) => {
  const result = await rankCatsService(req.body);

  return res.status(200).json({
    success: true,
    message: "Cats ranked",
    data: result,
  });
};

export const updateCatImageController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid cat ID" });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  const cat = await getSingleCatService(id);
  if (!cat) {
    return res.status(404).json({ success: false, message: "Cat not found" });
  }
  const { userId } = getAuth(req);
  if (cat.createdByClerkId !== userId) {
    return res.status(403).json({
      success: false,
      message: "You can only update images for cats you created",
    });
  }

  const uploadedImage = await uploadCatImage(req.file.buffer, req.file.originalname);
  const updatedCat = await updateCatImageService(id, uploadedImage.url);

  return res.status(200).json({
    success: true,
    message: "Cat image updated",
    data: updatedCat,
  });
};