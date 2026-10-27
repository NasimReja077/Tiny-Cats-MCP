import mongoose, { Schema } from "mongoose";
import type { IAdoptionRequest } from "../types/adoptionRequest.types.ts";


const adoptionRequestSchema = new Schema<IAdoptionRequest>(
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
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdoptionRequestModel = mongoose.model<IAdoptionRequest>(
  "adoptionRequest",
  adoptionRequestSchema
);
export default AdoptionRequestModel;