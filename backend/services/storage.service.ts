import { toFile } from "@imagekit/nodejs";
import imagekit from "../config/imagekit.ts";

export interface UploadedCatImage {
  url: string;
}

export const uploadCatImage = async (
  fileBuffer: Buffer,
  originalName: string,
): Promise<UploadedCatImage> => {
  if (fileBuffer.length === 0) {
    throw new Error("Cannot upload an empty file");
  }

  const fileName = originalName.split(/[\\/]/).pop()?.trim();
  if (!fileName) {
    throw new Error("A valid file name is required");
  }

  try {
    const file = await toFile(fileBuffer, fileName);
    const response = await imagekit.files.upload({
      file,
      fileName,
      folder: "/cats",
      tags: ["cat"],
      useUniqueFileName: true,
    });

    if (!response.url) {
      throw new Error("ImageKit did not return a URL for the uploaded file");
    }

    return { url: response.url };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload file to ImageKit");
  }
};
