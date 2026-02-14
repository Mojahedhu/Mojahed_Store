import express from "express";
import { handleStripeWebhook } from "../controllers/stripeController.js";

export const stripeWebhookRoutes = express.Router();

stripeWebhookRoutes.post(
  "/",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);
