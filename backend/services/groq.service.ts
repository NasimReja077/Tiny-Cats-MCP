import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getGroqModelId } from "../config/groq.ts";

const SYSTEM_PROMPT =
  "You are a helpful cat-care and adoption assistant. Give practical, kind, evidence-aware advice. Be clear when a question needs a veterinarian.";

const getChatModel = () => {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY. Add it to backend/.env.");
  }

  return new ChatGroq({
    apiKey,
    model: getGroqModelId(),
    temperature: 0.3,
  });
};

export async function generateAiResponse(prompt: string): Promise<string> {
  const response = await getChatModel().invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ]);
  const content = response.content;
  return typeof content === "string"
    ? content
    : content.map((part) => ("text" in part ? part.text : "")).join("");
}
