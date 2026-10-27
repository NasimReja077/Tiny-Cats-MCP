import type { Types } from "mongoose";

export interface ICattery {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  breeds: string[];
  availableKittens?: string;
  sourceUrls: string[];
  confidence: number;
  notes?: string;
  foundAt: Date;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
