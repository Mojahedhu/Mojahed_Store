import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import {
  savePaymentMethod,
  saveShippingAddress,
} from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useEffect, useTransition } from "react";
import { Loader } from "../../components/Loader";
import { SmartProgress } from "../../components/Progress";

const Shipping = () => {
  const cart = useAppSelector((state) => state.cart);
  const shippingAddress = cart.shippingAddress;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const paymentMethod =
    cart.paymentMethod || searchParams.get("paymentMethod") || "PayPal";
  const address = searchParams.get("address") || shippingAddress.address || "";
  const city = searchParams.get("city") || shippingAddress.city || "";
  const postalCode =
    searchParams.get("postalCode") || shippingAddress.postalCode || "";
  const country = searchParams.get("country") || shippingAddress.country || "";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const actionHandler = (formData: FormData) => {
    const { address, city, postalCode, country } = Object.fromEntries(
      formData.entries(),
    ) as Record<string, string>;

    // validation
    if (!address.toString().trim()) {
      toast.error("Address is required 📝");

      return;
    }
    if (!city.toString().trim()) {
      toast.error("City is required 📝city");
      return;
    }
    if (!postalCode.toString().trim()) {
      toast.error("Postal Code is required 📝");
      return;
    }
    if (!country.toString().trim()) {
      toast.error("Country is required 📝");
      return;
    }

    navigate({
      search: `?paymentMethod=${paymentMethod}&address=${address}&city=${city}&postalCode=${postalCode}&country=${country}`,
    });

    const shipping = {
      address: address.toString(),
      city: city.toString(),
      postalCode: postalCode.toString(),
      country: country.toString(),
    };
    startTransition(() => {
      setSearchParams({
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country,
        paymentMethod,
      });
      dispatch(saveShippingAddress(shipping));
      navigate("/place-order");
    });
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <div className="container mx-auto mt-10">
      <SmartProgress />
      <div className="mt-40 flex justify-around items-center flex-wrap">
        <form action={actionHandler} className="w-160">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <div className="flex flex-col mb-4">
            <label htmlFor="address" className="block text-white mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              defaultValue={address}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="city" className="block text-white mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              defaultValue={city}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="postalCode" className="block text-white mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              defaultValue={postalCode}
              className="w-full p-2 border rounded"
              placeholder="Enter postal code"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="country" className="block text-white mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              defaultValue={country}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="odd" className="block text-gray-600 ">
              Select Method
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-pink-500 accent-pink-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => {
                    dispatch(savePaymentMethod(e.target.value));
                  }}
                />
                <span className="ml-2">PayPal or Credit Card</span>
              </label>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-pink-500 accent-pink-500"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => {
                    dispatch(savePaymentMethod(e.target.value));
                  }}
                />
                <span className="ml-2">Stripe</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded-full text-lg w-full hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 cursor-pointer"
          >
            {isPending ? (
              <div className="mx-auto place-items-center">
                <Loader />
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export { Shipping };
