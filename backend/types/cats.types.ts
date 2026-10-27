import type { Types } from "mongoose";

export type EnergyLevel = "low" | "medium" | "high";
export type Size = "small" | "medium" | "large";
export type AggressionLevel = "low" | "medium" | "high";
export type GroomingLevel = "low" | "medium" | "high";
export type SheddingLevel = "low" | "medium" | "high";
export type Vocalization = "quiet" | "moderate" | "vocal";
export type AloneTolerance = "low" | "medium" | "high";

export interface ICat {
  name: string;
  breed: string;
  description: string;
  energyLevel: EnergyLevel;
  lifeSpan: number;
  kidsFriendly: boolean;
  apartmentFriendly: boolean;
  image?: string;
  color?: string;
  size?: Size;
  aggressionLevel?: AggressionLevel;
  foodHabits?: string;
  tailSize?: string;
  grooming?: GroomingLevel;
  sheddingLevel?: SheddingLevel;
  vocalization?: Vocalization;
  hypoallergenic?: boolean;
  goodWithDogs?: boolean;
  goodWithOtherCats?: boolean;
  indoorOnly?: boolean;
  aloneTolerance?: AloneTolerance;
  isAvailable?: boolean;
  isDeleted?: boolean;
  createdBy?: Types.ObjectId;
  avgRating?: number;
  reviewCount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}