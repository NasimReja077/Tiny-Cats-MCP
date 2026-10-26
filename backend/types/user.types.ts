import type mongoose from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}