import type { NextFunction } from "express";
import type { ProductUpdateFields } from "../models/productModel.js";
import { Types } from "mongoose";
import { AppError } from "./AppError.js";
import type formidable from "formidable";

export const getFieldValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export const handleUpdates = (
  allowedFields: (keyof ProductUpdateFields)[],
  updates: ProductUpdateFields,
  fields: formidable.Fields,
  next: NextFunction,
) => {
  for (const field of allowedFields) {
    const rawValue = getFieldValue(fields[field]);
    if (rawValue === undefined) {
      continue;
    }
    switch (field) {
      case "price":
      case "quantity":
      case "countInStock":
        updates[field] = Number(rawValue);
        break;
      case "category":
        if (!Types.ObjectId.isValid(rawValue)) {
          return next(new AppError("Category not found", 404));
        }
        updates[field] = new Types.ObjectId(rawValue);
        break;
      default:
        updates[field] = rawValue;
    }
  }
};

// for (const field of allowedFields) {
//   const rawValue = getFieldValue(fields[field]);
//   if (rawValue === undefined) {
//     continue;
//   }
//   switch (field) {
//     case "price":
//     case "quantity":
//     case "countInStock":
//       updates[field] = Number(rawValue);
//       break;
//     case "category":
//       if (!Types.ObjectId.isValid(rawValue)) {
//         return next(new AppError("Category not found", 404));
//       }
//       updates[field] = new Types.ObjectId(rawValue);
//       break;
//     default:
//       updates[field] = rawValue;
//   }
// }
