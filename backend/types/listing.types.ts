import type { Types } from "mongoose";

export type ListingStatus = "pending" | "approved" | "rejected" | "sold";

export interface IListing {
  seller?: Types.ObjectId;
  name: string;
  breed: string;
  ageWeeks: number;
  price?: number;
  currency: string;
  city: string;
  description: string;
  images: string[];
  vaccinated: boolean;
  contactPhone?: string;
  contactEmail?: string;
  status: ListingStatus;
  externalPosts?: { platform: string; text: string }[];
  createdAt: Date;
  updatedAt: Date;
}
