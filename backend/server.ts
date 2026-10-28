import { createServer } from "node:http";
import app from "./app.ts";
import { connectDB } from "./config/db.ts";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { runAgent } from "./services/agent.service.ts";

await connectDB();

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (typeof token !== "string" || !process.env.CLERK_SECRET_KEY) {
    return next(new Error("Authentication required"));
  }
  try {
    const claims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    if (!claims.sub) return next(new Error("Invalid authentication token"));
    socket.data.userId = claims.sub;
    return next();
  } catch {
    return next(new Error("Invalid authentication token"));
  }
});

io.on("connection", (socket) => {
  socket.on(
    "agent:message",
    async (payload: unknown) => {
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("message" in payload) ||
        typeof payload.message !== "string" ||
        !payload.message.trim() ||
        payload.message.length > 4000
      ) {
        socket.emit("agent:error", { message: "Message must be 1–4000 characters" });
        return;
      }

      const history = "history" in payload && Array.isArray(payload.history)
        ? payload.history
            .filter(
              (item): item is { role: "user" | "assistant"; text: string } =>
                typeof item === "object" &&
                item !== null &&
                "role" in item &&
                (item.role === "user" || item.role === "assistant") &&
                "text" in item &&
                typeof item.text === "string" &&
                item.text.length <= 4000,
            )
            .slice(-12)
        : [];

      try {
        const result = await runAgent(
          history,
          payload.message.trim(),
          socket.data.userId as string,
        );
        socket.emit("agent:response", result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Agent failed";
        socket.emit("agent:error", { message });
      }
    },
  );
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});