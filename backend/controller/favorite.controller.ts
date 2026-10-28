import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { FavoriteModel } from "../models/favorite.model.ts";
import CatModel from "../models/cat.model.ts";

export const getFavoritesController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const favorites = await FavoriteModel.findOne({ clerkUserId: userId })
    .populate({ path: "cats", match: { isDeleted: { $ne: true } } })
    .lean();

  return res.status(200).json({
    success: true,
    data: favorites?.cats ?? [],
  });
};

export const setFavoriteController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const catId = req.params.id as string;
  const { favorite } = req.body as { favorite?: unknown };

  if (!mongoose.isValidObjectId(catId)) {
    return res.status(400).json({ success: false, message: "Invalid cat ID" });
  }
  if (typeof favorite !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "favorite must be a boolean",
    });
  }
  const catExists = await CatModel.exists({
    _id: catId,
    isDeleted: { $ne: true },
  });
  if (!catExists) {
    return res.status(404).json({ success: false, message: "Cat not found" });
  }

  if (favorite) {
    await FavoriteModel.updateOne(
      { clerkUserId: userId },
      { $setOnInsert: { clerkUserId: userId }, $addToSet: { cats: catId } },
      { upsert: true },
    );
  } else {
    await FavoriteModel.updateOne(
      { clerkUserId: userId },
      { $pull: { cats: catId } },
    );
  }

  return res.status(200).json({
    success: true,
    data: { catId, favorite },
  });
};

export const clearFavoritesController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  await FavoriteModel.updateOne(
    { clerkUserId: userId },
    { $set: { cats: [] } },
  );
  return res.status(200).json({ success: true, data: [] });
};
