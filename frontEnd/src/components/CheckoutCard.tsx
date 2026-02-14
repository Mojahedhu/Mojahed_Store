import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  useCreateStripePaymentMutation,
  useVerifyStripePaymentMutation,
} from "../redux/features/order/orderApiSlice";
import { toast } from "react-toastify";
import { handleCatchError } from "../Utils/handleCatchError";
import { Loader } from "./Loader";
import { useState } from "react";

const CheckoutCard = ({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState<boolean>(false);

  const [stripePayment, { isLoading }] = useCreateStripePaymentMutation();
  const [verifyStripePayment] = useVerifyStripePaymentMutation();

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      // 1️⃣ create stripe payment intent
      const data = await stripePayment({
        orderId,
        amount,
      }).unwrap();
      const clientSecret = data.clientSecret;

      // 2️⃣ confirm card payment

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result?.error) {
        console.log("card error", result?.error);
        toast.error(result?.error.message || "Error processing payment");
        setLoading(false);
      }

      if (result?.paymentIntent?.status === "succeeded") {
        // Verify with backend (Pro way)
        const updatedOrder = await verifyStripePayment({
          orderId,
          paymentIntentId: result.paymentIntent.id,
        }).unwrap();
        setLoading(false);
        if (updatedOrder.isPaid) {
          toast.success("Order paid successfully 🎉");
        } else {
          toast.error(
            "Payment confirmed with Stripe, but order not updated yet. Please try again later.",
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(handleCatchError(error, "Error processing payment"));
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto bg-gray-800 shadow-xl rounded-2xl p-6 space-y-5 border">
      <h2 className="text-xl font-semibold text-gray-50">Secure Payment</h2>

      {/* Card UI */}
      <div className="p-4 border-gray-700 rounded-xl bg-gray-700">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#f9fafb", // text color
                fontFamily: "Inter, system-ui, sans-serif",
                "::placeholder": { color: "#9ca3af" },
                iconColor: "#e5e7eb",
              },
              invalid: {
                color: "#e5e7eb",
                iconColor: "#e5e7eb",
              },
            },
          }}
        />
      </div>
      {/* button */}
      <button
        onClick={handlePay}
        disabled={!stripe || loading || isLoading}
        className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 active:scale-95 active:bg-pink-600 text-center place-items-center"
      >
        {isLoading || loading ? <Loader /> : "Pay Now"}
      </button>

      <p className="text-xs text-gray-400 text-center">Power By Stripe</p>
    </div>
  );
};

export { CheckoutCard };
