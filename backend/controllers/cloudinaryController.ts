import { asyncHandler } from "../middlewares/asyncHandler.js";
import { listAllImage } from "../services/cloudinaryService.js";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError.js";

const getAllImages = asyncHandler(async (req, res) => {
  const folder = req.query.folder as string | undefined;
  if (!folder) {
    throw new Error("Folder is required");
  }

  const images = await listAllImage(folder);
  res.json({ images });
});

const removeImage = asyncHandler(async (req, res) => {
  const { public_id } = req.query as { public_id: string };
  if (!public_id) {
    throw new AppError("Public id is required", 400);
  }
  const result = await cloudinary.uploader.destroy(public_id);

  if (result.result !== "ok") {
    throw new AppError("Image not found or already deleted", 404);
  }
  res.json({ message: "Image deleted successfully" });
});

export { getAllImages, removeImage };
