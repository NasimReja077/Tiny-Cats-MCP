import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import catsRoute from "./routes/cat.routes.ts";
import aiRoutes from "./routes/ai.routes.ts";
import aiRecommendRoutes from "./routes/aiRecommend.routes.ts";
import mcpRoutes from "./routes/test-mcp.routes.ts";
import profileRoutes from "./routes/profile.routes.ts";
import { clerkMiddleware } from "@clerk/express";
import multer from "multer";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Health / root
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Tiny cats backend running...",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "OK" });
});

// Routes
app.use("/api/cats", catsRoute);
app.use("/api/ai", aiRoutes);
app.use("/api/aiRecommend", aiRecommendRoutes);
app.use("/api/mcp", mcpRoutes);
app.use("/api/profile", profileRoutes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status =
    err instanceof multer.MulterError
      ? 400
      : typeof (err as Error & { status?: unknown }).status === "number"
        ? (err as Error & { status: number }).status
        : 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;