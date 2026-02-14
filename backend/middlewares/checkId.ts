import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../utils/AppError.js";

const checkId = (req: Request, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(`Invalid Object of: ${req.params.id}`, 400);
  }
  next();
};

export { checkId };
