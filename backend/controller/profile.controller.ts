import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response } from "express";

export const updateProfileController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const uploadedFiles = req.files;
  const profileFiles = Array.isArray(uploadedFiles) ? undefined : uploadedFiles;
  const imageFile = profileFiles?.image?.[0] ?? profileFiles?.avatar?.[0];
  if (profileFiles?.image?.[0] && profileFiles.avatar?.[0]) {
    return res.status(400).json({
      success: false,
      message: "Upload one profile image using either the image or avatar field",
    });
  }

  const nameValue: unknown = req.body?.name;
  let name: string | undefined;
  if (nameValue !== undefined) {
    if (
      typeof nameValue !== "string" ||
      !nameValue.trim() ||
      nameValue.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string no longer than 100 characters",
      });
    }
    name = nameValue.trim();
  }

  if (name === undefined && !imageFile) {
    return res.status(400).json({
      success: false,
      message: "Provide a name, an image, or both",
    });
  }

  const client = clerkClient;
  if (name !== undefined) {
    const [firstName = "", ...lastNameParts] = name.split(/\s+/);
    await client.users.updateUser(userId, {
      firstName,
      lastName: lastNameParts.join(" "),
    });
  }

  if (imageFile) {
    const bytes = Uint8Array.from(imageFile.buffer);
    const image = new File([bytes.buffer], imageFile.originalname, {
      type: imageFile.mimetype,
    });
    await client.users.updateUserProfileImage(userId, { file: image });
  }

  const user = await client.users.getUser(userId);
  return res.status(200).json({
    success: true,
    message: "Profile updated",
    data: {
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      imageUrl: user.imageUrl,
    },
  });
};
