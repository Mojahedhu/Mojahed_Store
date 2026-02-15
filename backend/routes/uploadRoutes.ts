import express from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { deleteFromCloudinary } from "../services/cloudinaryDelete.js";

export const uploadRoutes = express.Router();

/* ---------------- Cloudinary Config ---------------- */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const storage = multer.memoryStorage();

// const uploadDir = path.join(process.cwd(), "uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  cb: (err: Error | null, isMatch?: boolean) => void,
) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(new AppError("Invalid file type", 400), false);
  }
}

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter,
// });

/* ---------------- Multer (Memory) ---------------- */
const upload_ = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

const uploadSingleImage = upload_.single("image");
/* ---------------- Route ---------------- */
uploadRoutes.post(
  "/",
  uploadSingleImage,
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }
    const image_Id =
      typeof req.query.image_Id === "string" ? req.query.image_Id : undefined;
    if (image_Id) {
      await deleteFromCloudinary(image_Id, next);
    }
    const file = req.file;
    cloudinary.uploader
      .upload_stream({ folder: "products/images" }, (error, result) => {
        if (error || !result) {
          const catError = error as Error;
          return next(new AppError(catError.message, 500));
        }
        res.json({
          message: "File uploaded successfully 🎉",
          file: {
            image: result?.secure_url,
            image_Id: result?.public_id,
            format: result?.format,
            size: result?.bytes,
          },
        });
      })
      .end(file.buffer);

    // res.send({
    //   message: "File uploaded successfully 🎉",
    //   file: {
    //     image: `/uploads/${req.file.filename}`,
    //     filename: req.file.filename,
    //     mimetype: req.file.mimetype,
    //     size: req.file.size,
    //   },
    // });
  }),
);
