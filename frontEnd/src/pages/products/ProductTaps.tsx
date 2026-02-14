import { useState } from "react";
import { useGetTopProductsQuery } from "../../redux/features/product/productApiSlice";
import type { Product } from "../../redux/features/product/productsTypes";
import type { User } from "../../redux/features/users/usersTypes";
import { Loader } from "../../components/Loader";
import { Link } from "react-router-dom";
import { Rating } from "./Rating";
import SmallProduct from "./SmallProduct";

const ProductTaps = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}: {
  loadingProductReview: boolean;
  userInfo: User;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  product: Product;
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTap, setActiveTap] = useState<number>(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber: number) => {
    setActiveTap(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <section className="mr-20">
        <button
          className={`block flex-1 p-4 cursor-pointer text-lg ${activeTap === 1 ? "font-black" : ""}`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </button>
        <button
          className={`block flex-1 p-4 cursor-pointer text-lg ${activeTap === 2 ? "font-black" : ""}`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </button>
        <button
          className={`block flex-1 p-4 cursor-pointer text-lg ${activeTap === 3 ? "font-black" : ""}`}
          onClick={() => handleTabClick(3)}
        >
          Related Product
        </button>
      </section>
      {/* Second Part */}
      <section>
        {activeTap === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label htmlFor="rating" className="block text-xl mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="p-2 border rounded-lg xl:w-160 "
                  >
                    <option value="" hidden>
                      Select
                    </option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>
                <div className="my-2">
                  <label htmlFor="comment" className="text-xl mb-2 block">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg xl:w-160 "
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 px-4 py-2 text-white rounded-lg"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please{" "}
                <Link to="/login" className="text-pink-500 font-bold underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        {activeTap === 2 && (
          <>
            <div>{product.reviews?.length === 0 && <p>No Reviews</p>}</div>

            <div>
              {product?.reviews?.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1A1A1A] p-4 rounded-lg sm:ml-0 sm:w-96 xl:ml-8 xl:w-200 mb-2"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#b0b0b0]">{review.name}</strong>
                    <p className="text-[#b0b0b0]">
                      {review.createdAt?.substring(0, 10)}
                    </p>
                  </div>

                  <p className="my-4">{review.comment}</p>
                  <Rating value={review.rating} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section>
        {activeTap === 3 && (
          <section className="ml-16 flex flex-wrap">
            {isLoading ? (
              <Loader />
            ) : (
              data?.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export { ProductTaps };
