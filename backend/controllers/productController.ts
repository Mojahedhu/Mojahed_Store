import { asyncHandler } from "../middlewares/asyncHandler.js";
import { formidable } from "formidable";
import { AppError } from "../utils/AppError.js";
import { Product, type ProductUpdateFields } from "../models/productModel.js";
import { getFieldValue, handleUpdates } from "../utils/helper.js";
import { deleteFromCloudinary } from "../services/cloudinaryDelete.js";
import { Category } from "../models/categoryModel.js";

const addProduct = asyncHandler(async (req, res, next) => {
  const form = formidable({
    multiples: false,
    maxFileSize: 2 * 1024 * 1024,
  });
  form.parse(req, async (err, fields) => {
    if (err) {
      return next(new AppError(err, 500));
    }
    try {
      // extract value correctly
      const name = getFieldValue(fields.name);
      const price = getFieldValue(fields.price);
      const description = getFieldValue(fields.description);
      const category = getFieldValue(fields.category);
      const quantity = getFieldValue(fields.quantity);
      const brand = getFieldValue(fields.brand);
      const image = getFieldValue(fields.image);
      const image_Id = getFieldValue(fields.image_Id);
      const countInStock = getFieldValue(fields.countInStock);

      // validation
      switch (true) {
        case !name:
          return next(new AppError("Product name is required", 400));
        case !price:
          return next(new AppError("Product price is required", 400));
        case !description:
          return next(new AppError("Product description is required", 400));
        case !category:
          return next(new AppError("Product category is required", 400));
        case !quantity:
          return next(new AppError("Product quantity required", 400));
        case !brand:
          return next(new AppError("Product brand is required", 400));
        case !countInStock:
          return next(new AppError("Product count in stock is required", 400));
        case !image && !image_Id:
          return next(new AppError("Product image is required", 400));
      }

      const product = new Product({
        name,
        price,
        description,
        category,
        quantity,
        brand,
        image,
        image_Id,
        countInStock,
      });
      await product.save();
      res.json({ data: product });
    } catch (error) {
      const caError = error as Error;
      return next(new AppError(err || caError.message || String(error), 500));
    }
  });
});

const updateProductDetails = asyncHandler(async (req, res, next) => {
  const form = formidable({
    multiples: false,
    maxFileSize: 2 * 1024 * 1024,
  });
  const updates: ProductUpdateFields = {};
  const allowedFields: (keyof ProductUpdateFields)[] = [
    "name",
    "price",
    "description",
    "quantity",
    "category",
    "brand",
    "countInStock",
    "image",
    "image_Id",
  ];
  form.parse(req, async (err, fields) => {
    if (err) {
      const catErr = err as Error;
      return next(new AppError(catErr.message || String(err), 500));
    }
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      handleUpdates(allowedFields, updates, fields, next);
      if (updates.category) {
        const category = await Category.findById(updates.category);
        if (!category) {
          return next(new AppError("Category not found", 404));
        }
      }

      Object.assign(product, updates);
      await product.save();
      const updatedProduct = await product.populate("category");
      res.json(updatedProduct);
    } catch (error) {
      const catErr = error as Error;
      return next(new AppError(catErr.message || String(error), 500));
    }
  });
});

const removeProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  await deleteFromCloudinary(product.image_Id, next);
  await product.deleteOne();
  res.json(product);
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const keyword =
    typeof req.query.keyword === "string"
      ? new RegExp(req.query.keyword, "i")
      : null;
  const filter = keyword ? { name: keyword } : {};

  try {
    const count = await Product.countDocuments({ ...filter });
    const products = await Product.find({ ...filter }).limit(pageSize);

    res.json({
      page: 1,
      pages: Math.ceil(count / pageSize),
      products,
      hasMore: false,
    });
  } catch (error) {
    const caError = error as Error;
    throw new AppError(caError.message || String(error), 500);
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.json(product);
  } catch (error) {
    const caError = error as Error;
    console.log(caError);
    throw new AppError(caError.message || String(error), 500);
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    const caError = error as Error;
    console.log(caError);
    throw new AppError(caError.message || String(error), 500);
  }
});

const addProductReviews = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user?._id.toString(),
    );
    if (alreadyReviewed) {
      throw new AppError("Product already reviewed", 400);
    }
    const review = {
      name: req.user?.username,
      rating: Number(rating),
      comment,
      user: req.user?._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => {
        return item.rating + acc;
      }, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully 🎉" });
  } catch (error) {
    const caError = error as Error;
    console.log(caError);
    throw new AppError(caError.message || String(error), 500);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    const caError = error as Error;
    console.log(caError);
    throw new AppError(caError.message || String(error), 500);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createAt: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    const caError = error as Error;
    console.log(caError);
    throw new AppError(caError.message || String(error), 500);
  }
});

type FilterArg = {
  category?: string[];
  price?: { $lte: number };
};

const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = "" } = req.body as {
    checked: string[];
    radio: string;
  };

  const args: FilterArg = {};
  if (checked.length > 0) {
    args.category = checked;
  }

  if (radio.trim()) {
    const price = Number(radio);
    if (Number.isNaN(Number(radio)) || price < 0) {
      throw new AppError("Enter a valid number", 400);
    }
  }

  args.price = { $lte: Number(radio) };
  try {
    const products = await Product.find(args).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    const catError = err as Error;
    throw new AppError(catError.message || String(err), 500);
  }
});

export {
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
};
