import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUser,
  getCurrentUserProfile,
  updateUser,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

export const userRoutes = express.Router();

userRoutes
  .route("/")
  .post(createUser)
  .get(authenticate, authorizedAdmin, getAllUser);
userRoutes.post("/auth", loginUser);
userRoutes.post("/logout", logoutCurrentUser);

userRoutes
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateUser);

// ADMIN ROUTES 👇
userRoutes
  .route("/:id")
  .delete(authenticate, authorizedAdmin, deleteUserById)
  .get(authenticate, authorizedAdmin, getUserById)
  .put(authenticate, authorizedAdmin, updateUserById);
