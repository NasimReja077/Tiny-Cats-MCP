import mongoose, { Schema, Model } from "mongoose";
import type { IAgentRun } from "../types/agentRun.types.ts";

const agentRunSchema = new Schema<IAgentRun>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    clerkUserId: { type: String, index: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant", "tool"], required: true },
        content: { type: String, required: true },
        toolCalls: [
          {
            name: String,
            arguments: Schema.Types.Mixed,
            resultSummary: String,
            durationMs: Number,
          },
        ],
      },
    ],
    toolCalls: [
      {
        name: String,
        arguments: Schema.Types.Mixed,
        resultSummary: String,
        durationMs: Number,
      },
    ],
    finalAnswer: { type: String },
    status: {
      type: String,
      enum: ["running", "completed", "failed", "timeout"],
      default: "running",
      index: true,
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const AgentRun: Model<IAgentRun> =
  mongoose.models.AgentRun ?? mongoose.model<IAgentRun>("AgentRun", agentRunSchema);
