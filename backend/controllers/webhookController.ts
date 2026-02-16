import axios from "axios";
import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { Order } from "../models/OrderModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { getAccessToken } from "../services/paypalServices.js";
import mongoose from "mongoose";

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

type PaypalWebhookRes = {
  id: string;
  event_version: string;
  create_time: string;
  event_type: string;
  summary: string;
  resource: {
    id: string;
    create_time: string;
    status: string;
    intent: string;
    payer: {
      name: {
        given_name: string;
        surname: string;
      };
      email_address: string;
    };
    purchase_units: [
      {
        amount: {
          value: string;
          currency_code: string;
        };
        paymee: {
          email_address: string;
          merchant_id: string;
          shipping: {
            name: {
              full_name: string;
            };
            address: {
              address_line_1: string;
              admin_area_2: string;
              admin_area_1: string;
              postal_code: string;
              country_code: string;
            };
          };
        };
      },
    ];
  };
};

type PaypalWebhookResponse = {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  resource_version: string;
  event_time: string;
  summary: string;
  resource: {
    payee: {
      email_address: string;
      merchant_id: string;
    };
    amount: {
      value: string;
      currency_code: string;
    };
    seller_protection: {
      status: string;
      dispute_categories: string[];
    };
    supplementary_data: {
      related_ids: {
        order_id: string;
      }[];
    };
    update_time: string;
    create_time: string;
    id: string;
    final_capture: boolean;
    status: string;
    intent: string;
    seller_receivable_breakdown: {
      gross_amount: {
        value: string;
        currency_code: string;
      };
      paypal_fee: {
        value: string;
        currency_code: string;
      };
      net_amount: {
        value: string;
        currency_code: string;
      };
    };
    custom_id: string;
    links: {
      href: string;
      rel: string;
      method: string;
    }[];
  };
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
};

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
    const event: PaypalWebhookResponse = JSON.parse(body);
    console.log("*".repeat(20));
    console.log("Paypal webhook server running");
    console.log("EVENT TYPE:", event.event_type);
    console.log("Event log", event);
    console.log("-".repeat(20));
    console.log("Event resource log", event.resource);
    console.log("-".repeat(20));
    console.log("Event resource purchase units log", event.resource);
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

    const unit = event.resource;
    const orderId = unit?.custom_id;

    if (!orderId || !unit?.amount.value) {
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
        email_address: capture.payee.email_address,
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
