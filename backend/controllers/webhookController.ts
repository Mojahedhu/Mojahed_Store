import axios from "axios";
import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { Order } from "../models/OrderModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getAccessToken } from "../services/paypalServices.js";
import mongoose from "mongoose";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

const handlePayPalWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const transmissionId = req.headers["paypal-transmission-id"] as string;
    const transmissionTime = req.headers["paypal-transmission-time"] as string;
    const certUrl = req.headers["paypal-cert-url"] as string;
    const authAlgo = req.headers["paypal-auth-algo"] as string;
    const transmissionSig = req.headers["paypal-transmission-sig"] as string;

    const token = await getAccessToken();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

    const body = req.body.toString("utf-8");
    const event = JSON.parse(body);
    console.log("*".repeat(20));
    console.log("Paypal webhook server running");
    console.log("EVENT TYPE:", event.event_type);
    console.log("Event log", event);
    console.log("-".repeat(20));
    console.log("Event resource log", event.resource);
    console.log("-".repeat(20));
    console.log(
      "Event resource purchase units log",
      event.resource.purchase_units[0],
    );
    // 🔐 Verify PayPal signature
    const { data } = await axios.post(
      `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: event,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (data.verification_status !== "SUCCESS") {
      throw new AppError("PayPal webhook verification failed", 400);
    }

    // Ignore unrelated events
    if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return res.sendStatus(200);
    }

    if (!data.verification_status) {
      throw new AppError("Invalid PayPal signature", 400);
    }

    const unit = event.resource?.purchase_units[0];
    const orderId = unit?.custom_id;

    if (!orderId || !unit?.amount) {
      throw new AppError("Invalid Paypal webhook payload", 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      // 🔐 Idempotency protection
      if (order.isPaid) {
        return res.sendStatus(200);
      }

      const capture = event.resource; // Full capture resource

      // 🔐 Amount verification
      if (
        Number.parseFloat(unit.amount.value) !==
          Number.parseFloat(order?.totalPrice.toFixed(2)) ||
        unit.amount.currency_code !== "USD"
      ) {
        throw new AppError("Payment amount mismatch", 400);
      }

      order.isPaid = true;
      order.paidAt = new Date();

      order.paymentResult = {
        id: capture.id,
        status: capture.status,
        update_time: capture.update_time,
        email_address: capture.payer.email_address,
      };

      await order.save({ session });
      await session.commitTransaction();

      return res.sendStatus(200);
    } catch (error) {
      const catErr = error as Error;
      await session.abortTransaction();
      throw new AppError(catErr.message || String(error), 500);
    } finally {
      session.endSession();
    }
  },
);

export { handlePayPalWebhook };
