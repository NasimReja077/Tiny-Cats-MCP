import mongoose from "mongoose";
import type { ICat } from "../types/cats.types.ts";

const catSchema = new mongoose.Schema<ICat>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    energyLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Energy level is required"],
      index: true,
    },
    lifeSpan: {
      type: Number,
      default: 12,
      min: 1,
      max: 40,
    },
    kidsFriendly: {
      type: Boolean,
      default: true,
      index: true,
    },
    apartmentFriendly: {
      type: Boolean,
      default: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
      index: true,
    },
    aggressionLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    foodHabits: {
      type: String,
      trim: true,
    },
    tailSize: {
      type: String,
      default: "medium",
      trim: true,
    },
    // Expanded recommendation fields
    grooming: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    sheddingLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    vocalization: {
      type: String,
      enum: ["quiet", "moderate", "vocal"],
      default: "moderate",
    },
    hypoallergenic: {
      type: Boolean,
      default: false,
    },
    goodWithDogs: {
      type: Boolean,
      default: false,
    },
    goodWithOtherCats: {
      type: Boolean,
      default: true,
    },
    indoorOnly: {
      type: Boolean,
      default: true,
    },
    aloneTolerance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
catSchema.index({ name: "text", breed: "text", description: "text" });
catSchema.index({ kidsFriendly: 1, apartmentFriendly: 1 });
catSchema.index({ energyLevel: 1, size: 1 });
catSchema.index({ isAvailable: 1, isDeleted: 1 });

const CatModel = mongoose.model("Cat", catSchema);

export default CatModel;