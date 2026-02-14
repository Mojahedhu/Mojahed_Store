import { User } from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "./asyncHandler.js";
import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
};

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;
    if (!token) {
      throw new AppError("Not authorized, no token", 401);
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        throw new AppError("User not found", 401);
      }
      req.user = user;
      next();
    } catch (error) {
      const catErr = error as Error;
      throw new AppError(
        catErr.message || String(error) || "Not Authorized, token failed",
        401,
      );
    }
  },
);

const authorizedAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req?.user?.isAdmin) {
      next();
    } else {
      throw new AppError("Not authorized as an admin", 403);
    }
  },
);

export { authenticate, authorizedAdmin };
