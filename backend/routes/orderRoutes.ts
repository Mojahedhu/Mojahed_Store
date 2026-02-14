import express from "express";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  countTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsDelivered,
  editPaymentMethod,
  createPaypalOrder,
  capturePaypalOrder,
  createPaymentIntent,
  verifyStripePayment,
  markOrderAsPaid_,
  removeOrder,
} from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizedAdmin, getAllOrders);

orderRoutes.route("/mine").get(authenticate, getUserOrders);
orderRoutes.route("/total-orders").get(countTotalOrders);
orderRoutes.route("/total-sales").get(countTotalSales);
orderRoutes.route("/total-sales-by-date").get(calculateTotalSalesByDate);
orderRoutes
  .route("/:id")
  .get(authenticate, findOrderById)
  .delete(authenticate, removeOrder);
orderRoutes.route("/:id/payment-method").put(authenticate, editPaymentMethod);
orderRoutes.route("/:id/create-paypal").post(authenticate, createPaypalOrder);
orderRoutes.route("/:id/capture-paypal").put(authenticate, capturePaypalOrder);
orderRoutes.route("/:id/create-stripe").post(authenticate, createPaymentIntent);
orderRoutes.route("/:id/verify-stripe").put(authenticate, verifyStripePayment);
orderRoutes.route("/:id/pay").put(authenticate, markOrderAsPaid_);
orderRoutes
  .route("/:id/deliver")
  .put(authenticate, authorizedAdmin, markOrderAsDelivered);

export { orderRoutes };
