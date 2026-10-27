import { getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const requireClerkAuth: RequestHandler = (req, res, next) => {
  if (!getAuth(req).userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  return next();
};
