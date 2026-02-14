import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
const multerErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Custom AppError (e.g. from fileFilter)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Pass other errors to global error handler
  next(err);
};

export { multerErrorHandler };
