import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import type { Product } from "../redux/features/product/productsTypes";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import { APP_NAME } from "../config/constants";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cart);
  const { cartItems } = cart;
  const addToCartHandler = (product: Product, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };
  return (
    <>
      <title>{APP_NAME + " - Cart"}</title>
      <div className="container flex justify-around items-start flex-wrap mx-auto min-[900px]:px-6 min-[1290px]:px-0 mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty{" "}
            <Link className="text-pink-500 underline cursor-pointer" to="/shop">
              Go To Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col w-[80%]">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center mb-4 pb-2">
                <div className="w-20 h-20">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 ml-4">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-pink-500 cursor-pointer"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-2 text-white">{item.brand}</div>
                  <div className="mt-2 text-white">{item.price}</div>
                </div>
                <div className="w-23">
                  <select
                    className="w-full p-1 border bounded text-white custom-select"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...new Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    className="text-red-500 mr-[20] cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-full"
                    onClick={() => removeFromCartHandler(item._id!)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 w-full">
              <div className="p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  Items [{cartItems.reduce((acc, item) => acc + item.qty, 0)}]
                </h2>
                <div className="text-2xl font-bold">
                  ${" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.price * item.qty, 0)
                    .toFixed(2)}
                </div>
                <button
                  className="bg-pink-500 mt-4 px-4 py-2 rounded-full text-lg w-full cursor-pointer"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { Cart };
