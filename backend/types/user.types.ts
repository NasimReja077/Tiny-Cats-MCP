import type { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  favorites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}