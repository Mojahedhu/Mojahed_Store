import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useCreateOrderMutation } from "../../redux/features/order/orderApiSlice";
import { useEffect } from "react";
import { handleCatchError } from "../../Utils/handleCatchError";
import { SmartProgress } from "../../components/Progress";
import { Message } from "../../components/Message";
import { Loader } from "../../components/Loader";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useAppSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, cart.shippingAddress.address, cart.paymentMethod]);

  const dispatch = useAppDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      console.log(error);
      handleCatchError(error, "Error creating order");
    }
  };
  return (
    <>
      <div className="mt-5"></div>
      <SmartProgress />
      <div className="container mx-auto mt-8 px-10">
        {cart.cartItems.length === 0 ? (
          <div className="max-[1290px]:ml-20 max-lg:ml-0 w-[80%]">
            <Message>Your cart is empty</Message>
          </div>
        ) : (
          <div className="cus-scr overflow-x-auto scrollbar-track-green-50 scrollbar-w-10">
            <table className="w-full max-[1290px]:w-[91%] border max-[1290px]:ml-20 max-lg:ml-0">
              <thead>
                <tr>
                  <td className="px-1 py2 text-center align-top">Image</td>
                  <td className="px-1 py2 text-left">Product</td>
                  <td className="px-1 py2 text-left">Quantity</td>
                  <td className="px-1 py2 text-left">Price</td>
                  <td className="px-1 py2 text-center">Total</td>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="p-2 place-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">$ {item.price.toFixed(2)}</td>
                    <td className="p-2 text-center">
                      $ {item.qty * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 max-[1290px]:ml-20 max-lg:ml-0">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">Items:</span> ${" "}
                {cart.itemsPrice.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold mb-4">Shipping:</span> ${" "}
                {cart.shippingPrice.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold mb-4">Tax:</span> ${" "}
                {cart.taxPrice.toFixed(2)}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> ${" "}
                {cart.totalPrice.toFixed(2)}
              </li>
            </ul>
            {error && <Message>{handleCatchError(error)}</Message>}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method: </strong> {cart.paymentMethod}
            </div>
          </div>
          <button
            type="button"
            className="bg-pink-500 text-white px-4 py-2 rounded-full w-full mt-4 "
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            {isLoading ? (
              <div className="mx-auto place-items-center">
                <Loader />
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export { PlaceOrder };
