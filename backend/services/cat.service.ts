import CatModel from "../models/cat.model.ts";
import type { ICat } from "../types/cats.types.ts";

// ---------- Create ----------
export const createCatService = async (payload: Partial<ICat>) => {
  return await CatModel.create(payload);
};

// ---------- Get all ----------
export const getAllCatsService = async () => {
  return await CatModel.find().sort({ createdAt: -1 });
};

// ---------- Get one ----------
export const getSingleCatService = async (id: string) => {
  return await CatModel.findById(id);
};

export const updateCatImageService = async (id: string, image: string) => {
  return await CatModel.findByIdAndUpdate(
    id,
    { image },
    { new: true, runValidators: true },
  );
};

// ---------- Search ----------
export const searchCatsService = async (query: string) => {
  return await CatModel.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { breed: { $regex: query, $options: "i" } },
    ],
  });
};

// ---------- Exact match (old endpoint) ----------
export const recommendService = async (
  kidsFriendly: boolean,
  apartmentFriendly: boolean
) => {
  return await CatModel.find({ kidsFriendly, apartmentFriendly });
};

// ---------- Preferences type ----------
export interface RankPreferences {
  kidsFriendly?: boolean;
  apartmentFriendly?: boolean;
  energyLevel?: "low" | "medium" | "high";
  size?: "small" | "medium" | "large";
  minLifeSpan?: number;
  lowAggression?: boolean;
  limit?: number;
  minScore?: number;
}

const ENERGY_ORDER = { low: 0, medium: 1, high: 2 } as const;
const SIZE_ORDER = { small: 0, medium: 1, large: 2 } as const;

// ---------- Score-based ranking ----------
export const rankCatsService = async (prefs: RankPreferences) => {
  const {
    kidsFriendly,
    apartmentFriendly,
    energyLevel,
    size,
    minLifeSpan,
    lowAggression,
    limit = 5,
    minScore = 0,
  } = prefs;

  const cats = await CatModel.find();
  if (!cats.length) {
    return {
      evaluated: 0,
      criteria: prefs,
      results: [],
    };
  }

  // Only count weights the user actually sent
  const weights = {
    kidsFriendly: kidsFriendly !== undefined ? 30 : 0,
    apartmentFriendly: apartmentFriendly !== undefined ? 30 : 0,
    energyLevel: energyLevel ? 20 : 0,
    size: size ? 10 : 0,
    minLifeSpan: minLifeSpan !== undefined ? 5 : 0,
    lowAggression: lowAggression !== undefined ? 5 : 0,
  };

  const totalWeight =
    weights.kidsFriendly +
    weights.apartmentFriendly +
    weights.energyLevel +
    weights.size +
    weights.minLifeSpan +
    weights.lowAggression;

  if (totalWeight === 0) {
    throw new Error("At least one preference is required");
  }

  const scored = cats.map((cat) => {
    let score = 0;
    const reasons: string[] = [];
    const tradeOffs: string[] = [];

    // Kids
    if (weights.kidsFriendly) {
      if (kidsFriendly === true) {
        if (cat.kidsFriendly) {
          score += weights.kidsFriendly;
          reasons.push("Good with kids");
        } else {
          tradeOffs.push("Not ideal with kids");
        }
      } else {
        // user said false → any cat is fine
        score += weights.kidsFriendly;
      }
    }

    // Apartment
    if (weights.apartmentFriendly) {
      if (apartmentFriendly === true) {
        if (cat.apartmentFriendly) {
          score += weights.apartmentFriendly;
          reasons.push("Suits apartment living");
        } else {
          tradeOffs.push("Better suited to a house with space");
        }
      } else {
        score += weights.apartmentFriendly;
      }
    }

    // Energy
    if (weights.energyLevel && energyLevel && cat.energyLevel) {
      const diff = Math.abs(
        ENERGY_ORDER[cat.energyLevel as keyof typeof ENERGY_ORDER] -
          ENERGY_ORDER[energyLevel]
      );
      if (diff === 0) {
        score += weights.energyLevel;
        reasons.push(`Energy level is ${cat.energyLevel}, as you wanted`);
      } else if (diff === 1) {
        score += weights.energyLevel / 2;
        tradeOffs.push(`Energy is ${cat.energyLevel} (you wanted ${energyLevel})`);
      } else {
        tradeOffs.push(`Energy is ${cat.energyLevel} (you wanted ${energyLevel})`);
      }
    }

    // Size
    if (weights.size && size && cat.size) {
      const diff = Math.abs(
        SIZE_ORDER[cat.size as keyof typeof SIZE_ORDER] - SIZE_ORDER[size]
      );
      if (diff === 0) {
        score += weights.size;
        reasons.push(`Size is ${cat.size}, as you wanted`);
      } else if (diff === 1) {
        score += weights.size / 2;
        tradeOffs.push(`Size is ${cat.size} (you wanted ${size})`);
      } else {
        tradeOffs.push(`Size is ${cat.size} (you wanted ${size})`);
      }
    }

    // Life span
    if (weights.minLifeSpan && minLifeSpan !== undefined) {
      const life = cat.lifeSpan ?? 0;
      if (life >= minLifeSpan) {
        score += weights.minLifeSpan;
        reasons.push(`Life span ${life} years meets your minimum`);
      } else {
        const ratio = life / minLifeSpan;
        score += weights.minLifeSpan * Math.max(0, ratio);
        tradeOffs.push(`Life span ${life} years is below your minimum of ${minLifeSpan}`);
      }
    }

    // Aggression
    if (weights.lowAggression && lowAggression !== undefined) {
      const level = (cat.aggressionLevel ?? "low") as string;
      if (lowAggression) {
        if (level === "low") {
          score += weights.lowAggression;
          reasons.push("Calm temperament");
        } else if (level === "medium") {
          score += weights.lowAggression / 2;
          tradeOffs.push("Medium aggression level");
        } else {
          tradeOffs.push("Higher aggression than preferred");
        }
      } else {
        score += weights.lowAggression;
      }
    }

    const matchScore = Math.round((score / totalWeight) * 100);

    return {
      ...cat.toObject(),
      matchScore,
      reasons,
      tradeOffs,
    };
  });

  const results = scored
    .filter((c) => c.matchScore >= minScore)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return (b.lifeSpan ?? 0) - (a.lifeSpan ?? 0); // tie-break
    })
    .slice(0, Math.min(Math.max(limit, 1), 20));

  return {
    evaluated: cats.length,
    criteria: prefs,
    results,
  };
};