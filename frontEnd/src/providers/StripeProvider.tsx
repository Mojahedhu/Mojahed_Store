import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripPromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY || "");

export const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  return <Elements stripe={stripPromise}>{children}</Elements>;
};
