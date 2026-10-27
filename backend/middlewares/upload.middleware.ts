import multer from "multer";
import path from "node:path";

const imageMimeTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const imageUploadFields = new Set(["avatar", "image"]);

const invalidUpload = (message: string) =>
  Object.assign(new Error(message), { status: 400 });

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (
    imageUploadFields.has(file.fieldname) &&
    imageMimeTypes[extension] === file.mimetype
  ) {
    return callback(null, true);
  }

  return callback(
    invalidUpload("Only JPEG, PNG, WebP, or GIF image files are allowed"),
  );
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadCatImage = imageUpload.single("image");

export const uploadProfileImage = imageUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
]);
