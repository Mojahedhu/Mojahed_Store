import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError.js";
import type { NextFunction } from "express";

export const deleteFromCloudinary = async (
  imageId: string,
  next: NextFunction,
) => {
  console.log("image_Id", imageId);
  if (imageId === undefined) {
    throw new AppError("Image id is required", 400);
  }
  const result = await cloudinary.uploader.destroy(imageId);

  if (result.result !== "ok") {
    throw new AppError("cloudinary image deletion failed", 500);
  }
};
