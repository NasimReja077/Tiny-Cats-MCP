import { EmailDraft } from "../models/emailDraft.model.ts";
import { createTransport } from "nodemailer";

export class EmailDraftError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "EmailDraftError";
  }
}

export const createEmailDraftService = async (data: {
  to: string;
  subject: string;
  body: string;
  userId: string;
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
    ...(data.relatedCattery ? { relatedCattery: data.relatedCattery } : {}),
    ...(data.relatedListing ? { relatedListing: data.relatedListing } : {}),
  });
};

export const getEmailDraftByIdService = async (id: string, userId: string) => {
  return EmailDraft.findOne({ _id: id, user: userId });
};

export const listEmailDraftsService = async (userId: string) => {
  return EmailDraft.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
};

const createSmtpTransport = () => {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !from) {
    throw new EmailDraftError(
      "Email is not configured. Set SMTP_HOST and EMAIL_FROM in backend/.env.",
      503,
    );
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new EmailDraftError("SMTP_PORT must be a valid port number.", 503);
  }
  if (Boolean(user) !== Boolean(pass)) {
    throw new EmailDraftError(
      "Set both SMTP_USER and SMTP_PASSWORD, or leave both unset.",
      503,
    );
  }

  return {
    transport: createTransport({
      host,
      port,
      secure,
      ...(user && pass ? { auth: { user, pass } } : {}),
    }),
    from,
  };
};

export const markEmailSentService = async (id: string, userId: string) => {
  const draft = await EmailDraft.findOne({ _id: id, user: userId });
  if (!draft) throw new EmailDraftError("Email draft not found", 404);
  if (draft.status === "sent") {
    throw new EmailDraftError("Email already sent", 409);
  }

  try {
    const { transport, from } = createSmtpTransport();
    await transport.sendMail({
      from,
      to: draft.to,
      subject: draft.subject,
      text: draft.body,
    });

    draft.status = "sent";
    draft.sentAt = new Date();
    draft.errorMessage = undefined;
    await draft.save();
    return draft;
  } catch (error) {
    draft.status = "failed";
    draft.errorMessage =
      error instanceof Error ? error.message : "Email delivery failed";
    await draft.save();

    if (error instanceof EmailDraftError) throw error;
    throw new EmailDraftError(`Failed to send email: ${draft.errorMessage}`, 502);
  }
};
