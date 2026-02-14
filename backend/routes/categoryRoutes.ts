import express from "express";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  removeCategory,
  categoryList,
  readCategory,
} from "../controllers/categoryController.js";

export const categoryRoutes = express.Router();

categoryRoutes.route("/").post(authenticate, authorizedAdmin, createCategory);

categoryRoutes
  .route("/:categoryId")
  .put(authenticate, authorizedAdmin, updateCategory);

categoryRoutes
  .route("/:categoryId")
  .delete(authenticate, authorizedAdmin, removeCategory);

categoryRoutes.route("/categories").get(categoryList);

categoryRoutes.route("/:categoryId").get(readCategory);
