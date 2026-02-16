import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCapturePaypalOrderMutation,
  useChangePaymentMethodMutation,
  useCreatePaypalOrderMutation,
  useDeleteOrderMutation,
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../redux/features/order/orderApiSlice";
import { useAppSelector } from "../redux/app/hooks";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { handleCatchError } from "../Utils/handleCatchError";
import type { OnApproveData } from "@paypal/paypal-js";
import { Loader } from "./Loader";
import { Message } from "./Message";
import clsx from "clsx";
import { FaTrash } from "react-icons/fa";
import { useConfirm } from "./ConfirmDialogue";
import { CheckoutCard } from "./CheckoutCard";

const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!);
  console.log(order?.paymentMethod);
  const [deleteOrder] = useDeleteOrderMutation();
  const [changePaymentMethod] = useChangePaymentMethodMutation();
  const [createPayPalOrder] = useCreatePaypalOrderMutation();
  const [capturePayPalOrder, { isLoading: loadingPay }] =
    useCapturePaypalOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Order",
      description: "This action cannot be undone",
      confirmText: "Delete",
    });
    if (!ok) return;
    try {
      await deleteOrder(orderId!);
      navigate(-1);
    } catch (error) {
      toast.error(handleCatchError(error, "Sorry, order deletion failed"));
    }
  };

  const handlePaymentMethod = async (paymentMethod: "PayPal" | "stripe") => {
    try {
      await changePaymentMethod({ orderId: orderId!, paymentMethod }).unwrap();
    } catch (error) {
      toast.error(handleCatchError(error, "Error changing payment method"));
    }
  };

  const createOrder = async () => {
    const res = await createPayPalOrder(orderId!).unwrap();
    toast.info("Payment processing please wait... ⌛");
    return res.id; // Paypal order id
  };

  const pollPaymentStatus = async () => {
    const interval = setInterval(async () => {
      toast.loading("Payment processing please wait... ⌛");
      const { data } = await refetch();

      if (data?.isPaid) {
        clearInterval(interval);
        toast.success("Order paid successfully 🎉");
      }
    }, 5000);
  };
  const onApprove = async (data: OnApproveData): Promise<void> => {
    if (!order?._id) return;
    try {
      await capturePayPalOrder({
        orderId: orderId!,
        paypalOrderId: data.orderID,
      }).unwrap();
      pollPaymentStatus();
    } catch (error) {
      toast.error(
        handleCatchError(error, String(error) || "Error capturing payment"),
      );
    }
  };

  const onError = (err: unknown) => {
    toast.error(handleCatchError(err, "PayPal payment failed"));
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId!);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="mx-[20%]">
        <Message variant="error">
          {handleCatchError(
            error,
            "Sorry, something went wrong on loading order details",
          )}
        </Message>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 ml-40">
        <button
          className="px-4 py-1 bg-pink-500 font-semibold rounded-lg hover:bg-pink-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="container flex flex-col md:flex-row ml-40 w-auto">
        <div className="md:w-2/3 pr-4">
          <div className="border text-gray-300 my-5 pb-5">
            {order?.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="overflow-x-auto cus-scr">
                <table className="w-[80%] mx-auto">
                  <thead className="border-b-2">
                    <tr>
                      <th className="p-2">Image</th>
                      <th className="p-2">Product</th>
                      <th className="p-2 text-center">Quantity</th>
                      <th className="p-2">Unit Price</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.orderItems.map((item) => (
                      <tr key={item._id}>
                        <td className="p-2 place-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-pink-500 underline"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-2 text-center">{item.qty}</td>
                        <td className="p-2 text-center">$ {item.price}</td>
                        <td className="p-2 text-center">
                          $ {(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <button
            className={clsx(
              "px-4 py-1 rounded-full cursor-pointer hover:underline hover:bg-pink-700 active:bg-pink-900",
              order?.isDelivered && order.isPaid
                ? "bg-pink-500"
                : "bg-gray-700",
            )}
            disabled={!order?.isDelivered || !order.isPaid}
            onClick={() => handleDelete()}
          >
            <FaTrash />
          </button>
        </div>

        <div className="md:w-1/3 max-md:flex max-md:flex-col mr-4">
          <div className="mt-5 border-gray-300 pb-4 mb-4">
            <h2 className="text-2xl font-bold mb-2 ">Shipping</h2>
            <p className="my-4">
              <strong className="text-pink-500">Order:</strong> {order?._id}
            </p>
            <p className="mb-4">
              <strong className="text-pink-500">Name:</strong>{" "}
              {order?.user.username}
            </p>
            <p className="mb-4">
              <strong className="text-pink-500">Email:</strong>{" "}
              {order?.user.email}
            </p>
            <p className="mb-4">
              <strong className="text-pink-500">Address:</strong>{" "}
              {order?.shippingAddress.address}, {order?.shippingAddress.city},{" "}
              {order?.shippingAddress.postalCode},{" "}
              {order?.shippingAddress.country}
            </p>
            {order?.isPaid ? (
              <Message
                variant="succuss"
                className="max-[1300px]:w-full text-center"
              >
                Paid on {order.paidAt.toLocaleString()}
              </Message>
            ) : (
              <Message
                variant="error"
                className="max-[1300px]:w-full text-center"
              >
                Not paid
              </Message>
            )}
          </div>

          <h2 className="text-xl font-bold mb-2 mt-12 ">Order Summary</h2>
          <div className="flex justify-between mb-2  max-[1300px]:w-full">
            <span>Items</span>
            <span>$ {order?.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2  max-[1300px]:w-full">
            <span>Shipping</span>
            <span>$ {order?.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2  max-[1300px]:w-full">
            <span>Tax</span>
            <span>$ {order?.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2  max-[1300px]:w-full">
            <span>Total</span>
            <span>$ {order?.totalPrice.toFixed(2)}</span>
          </div>
          {!order?.isPaid && (
            <div className="w-full my-2">
              <button
                className={clsx(
                  "px-4 py-1 rounded-full cursor-pointer w-full mb-2  active:bg-pink-900 active:scale-95",

                  order?.paymentMethod === "PayPal"
                    ? "bg-pink-500"
                    : "bg-gray-700",
                )}
                onClick={() => handlePaymentMethod("PayPal")}
              >
                PayPal
              </button>
              <button
                className={clsx(
                  "px-4 py-1 rounded-full cursor-pointer w-full active:bg-pink-900 active:scale-95",
                  order?.paymentMethod === "stripe"
                    ? "bg-pink-500"
                    : "bg-gray-700",
                )}
                onClick={() => handlePaymentMethod("stripe")}
              >
                Stripe
              </button>
            </div>
          )}
          {!order?.isPaid && (
            <div className="max-[1300px]:w-full">
              {loadingPay && <Loader />}
              {order?.paymentMethod === "PayPal" &&
                (loadingPay ? (
                  <Loader />
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                      forceReRender={[order?.totalPrice]}
                    />
                  </div>
                ))}
              {order?.paymentMethod === "stripe" && (
                <CheckoutCard
                  orderId={orderId!}
                  amount={order?.totalPrice ?? 0}
                />
              )}
            </div>
          )}

          {loadingDeliver && (
            <div className="mx-auto place-items-center">
              <Loader />{" "}
            </div>
          )}
          {userInfo &&
            userInfo.isAdmin &&
            order?.isPaid &&
            !order?.isDelivered && (
              <div className="max-[1300px]:w-full">
                <button
                  type="button"
                  className="bg-pink-500 text-white py-2 w-full rounded-md hover:bg-pink-600"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
        </div>
      </div>
      {ConfirmDialog}
    </div>
  );
};

export { Order };
