import mongoose from "mongoose";
import type { IUser } from "../types/user.types.ts";


const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never return in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cat",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;