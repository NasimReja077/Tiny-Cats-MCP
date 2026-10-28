import { z } from "zod";

export const catFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(40, "Name must be at most 40 characters"),
  breed: z
    .string()
    .min(2, "Breed must be at least 2 characters")
    .max(60, "Breed must be at most 60 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be at most 500 characters"),
  energyLevel: z.enum(["low", "medium", "high"]),
  aggressionLevel: z.enum(["low", "medium", "high"]),
  kidsFriendly: z.boolean(),
  apartmentFriendly: z.boolean(),
  goodWithDogs: z.boolean(),
  goodWithOtherCats: z.boolean(),
  grooming: z.enum(["low", "medium", "high"]),
  sheddingLevel: z.enum(["low", "medium", "high"]),
  aloneTolerance: z.enum(["low", "medium", "high"]),
  vocalization: z.enum(["quiet", "moderate", "vocal"]),
  hypoallergenic: z.boolean(),
  indoorOnly: z.boolean(),
  size: z.enum(["small", "medium", "large"]),
  color: z.string().max(40, "Color must be at most 40 characters").optional(),
  tailSize: z.enum(["short", "medium", "long"]).optional(),
  lifeSpan: z.number().int().min(1).max(40),
  foodHabits: z
    .string()
    .max(200, "Food habits must be at most 200 characters")
    .optional(),
  isAvailable: z.boolean().optional(),
});

export type CatFormValues = z.infer<typeof catFormSchema>;

export const preferencesSchema = z.object({
  kidsFriendly: z.boolean().optional(),
  apartmentFriendly: z.boolean().optional(),
  energyLevel: z.enum(["low", "medium", "high"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  minLifeSpan: z.number().int().min(1).max(40).optional(),
  lowAggression: z.boolean().optional(),
  limit: z.number().int().min(1).max(20).default(5),
});

export type PreferencesValues = z.infer<typeof preferencesSchema>;
