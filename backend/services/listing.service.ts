import { Listing } from "../models/listing.model.ts";
import type { IListing, ListingStatus } from "../types/listing.types.ts";

export const createListingService = async (data: Partial<IListing>) => {
  if (!data.name?.trim()) throw new Error("Cat name is required");
  if (!data.breed?.trim()) throw new Error("Breed is required");
  if (data.ageWeeks === undefined || data.ageWeeks < 8) {
    throw new Error("Age must be at least 8 weeks");
  }
  if (!data.city?.trim()) throw new Error("City is required");
  if (!data.description?.trim()) throw new Error("Description is required");
  if (!data.contactPhone && !data.contactEmail) {
    throw new Error("At least one contact (phone or email) is required");
  }

  return Listing.create({
    ...data,
    status: "pending",
  });
};

export const getListingByIdService = async (id: string) => {
  return Listing.findById(id);
};

export const searchListingsService = async (filters: {
  q?: string;
  city?: string;
  breed?: string;
  status?: ListingStatus;
  limit?: number;
}) => {
  const query: Record<string, unknown> = {};

  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = "approved"; // public search defaults to approved
  }

  if (filters.city) query.city = new RegExp(filters.city, "i");
  if (filters.breed) query.breed = new RegExp(filters.breed, "i");

  if (filters.q) {
    query.$text = { $search: filters.q };
  }

  const limit = Math.min(filters.limit ?? 20, 50);

  return Listing.find(query).sort({ createdAt: -1 }).limit(limit);
};

export const updateListingStatusService = async (
  id: string,
  status: ListingStatus
) => {
  const listing = await Listing.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!listing) throw new Error("Listing not found");
  return listing;
};

export const generateExternalPostService = (
  listing: IListing,
  platform: "facebook" | "olx" | "instagram" | "generic" = "generic"
) => {
  const priceLine =
    listing.price != null
      ? `Price: ${listing.currency || "INR"} ${listing.price}`
      : "Price: contact for details";

  const contactLine = [
    listing.contactPhone ? `Phone: ${listing.contactPhone}` : null,
    listing.contactEmail ? `Email: ${listing.contactEmail}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const base = `
🐱 ${listing.name} — ${listing.breed}
📍 ${listing.city}
🎂 Age: ${listing.ageWeeks} weeks
💉 Vaccinated: ${listing.vaccinated ? "Yes" : "No"}
💰 ${priceLine}

${listing.description}

${contactLine}
`.trim();

  if (platform === "facebook") {
    return {
      platform,
      text: `${base}\n\n#CatsForSale #${listing.breed.replace(/\s+/g, "")} #${listing.city.replace(/\s+/g, "")}`,
    };
  }

  if (platform === "olx") {
    return {
      platform,
      text: `${listing.breed} kitten/cat for sale in ${listing.city}\n\n${base}`,
    };
  }

  return { platform, text: base };
};
