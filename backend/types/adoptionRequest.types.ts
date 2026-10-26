import type mongoose from "mongoose";

export type AdoptionStatus = "pending" | "approved" | "rejected";

export interface IAdoptionRequest extends Document {
  cat: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  phone: string;
  message?: string;
  status: AdoptionStatus;
  createdAt: Date;
  updatedAt: Date;
}