import mongoose, { Schema, Model } from "mongoose";
import type { IListing } from "../types/listing.types.ts";

const listingSchema = new Schema<IListing>(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: [true, "Cat name is required"],
      trim: true,
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
      index: true,
    },
    ageWeeks: {
      type: Number,
      required: [true, "Age in weeks is required"],
      min: [8, "Kittens must be at least 8 weeks old"],
    },
    price: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 3000,
    },
    images: { type: [String], default: [] },
    vaccinated: { type: Boolean, default: false },
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold"],
      default: "pending",
      index: true,
    },
    externalPosts: [
      {
        platform: String,
        text: String,
      },
    ],
  },
  { timestamps: true }
);

listingSchema.index({ name: "text", breed: "text", description: "text", city: "text" });
listingSchema.index({ status: 1, city: 1, breed: 1 });

export const Listing: Model<IListing> =
  mongoose.models.Listing || mongoose.model<IListing>("Listing", listingSchema);
