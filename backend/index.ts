// Package
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { userRoutes } from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import { multerErrorHandler } from "./middlewares/multerErrorHandler.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { AppError } from "./utils/AppError.js";
import { webhookRoutes } from "./routes/webhookRoutes.js";
import { cloudinaryRoutes } from "./routes/cloudinaryRoutes.js";
import { stripeWebhookRoutes } from "./routes/stripeWebhookRoutes.js";

const __dirname = import.meta.dirname;
const CLIENT_URL = process.env.CLIENT_URL || true;
const port = Number(process.env.PORT) || 5000;
connectDB();

const app = express();

app.use("/api/webhooks", webhookRoutes);
app.use("/api/stripe/webhook", stripeWebhookRoutes);

app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", cloudinaryRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  if (!clientId) {
    throw new AppError("Paypal client ID not found", 500);
  }
  res.send({ clientId });
});

const imgPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../uploads")
    : path.join(__dirname, "uploads");
app.use("/uploads", express.static(imgPath));

// Server frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontEnd/dist");
  app.use(express.static(frontendPath));
  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// 404 handler (no next)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Multer error handler (LAST)
app.use(multerErrorHandler);

// Global error handler (LAST)
app.use(globalErrorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log("\n");
  console.log(`Server is running on port ${port} 🚀`);
  console.log(`➜  Local:   http://localhost:${port}`);
  console.log(process.env.NODE_ENV);
});
