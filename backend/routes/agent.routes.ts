import express from "express";
import { requireClerkAuth } from "../middlewares/auth.middleware.ts";
import {
  agentChatController,
  getCatteryController,
  listCatteriesController,
  createListingController,
  getListingController,
  searchListingsController,
  updateListingStatusController,
  generatePostController,
  getEmailDraftController,
  listEmailDraftsController,
  sendEmailDraftController,
} from "../controller/agent.controller.ts";

const router = express.Router();

// Agent chat
// POST /api/agent/chat  { message, history? }
router.post("/chat", requireClerkAuth, agentChatController);

// Catteries
// GET /api/agent/catteries?q=
// GET /api/agent/catteries/:id
router.get("/catteries", listCatteriesController);
router.get("/catteries/:id", getCatteryController);

// Listings (sell flow)
// POST /api/agent/listings
// GET  /api/agent/listings?q=&city=&breed=
// GET  /api/agent/listings/:id
// PATCH /api/agent/listings/:id/status  { status }
// POST /api/agent/listings/:id/external-post  { platform }
router.post("/listings", requireClerkAuth, createListingController);
router.get("/listings", searchListingsController);
router.get("/listings/:id", getListingController);
router.patch("/listings/:id/status", requireClerkAuth, updateListingStatusController);
router.post("/listings/:id/external-post", generatePostController);

// Email drafts (agent creates draft; user sends)
// GET  /api/agent/emails
// GET  /api/agent/emails/:id
// POST /api/agent/emails/:id/send
router.get("/emails", listEmailDraftsController);
router.get("/emails/:id", getEmailDraftController);
router.post("/emails/:id/send", requireClerkAuth, sendEmailDraftController);

export default router;
