import express from "express";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import { checkId } from "../middlewares/checkId.js";
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReviews,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";

export const productRoutes = express.Router();

productRoutes
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizedAdmin, addProduct);

productRoutes.route("/all-products").get(fetchAllProducts);
productRoutes
  .route("/:id/reviews")
  .post(authenticate, checkId, addProductReviews);

productRoutes.get("/top", fetchTopProducts);
productRoutes.get("/new", fetchNewProducts);

productRoutes
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizedAdmin, updateProductDetails)
  .delete(authenticate, authorizedAdmin, removeProduct);

productRoutes.route("/filtered-products").post(filterProducts);
