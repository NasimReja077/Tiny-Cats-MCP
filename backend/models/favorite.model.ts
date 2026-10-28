import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    cats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cat" }],
  },
  { timestamps: true },
);

export const FavoriteModel = mongoose.model("Favorite", favoriteSchema);
