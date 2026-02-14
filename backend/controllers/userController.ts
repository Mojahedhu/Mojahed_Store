import bcrypt from "bcryptjs";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { User } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { createToken } from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new AppError("All fields are required", 400);
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    createToken(res, newUser._id.toString());

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    const caError = error as Error;
    throw new AppError(
      caError.message || String(error) || "Failed to create user",
      500,
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new AppError("User not found", 404);
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 401);
  }
  createToken(res, existingUser._id.toString());
  res.json({
    _id: existingUser._id.toString(),
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Successfully logged out" });
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401);
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.username = username || user.username;
  user.email = email || user.email;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  await user.save();
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.isAdmin) {
    throw new AppError("Cannot delete admin user", 403);
  }
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const { username, email, isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;

  await user.save();
  res.json({
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUser,
  getCurrentUserProfile,
  updateUser,
  deleteUserById,
  getUserById,
  updateUserById,
};
