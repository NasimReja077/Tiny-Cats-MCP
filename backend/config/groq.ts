const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

const MODEL_REPLACEMENTS: Record<string, string> = {
  "llama-3.3-70b-versatile": DEFAULT_GROQ_MODEL,
};

export const getGroqModelId = (): string => {
  const configuredModel = process.env.GROQ_MODEL?.trim();
  if (!configuredModel) return DEFAULT_GROQ_MODEL;

  return MODEL_REPLACEMENTS[configuredModel] ?? configuredModel;
};
