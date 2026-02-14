import mongoose, { Types } from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    image_Id: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export { Product };

export type ProductDocument = {
  name: string;
  image: string;
  image_Id: string;
  brand: string;
  quantity: number;
  category: Types.ObjectId;
  description: string;
  reviews: any[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
};
export type ProductUpdateFields = {
  name?: string;
  price?: number;
  description?: string;
  category?: Types.ObjectId;
  quantity?: number;
  brand?: string;
  image?: string;
  image_Id?: string;
  countInStock?: number;
};
