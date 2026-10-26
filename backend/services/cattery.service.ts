import { Cattery, type ICattery } from "../models/cattery.model.ts";

export const saveCatteryService = async (data: Partial<ICattery>) => {
  if (!data.name?.trim()) {
    throw new Error("Cattery name is required");
  }

  // Prefer updating if same name + website already exists
  if (data.website) {
    const existing = await Cattery.findOne({
      name: new RegExp(`^${data.name.trim()}$`, "i"),
      website: data.website,
    });
    if (existing) {
      Object.assign(existing, {
        ...data,
        foundAt: new Date(),
      });
      await existing.save();
      return existing;
    }
  }

  return Cattery.create({
    ...data,
    foundAt: data.foundAt ?? new Date(),
  });
};

export const getCatteryByIdService = async (id: string) => {
  return Cattery.findById(id);
};

export const searchCatteriesService = async (q: string) => {
  return Cattery.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { breeds: { $regex: q, $options: "i" } },
    ],
  }).sort({ foundAt: -1 });
};

export const listCatteriesService = async (limit = 20) => {
  return Cattery.find().sort({ foundAt: -1 }).limit(Math.min(limit, 50));
};
