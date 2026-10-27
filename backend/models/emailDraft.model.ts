import mongoose, { Schema, Model } from "mongoose";
import type { IEmailDraft } from "../types/emailDraft.types.ts";

const emailDraftSchema = new Schema<IEmailDraft>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    to: {
      type: String,
      required: [true, "Recipient email is required"],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      trim: true,
      maxlength: 10000,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "failed"],
      default: "draft",
      index: true,
    },
    relatedCattery: { type: Schema.Types.ObjectId, ref: "Cattery" },
    relatedListing: { type: Schema.Types.ObjectId, ref: "Listing" },
    sentAt: { type: Date },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const EmailDraft: Model<IEmailDraft> =
  mongoose.models.EmailDraft ??
  mongoose.model<IEmailDraft>("EmailDraft", emailDraftSchema);
