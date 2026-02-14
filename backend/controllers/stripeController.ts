import { asyncHandler } from "../middlewares/asyncHandler.js";
import { Order } from "../models/OrderModel.js";
import { stripe } from "../utils/stripe.js";
import { AppError } from "../utils/AppError.js";
import type Stripe from "stripe";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK || "";
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  console.log("body", req.body);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    const catErr = error as Stripe.StripeRawError;
    console.log("❌ Webhook failed error", catErr.message);
    return res.status(400).send("Webhook error");
  }

  // 💹 Payment succeeded
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const orderId = paymentIntent?.metadata?.orderId;

    // 🛑 mark order paid in DB
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.isPaid) throw new AppError("Order already paid", 400);

    order.isPaid = true;
    order.paidAt = new Date();

    // ⭐ Fill payment result here
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email || "unknown",
    };

    await order.save();
    console.log("💹 Webhook marked order as paid", orderId);
  }

  res.sendStatus(200);
});

export { handleStripeWebhook };
