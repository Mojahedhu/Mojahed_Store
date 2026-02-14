import express from "express";
import { handlePayPalWebhook } from "../controllers/webhookController.js";

export const webhookRoutes = express.Router();

// PayPal requires Raw body
webhookRoutes.post(
  "/paypal",
  express.raw({ type: "application/json" }),
  handlePayPalWebhook,
);
