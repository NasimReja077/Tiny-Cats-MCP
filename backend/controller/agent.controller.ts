import type { Request, Response } from "express";
import { runAgent } from "../services/agent.service.ts";
import {
  getCatteryByIdService,
  listCatteriesService,
  searchCatteriesService,
} from "../services/cattery.service.ts";
import {
  createListingService,
  getListingByIdService,
  searchListingsService,
  updateListingStatusService,
  generateExternalPostService,
} from "../services/listing.service.ts";
import {
  getEmailDraftByIdService,
  listEmailDraftsService,
  markEmailSentService,
} from "../services/emailDraft.service.ts";

// ---------- Agent chat ----------
export const agentChatController = async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (h: { role?: string; text?: string }) =>
              (h.role === "user" || h.role === "assistant") &&
              typeof h.text === "string"
          )
          .map((h: { role: "user" | "assistant"; text: string }) => ({
            role: h.role,
            text: h.text,
          }))
      : [];

    const result = await runAgent(safeHistory, message.trim());

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Agent failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

// ---------- Catteries ----------
export const getCatteryController = async (req: Request, res: Response) => {
  try {
    const cattery = await getCatteryByIdService(req.params.id as string);
    if (!cattery) {
      return res.status(404).json({ success: false, message: "Cattery not found" });
    }
    return res.status(200).json({ success: true, data: cattery });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

export const listCatteriesController = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined;
    const data = q
      ? await searchCatteriesService(q)
      : await listCatteriesService(Number(req.query.limit) || 20);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

// ---------- Listings ----------
export const createListingController = async (req: Request, res: Response) => {
  try {
    const listing = await createListingService(req.body);
    return res.status(201).json({
      success: true,
      message: "Listing created (pending review)",
      data: listing,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create listing";
    return res.status(400).json({ success: false, message: msg });
  }
};

export const getListingController = async (req: Request, res: Response) => {
  try {
    const listing = await getListingByIdService(req.params.id as string);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    return res.status(200).json({ success: true, data: listing });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

export const searchListingsController = async (req: Request, res: Response) => {
  try {
    const data = await searchListingsService({
      q: req.query.q as string | undefined,
      city: req.query.city as string | undefined,
      breed: req.query.breed as string | undefined,
      status: (req.query.status as "approved" | "pending") || "approved",
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

export const updateListingStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected", "sold"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const listing = await updateListingStatusService(
      req.params.id as string,
      status
    );
    return res.status(200).json({ success: true, data: listing });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(400).json({ success: false, message: msg });
  }
};

export const generatePostController = async (req: Request, res: Response) => {
  try {
    const listing = await getListingByIdService(req.params.id as string);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    const platform = (req.body.platform || "generic") as
      | "facebook"
      | "olx"
      | "instagram"
      | "generic";
    const post = generateExternalPostService(listing, platform);
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

// ---------- Email drafts ----------
export const getEmailDraftController = async (req: Request, res: Response) => {
  try {
    const draft = await getEmailDraftByIdService(req.params.id as string);
    if (!draft) {
      return res.status(404).json({ success: false, message: "Draft not found" });
    }
    return res.status(200).json({ success: true, data: draft });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

export const listEmailDraftsController = async (_req: Request, res: Response) => {
  try {
    const data = await listEmailDraftsService();
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return res.status(500).json({ success: false, message: msg });
  }
};

/**
 * User presses "Send" in the UI → we mark as sent.
 * Wire real email provider inside markEmailSentService later.
 */
export const sendEmailDraftController = async (req: Request, res: Response) => {
  try {
    const draft = await markEmailSentService(req.params.id as string);
    return res.status(200).json({
      success: true,
      message: "Email marked as sent",
      data: draft,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to send";
    return res.status(400).json({ success: false, message: msg });
  }
};
