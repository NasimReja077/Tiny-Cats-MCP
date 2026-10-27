import mongoose, { Schema, Model } from "mongoose";
import type { ICattery } from "../types/cattery.types.ts";

const catterySchema = new Schema<ICattery>(
  {
    name: {
      type: String,
      required: [true, "Cattery name is required"],
      trim: true,
      index: true,
    },
    website: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    breeds: { type: [String], default: [] },
    availableKittens: { type: String, trim: true },
    sourceUrls: {
      type: [String],
      default: [],
      validate: {
        validator: (urls: string[]) =>
          urls.every((u) => /^https?:\/\//i.test(u)),
        message: "sourceUrls must be http(s) URLs",
      },
    },
    confidence: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, trim: true },
    foundAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

catterySchema.index({ name: "text", location: "text" });

export const Cattery: Model<ICattery> =
  mongoose.models.Cattery ?? mongoose.model<ICattery>("Cattery", catterySchema);
