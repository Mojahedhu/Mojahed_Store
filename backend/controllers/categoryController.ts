import { asyncHandler } from "../middlewares/asyncHandler.js";
import { Category } from "../models/categoryModel.js";
import { AppError } from "../utils/AppError.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new AppError("All fields are required", 400);
  }
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new AppError("Category already exists", 400);
    }
    const newCategory = await new Category({ name }).save();
    console.log(newCategory);
    res.json(newCategory);
  } catch (err) {
    const error = err as Error;
    throw new AppError(error.message || String(err), 500);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new AppError("All fields are required", 400);
  }
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new AppError("Category already exists", 400);
    }
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    category.name = name;
    await category.save();
    res.json(category);
  } catch (err) {
    const error = err as Error;
    throw new AppError(error.message || String(err), 500);
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    await category.deleteOne();
    res.json({ message: "Category deleted successfully 🎉", data: category });
  } catch (err) {
    const error = err as Error;
    throw new AppError(error.message || String(err), 500);
  }
});

const categoryList = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    const error = err as Error;
    throw new AppError(error.message || String(err), 500);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    res.json(category);
  } catch (err) {
    const error = err as Error;
    throw new AppError(error.message || String(err), 500);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  categoryList,
  readCategory,
};
