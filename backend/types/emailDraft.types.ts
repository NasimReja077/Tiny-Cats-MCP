import type { Document, Types } from "mongoose";

export type EmailDraftStatus = "draft" | "sent" | "failed";

export interface IEmailDraft extends Document {
  user?: Types.ObjectId;
  to: string;
  subject: string;
  body: string;
  status: EmailDraftStatus;
  relatedCattery?: Types.ObjectId;
  relatedListing?: Types.ObjectId;
  sentAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
