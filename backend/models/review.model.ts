import mongoose, { Schema } from "mongoose";
import type { IReview } from "../types/review.types.ts";


const reviewSchema = new Schema<IReview>(
  {
    cat: {
      type: Schema.Types.ObjectId,
      ref: "Cat",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per cat
reviewSchema.index({ cat: 1, user: 1 }, { unique: true });

const ReviewModel = mongoose.model<IReview>("review", reviewSchema);

export default ReviewModel;
