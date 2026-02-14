import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const handleCatchError = (
  error: unknown,
  message: string = "Request failed",
): string => {
  // 1️⃣ RTK Query error
  if (isFetchBaseQueryError(error)) {
    if (typeof error.data === "string") {
      return error.data;
    }
    if (
      typeof error.data === "object" &&
      error.data &&
      "message" in error.data
    ) {
      return String(error.data.message);
    }
    return message;
  }

  // 2️⃣ Normal JS Error
  if (error instanceof Error) {
    return error.message;
  }

  // 3️⃣ Fallback

  return String(error) || message;
};

// Type guard (important)
const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  if (error == null) return false; // catches null AND undefined
  if (typeof error !== "object") return false;

  return "status" in error;
};
