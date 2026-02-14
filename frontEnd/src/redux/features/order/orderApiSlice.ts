import { API_ENDPOINTS } from "../../constants/endpoints";
import { apiSlice } from "../../services/api";
import type { CreateOrderDTO, OrderDTO, SalesByDate } from "./orderTypes";
import type { OnApproveActions } from "@paypal/paypal-js";

type OnApproveOrderDetails = Awaited<
  ReturnType<NonNullable<OnApproveActions["order"]>["capture"]>
>;

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderDTO[], void>({
      query: () => ({
        url: API_ENDPOINTS.ORDER_URL.BASE,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result
                .map((order) =>
                  order._id ? { type: "Order" as const, id: order._id } : null,
                )
                .filter(Boolean),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    createOrder: builder.mutation<OrderDTO, CreateOrderDTO>({
      query: (order) => ({
        url: API_ENDPOINTS.ORDER_URL.BASE,
        method: "POST",
        body: order,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
      async onQueryStarted(_order, { dispatch, queryFulfilled }) {
        try {
          const { data: createOrder } = await queryFulfilled;

          dispatch(
            orderApiSlice.util.updateQueryData(
              "getOrders",
              undefined,
              (draft) => {
                draft.unshift(createOrder);
              },
            ),
          );
        } catch {
          // Ignore mutation failed
        }
      },
    }),
    getOrderDetails: builder.query<OrderDTO, string>({
      query: (orderId) => ({
        url: API_ENDPOINTS.ORDER_URL.ORDER_BY_ID(orderId),
        skip: !orderId,
      }),

      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
    changePaymentMethod: builder.mutation<
      OrderDTO,
      { orderId: string; paymentMethod: "PayPal" | "stripe" }
    >({
      query: ({ orderId, paymentMethod }) => ({
        url: API_ENDPOINTS.ORDER_URL.CHANGE_PAYMENT_METHOD(orderId),
        method: "PUT",
        body: { paymentMethod },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    createPaypalOrder: builder.mutation<{ id: string }, string>({
      query: (orderId) => ({
        url: API_ENDPOINTS.ORDER_URL.CREATE_PAYPAL_ORDER(orderId),
        method: "POST",
      }),
    }),
    capturePaypalOrder: builder.mutation<
      OrderDTO,
      { orderId: string; paypalOrderId: string }
    >({
      query: ({ orderId, paypalOrderId }) => ({
        url: API_ENDPOINTS.ORDER_URL.CAPTURE_PAYPAL_ORDER(orderId),
        method: "PUT",
        body: { paypalOrderId },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    createStripePayment: builder.mutation<
      { clientSecret: string },
      { amount: number; orderId: string }
    >({
      query: ({ orderId, amount }) => ({
        url: API_ENDPOINTS.ORDER_URL.CREATE_STRIPE_PAYMENT(orderId),
        method: "POST",
        body: { amount },
      }),
    }),
    verifyStripePayment: builder.mutation<
      OrderDTO,
      { orderId: string; paymentIntentId: string }
    >({
      query: ({ orderId, paymentIntentId }) => ({
        url: API_ENDPOINTS.ORDER_URL.VERIFY_STRIPE_PAYMENT(orderId),
        method: "PUT",
        body: { paymentIntentId },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
    payOrder: builder.mutation<
      OrderDTO,
      { orderID: string; details: OnApproveOrderDetails; id: string }
    >({
      query: ({ orderID, details, id }) => ({
        url: API_ENDPOINTS.ORDER_URL.ORDER_PAY(id),
        method: "PUT",
        body: { details, orderId: orderID },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
    getPaypalClientId: builder.query<{ clientId: string }, void>({
      query: () => API_ENDPOINTS.PAYPAL_URL,
      keepUnusedDataFor: 60 * 60,
    }),
    getMyOrders: builder.query<OrderDTO[], void>({
      query: () => ({
        url: API_ENDPOINTS.ORDER_URL.MY_ORDERS,
      }),
      keepUnusedDataFor: 5,

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Order" as const, id: _id })),

              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    deliverOrder: builder.mutation<OrderDTO, string>({
      query: (orderId) => ({
        url: API_ENDPOINTS.ORDER_URL.ORDER_DELIVER(orderId),
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          orderApiSlice.util.updateQueryData(
            "getOrderDetails",
            orderId,
            (draft) => {
              draft.isDelivered = true;
              draft.deliveredAt = new Date().toISOString();
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    getTotalOrders: builder.query<{ totalOrdersCount: number }, void>({
      query: () => API_ENDPOINTS.ORDER_URL.TOTAL_ORDERS,
      keepUnusedDataFor: 60,
      providesTags: () => [{ type: "Order", id: "STATS" }],
    }),
    getTotalSales: builder.query<
      { totalSales: { totalSales: number; _id: string }[] },
      void
    >({
      query: () => API_ENDPOINTS.ORDER_URL.TOTAL_SALES,
      keepUnusedDataFor: 60,
      providesTags: () => [{ type: "Order", id: "STATS" }],
    }),
    getTotalSalesByDate: builder.query<SalesByDate[], void>({
      query: () => API_ENDPOINTS.ORDER_URL.TOTAL_SALES_BY_DATE,
      keepUnusedDataFor: 60,
      providesTags: () => [{ type: "Order", id: "STATS" }],
    }),
    deleteOrder: builder.mutation<{ message: string }, string>({
      query: (orderId) => ({
        url: API_ENDPOINTS.ORDER_URL.ORDER_BY_ID(orderId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          orderApiSlice.util.updateQueryData(
            "getOrders",
            undefined,
            (draft) => {
              if (!draft.length) return;
              const index = draft.findIndex((o) => o._id === orderId);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  //------------------------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useChangePaymentMethodMutation,
  usePayOrderMutation,
  useCreatePaypalOrderMutation,
  useCapturePaypalOrderMutation,
  useCreateStripePaymentMutation,
  useVerifyStripePaymentMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useDeleteOrderMutation,
} = orderApiSlice;
