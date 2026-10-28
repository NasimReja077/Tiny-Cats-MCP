import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build an ImageKit URL with optional resize transformation.
 * If the url is empty, returns undefined (caller shows fallback).
 */
export function imgUrl(
  url: string | undefined,
  w: number,
  h: number
): string | undefined {
  if (!url) return undefined;
  // Already has a query string? append with &
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}tr=w-${w},h-${h}`;
}

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate upload file client-side (type + size)
 */
export function validateImageFile(file: File): string | null {
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP, or GIF image files are allowed";
  }
  if (file.size > MAX_SIZE) {
    return "File too large (max 5 MB)";
  }
  return null;
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Format a date string to "Month Year"
 */
export function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Truncate a string with ellipsis
 */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}
