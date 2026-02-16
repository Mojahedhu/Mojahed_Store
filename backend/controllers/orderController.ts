import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  Order,
  type OrderItem,
  type ShippingAddress,
} from "../models/OrderModel.js";
import { Product } from "../models/productModel.js";
import { AppError } from "../utils/AppError.js";
import {
  getAccessToken,
  verifyPayPalOrder,
  type CaptureResponse,
} from "../services/paypalServices.js";
import axios from "axios";
import { stripe } from "../utils/stripe.js";

const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

// Utility function
const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const taxRate = 0.15;

  const taxPrice = (taxRate * itemsPrice).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    Number.parseFloat(taxPrice)
  ).toFixed(2);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
};

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body as {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  };
  if (orderItems?.length === 0) {
    throw new AppError("No order items", 400);
  }
  if (!shippingAddress) {
    throw new AppError("No shipping address", 400);
  }
  if (!paymentMethod) {
    throw new AppError("No payment method", 400);
  }

  try {
    const itemsFromDB = await Product.find({
      _id: {
        $in: orderItems.map((x) => x._id),
      },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemsFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id,
      );
      if (!matchingItemsFromDB) {
        throw new AppError(
          `Invalid order items, product not found: ${itemFromClient._id}`,
          400,
        );
      }
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemsFromDB.price,
        _id: undefined,
      };
    });
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calcPrices(dbOrderItems);
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user?._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    const catErr = error as Error;
    throw new AppError(catErr.message || String(error), 500);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError("User not found", 404);
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.json(orders);
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const countTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments();
    res.json({ totalOrdersCount });
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const countTotalSales = asyncHandler(async (req, res) => {
  try {
    const totalSales = await Order.aggregate<{
      totalSales: number;
      id: string;
    }>([{ $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }]);
    res.json({ totalSales });
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const totalSalesByDate = await Order.aggregate<{
      _id: string;
      totalSales: number;
    }>([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.json(totalSalesByDate);
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const findOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email",
    );
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.json(order);
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const editPaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const { paymentMethod } = req.body as { paymentMethod: string };
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.paymentMethod = paymentMethod;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

const createPaypalOrder = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }
  const accessToken = await getAccessToken();
  const { data } = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: order._id?.toString(),
          amount: {
            currency_code: "USD",
            value: order.totalPrice.toFixed(2),
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  res.json({ id: data.id });
});

const capturePaypalOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body as { paypalOrderId: string };
  // const { id } = req.params as { id: string };

  // const order = await Order.findById(id);

  // if (!order) {
  //   throw new AppError("Order not found", 404);
  // }
  // if (order.isPaid) {
  //   throw new AppError("Order already paid", 400);
  // }

  // if (req.user?._id.toString() !== order.user.toString()) {
  //   throw new AppError("User not authorized", 401);
  // }

  // // 🔥 VERIFY WITH PAYPAL
  // const verified = await verifyPayPalOrder(
  //   paypalOrderId,
  //   order.totalPrice.toFixed(2),
  // );
  // order.isPaid = true;
  // order.paidAt = new Date();
  // order.paymentResult = verified;
  // const updatedOrder = await order.save();
  // res.json(updatedOrder);

  const accessToken = await getAccessToken();

  // 🔥 CAPTURE ORDER DIRECTLY
  const {
    data: captureData,
  }: {
    data: CaptureResponse;
  } = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  res.json(captureData);
});

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params as {
    id: string;
  };
  const userId = req.user?._id.toString();
  const { amount } = req.body as { amount: string };

  console.log("order_controller", orderId);

  if (!userId) {
    throw new AppError("User not found", 401);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  try {
    // amount must be in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "USD",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId,
        userId,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const verifyStripePayment = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params as { id: string };
  const { paymentIntentId } = req.body as { paymentIntentId: string };

  if (!paymentIntentId) {
    throw new AppError("Missing paymentIntentId", 400);
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // 🔥 Verify with stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new AppError("Payment failed", 400);
  }

  // 🔐 Mark paid
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: paymentIntent.id,
    status: paymentIntent.status,
    update_time: new Date().toLocaleString(),
    email_address: paymentIntent.receipt_email || "Unknown",
  };
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

const markOrderAsPaid_ = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const { details } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }
  if (order.isPaid) {
    throw new AppError("Order already paid", 400);
  }
  if (req.user?._id.toString() !== order.user.toString()) {
    throw new AppError("Can not pay order for unauthorized order", 401);
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: details.id,
    status: details.status,
    update_time: details.update_time,
    email_address: details.payer.email_address,
  };
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const { id } = req.params as { id: string };
  console.log("Mongo order id:", id);
  console.log("PayPal order id:", orderId);

  if (req.body.details.status !== "COMPLETED") {
    throw new AppError("Payment not completed", 400);
  }

  console.log(req.params.id);
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // 🔐 Authorization
  if (order?.user._id.toString() !== req.user?._id.toString()) {
    throw new AppError("You are not authorized to update this order", 401);
  }

  // 🛑 Already paid - idempotency protection
  if (order.isPaid) {
    return res.json(order);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const paymentResult = await verifyPayPalOrder(
      orderId,
      order.totalPrice.toString(),
    );

    order.isPaid = true;
    order.paidAt = new Date();
    console.log("error here");
    order.paymentResult = paymentResult;

    const updatedOrder = await order.save({ session });

    await session.commitTransaction();
    res.json(updatedOrder);
  } catch (error) {
    const catError = error as Error;
    await session.abortTransaction();
    throw new AppError(
      catError.message ||
        String(error) ||
        "Order payment failed, please try again later",
      500,
    );
  } finally {
    session.endSession();
  }
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    order.isDelivered = true;
    order.deliveredAt = new Date();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    const catError = error as Error;
    throw new AppError(catError.message || String(error), 500);
  }
});

const removeOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (
    order?.user._id.toString() !== req.user?._id.toString() ||
    req.user?.isAdmin !== true
  ) {
    throw new AppError("You are not authorized to update this order", 403);
  }

  await order.deleteOne();
  res.json({ message: "Order deleted successfully" });
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  countTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  editPaymentMethod,
  createPaypalOrder,
  capturePaypalOrder,
  createPaymentIntent,
  verifyStripePayment,
  markOrderAsPaid,
  markOrderAsPaid_,
  markOrderAsDelivered,
  removeOrder,
};
