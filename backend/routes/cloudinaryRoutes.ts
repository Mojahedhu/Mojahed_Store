import express from "express";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import {
  getAllImages,
  removeImage,
} from "../controllers/cloudinaryController.js";

export const cloudinaryRoutes = express.Router();

/**
 * GET /api/cloudinary/images?folder=products/
 * Returns all images in a folder (or all if folder not provided)
 */

cloudinaryRoutes
  .route("/cloudinary/images")
  .get(authenticate, authorizedAdmin, getAllImages)
  .delete(authenticate, authorizedAdmin, removeImage);
