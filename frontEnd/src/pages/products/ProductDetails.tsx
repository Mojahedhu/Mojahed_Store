import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useState } from "react";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../../redux/features/product/productApiSlice";
import { toast } from "react-toastify";
import { handleCatchError } from "../../Utils/handleCatchError";
import { Loader } from "../../components/Loader";
import { Message } from "../../components/Message";
import { HeartIcon } from "./HeartIcon";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { VscOpenPreview } from "react-icons/vsc";
import moment from "moment";
import { Rating } from "./Rating";
import { ProductTaps } from "./ProductTaps";
import type { Product } from "../../redux/features/product/productsTypes";
import { addToCart } from "../../redux/features/cart/cartSlice";
const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [qty, setQty] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId!);

  const { userInfo } = useAppSelector((state) => state.auth);

  const [createReviews, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createReviews({
        _id: productId!,
        rating,
        comment,
      }).unwrap();
      toast.success("Review submitted successfully 🎉");
    } catch (err) {
      toast.error(handleCatchError(err, "Error submitting review"));
    }
  };

  const addToProductHandler = (product: Product, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <>
        <div>
          <button
            onClick={() => navigate(-1)} // navigate to the previous page
            className="text-white font-semibold hover:underline ml-40 hover:cursor-pointer"
          >
            Go Back
          </button>
        </div>
        <Loader />
      </>
    );
  }

  return (
    <>
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-white font-semibold hover:underline ml-40 hover:cursor-pointer"
        >
          Go Back
        </button>
      </div>
      {error ? (
        <Message variant="error">{handleCatchError(error)}</Message>
      ) : (
        <div className="flex flex-wrap relative justify-between mt-8 ml-40">
          <div>
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full rounded-2xl mr-8 sm:w-80 md:w-120 lg:w-180 xl:200"
            />
            <HeartIcon product={product!} />
          </div>

          <div className="flex flex-col justify-between">
            <h2 className="text-2xl font-semibold">{product?.name}</h2>
            <p className="my-4 md:w-120 lg:w-140 text-[#b0b0b0]">
              {product?.description}
            </p>
            <p className="text-5xl font-extrabold my-4">$ {product?.price}</p>
            <div className="flex items-center justify-between w-80">
              <div className="one">
                <h1 className="flex items-center mb-6">
                  <FaStore className="mr-2 text-white" /> Brand:{" "}
                  {product?.brand}
                </h1>
                <h1 className="flex items-center mb-6 w-50">
                  <FaClock className="mr-2 text-white" /> Added:{" "}
                  {moment(product?.createdAt).fromNow()}
                </h1>
                <h1 className="flex items-center mb-6">
                  <VscOpenPreview className="mr-2 text-white" /> Reviews:{" "}
                  {product?.numReviews}
                </h1>
              </div>
              <div className="two">
                <h1 className="flex items-center mb-6">
                  <FaStar className="mr-2 text-white" /> Ratings:{" "}
                  {product?.rating}
                </h1>
                <h1 className="flex items-center mb-6 w-50">
                  <FaShoppingCart className="mr-2 text-white" /> Quantity{" "}
                  {moment(product?.createdAt).fromNow()}
                </h1>
                <h1 className="flex items-center mb-6">
                  <FaBox className="mr-2 text-white" /> In Stock{" "}
                  {product?.countInStock}
                </h1>
              </div>
            </div>
            <div className="flex flex-between justify-between flex-wrap pr-18">
              <Rating
                value={product?.rating || 0}
                text={`${product?.numReviews} reviews`}
              />
              {product && product?.countInStock > 0 && (
                <div>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-2 w-24 rounded-lg  custom-select border"
                  >
                    {[...new Array(product?.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="btn-container">
              <button
                disabled={product?.countInStock === 0}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg mt-4 md:mt-0"
                onClick={() => addToProductHandler(product!, qty)}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className="mt-20 container flex flex-wrap items-start justify-between">
            <ProductTaps
              loadingProductReview={loadingProductReview}
              userInfo={userInfo!}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product!}
            />
          </div>
        </div>
      )}
    </>
  );
};

export { ProductDetails };
