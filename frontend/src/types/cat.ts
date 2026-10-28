export interface Cat {
  _id: string;
  name: string;
  breed: string;
  description: string;
  energyLevel?: "low" | "medium" | "high";
  lifeSpan?: number;
  kidsFriendly: boolean;
  apartmentFriendly: boolean;
  image?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  aggressionLevel?: "low" | "medium" | "high";
  foodHabits?: string;
  tailSize?: string;
  grooming?: "low" | "medium" | "high";
  sheddingLevel?: "low" | "medium" | "high";
  vocalization?: "quiet" | "moderate" | "vocal";
  hypoallergenic?: boolean;
  goodWithDogs?: boolean;
  goodWithOtherCats?: boolean;
  indoorOnly?: boolean;
  aloneTolerance?: "low" | "medium" | "high";
  isAvailable?: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdByClerkId?: string;
  avgRating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  // Ranked cat extra fields
  matchScore?: number;
  reasons?: string[];
  tradeOffs?: string[];
}

export interface CatInput {
  name: string;
  breed: string;
  description: string;
  energyLevel?: string;
  lifeSpan?: number;
  kidsFriendly?: boolean;
  apartmentFriendly?: boolean;
  color?: string;
  size?: string;
  aggressionLevel?: string;
  foodHabits?: string;
  tailSize?: string;
  grooming?: string;
  sheddingLevel?: string;
  vocalization?: string;
  hypoallergenic?: boolean;
  goodWithDogs?: boolean;
  goodWithOtherCats?: boolean;
  indoorOnly?: boolean;
  aloneTolerance?: string;
  isAvailable?: boolean;
}

export interface Preferences {
  kidsFriendly?: boolean;
  apartmentFriendly?: boolean;
  energyLevel?: "low" | "medium" | "high";
  size?: "small" | "medium" | "large";
  minLifeSpan?: number;
  lowAggression?: boolean;
  limit?: number;
  minScore?: number;
}

export interface RankedResult {
  evaluated: number;
  criteria: Record<string, unknown>;
  results: Cat[];
}

export interface AiRecommendResponse {
  count: number;
  ranked: RankedResult;
  aiResponse: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProfileUpdateResponse {
  id: string;
  name: string;
  imageUrl: string;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, { type: string; description?: string; enum?: string[] }>;
    required?: string[];
  };
}

export interface McpCallResult {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}

export interface McpDemoResult {
  tools: McpTool[];
  mcpResult: McpCallResult;
  aiResponse: string;
}

export interface AgentToolCall {
  name: string;
  arguments: Record<string, unknown>;
  resultSummary?: string;
  durationMs?: number;
}

export interface AgentChatResponse {
  answer: string;
  runId: string;
  toolCalls: AgentToolCall[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  toolCalls?: AgentToolCall[];
  isError?: boolean;
}
