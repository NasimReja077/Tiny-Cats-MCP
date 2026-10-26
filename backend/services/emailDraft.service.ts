import { EmailDraft, type IEmailDraft } from "../models/emailDraft.model.ts";

export const createEmailDraftService = async (data: {
  to: string;
  subject: string;
  body: string;
  userId?: string;
  relatedCattery?: string;
  relatedListing?: string;
}) => {
  if (!data.to?.trim()) throw new Error("Recipient (to) is required");
  if (!data.subject?.trim()) throw new Error("Subject is required");
  if (!data.body?.trim()) throw new Error("Body is required");

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.to.trim())) {
    throw new Error("Invalid email address");
  }

  return EmailDraft.create({
    to: data.to.trim().toLowerCase(),
    subject: data.subject.trim(),
    body: data.body.trim(),
    status: "draft",
    user: data.userId,
    relatedCattery: data.relatedCattery,
    relatedListing: data.relatedListing,
  });
};

export const getEmailDraftByIdService = async (id: string) => {
  return EmailDraft.findById(id);
};

export const listEmailDraftsService = async (userId?: string) => {
  const filter = userId ? { user: userId } : {};
  return EmailDraft.find(filter).sort({ createdAt: -1 }).limit(50);
};

/**
 * Mark draft as sent.
 * Actual sending (Nodemailer / Resend) should be wired here later.
 * For now we only flip status after the user confirms in the UI.
 */
export const markEmailSentService = async (id: string) => {
  const draft = await EmailDraft.findById(id);
  if (!draft) throw new Error("Email draft not found");
  if (draft.status === "sent") throw new Error("Email already sent");

  // TODO: integrate Nodemailer or Resend
  // await sendWithProvider({ to: draft.to, subject: draft.subject, body: draft.body });

  draft.status = "sent";
  draft.sentAt = new Date();
  await draft.save();
  return draft;
};
