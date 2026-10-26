import type { Document, Types } from "mongoose";

export interface IToolCall {
  name: string;
  arguments: Record<string, unknown>;
  resultSummary?: string;
  durationMs?: number;
}

export interface IAgentMessage {
  role: "user" | "assistant" | "tool";
  content: string;
  toolCalls?: IToolCall[];
}

export interface IAgentRun extends Document {
  user?: Types.ObjectId;
  messages: IAgentMessage[];
  toolCalls: IToolCall[];
  finalAnswer?: string;
  status: "running" | "completed" | "failed" | "timeout";
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
