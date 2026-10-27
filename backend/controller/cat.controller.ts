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
} from "../services/cat.service.ts";

export const createCatController = async (req: Request, res: Response) => {
  let result = await createCatService(req.body);

  return res.status(201).json({
    success: true,
    message: "Cat created",
    data: result,
  });
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

  const uploadedImage = await uploadCatImage(req.file.buffer, req.file.originalname);
  const updatedCat = await updateCatImageService(id, uploadedImage.url);

  return res.status(200).json({
    success: true,
    message: "Cat image updated",
    data: updatedCat,
  });
};