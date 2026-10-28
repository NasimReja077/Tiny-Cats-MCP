import type { Types } from "mongoose";

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

export interface IAgentRun {
  user?: Types.ObjectId;
  clerkUserId?: string;
  messages: IAgentMessage[];
  toolCalls: IToolCall[];
  finalAnswer?: string;
  status: "running" | "completed" | "failed" | "timeout";
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
