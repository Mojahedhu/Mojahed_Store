import { useDispatch } from "react-redux";
import type { Product } from "../../redux/features/product/productsTypes";
import { increaseQty } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { HeartIcon } from "./HeartIcon";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAppSelector } from "../../redux/app/hooks";

const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  const addToCartHandler = (product: Product) => {
    const cartItem = cartItems.find((item) => item._id === product._id);
    if (cartItem?.qty === product.countInStock) {
      return toast.error(
        "Sorry! This product is out of stock, we will add it soon",
        {
          position: "top-right",
          autoClose: 2000,
        },
      );
    }
    dispatch(increaseQty(product));
    toast.success("Item added to cart successfully 🎉", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-sm relative hover:bg-gray-200/30 bg-[#1a1a1a] rounded-lg shadow dark:bg-gray-800 dark:border=gray-700">
      <section className="relative">
        <Link to={`/product/${product._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {product.brand}
          </span>
          <img
            className="lg:w-100 rounded-lg"
            src={product.image}
            alt={product.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={product} />
      </section>
      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-xl text-white w-55">{product.name}</h5>
          <p className="text-white font-semibold bg-pink-500 rounded px-2 py-1 text-center h-fit">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <p className="mb-3 font-normal text-[#cfcfcf] w-70">
          {product.description.substring(0, 60)} ...
        </p>
        <section className="flex justify-between items-center">
          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
          <button
            className="p-2 rounded-full cursor-pointer bg-gray-500 hover:bg-gray-600 active:bg-pink-600"
            onClick={() => addToCartHandler(product)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export { ProductCard };
