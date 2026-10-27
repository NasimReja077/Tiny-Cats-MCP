import type { Types } from "mongoose";

export type AdoptionStatus = "pending" | "approved" | "rejected";

export interface IAdoptionRequest {
  cat: Types.ObjectId;
  user: Types.ObjectId;
  phone: string;
  message?: string;
  status: AdoptionStatus;
  createdAt: Date;
  updatedAt: Date;
}