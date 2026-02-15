import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/features/product/productApiSlice";
import moment from "moment";
import { AdminMenu } from "./AdminMenu";
import { APP_NAME } from "../../config/constants";
import { Loader } from "../../components/Loader";
import { Message } from "../../components/Message";
import { handleCatchError } from "../../Utils/handleCatchError";

const AllProducts = () => {
  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery({});

  if (isLoading) {
    return (
      <div>
        <title>{APP_NAME + " - All Products"}</title>
        <div className="mx-auto place-items-center">
          <h4>Loading...</h4> <Loader />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <title>{APP_NAME + " - All Products"}</title>
        <div>
          <h1>Error</h1>
          <Message variant="error">
            {handleCatchError(error || "Something went wrong")}
          </Message>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>{APP_NAME + " - All Products"}</title>
      <div className="container w-auto xl:ml-30">
        <div className="flex flex-col md:flex-row">
          <div className="p-3 max-[1280px]:ml-16.5">
            <div className="ml-8 text-xl font-bold h-12">
              All Products {productsResponse?.products?.length}
            </div>
            <div className="grid grid-cols-1 min-[1300px]:grid-cols-2 gap-y-2 gap-x-8">
              {productsResponse?.products?.map((product) => (
                <div
                  key={product._id}
                  className="mb-4 p-2 rounded-md hover:bg-gray-700"
                >
                  <div className="mx-auto">
                    <div className="flex max-[1300px]:w-full flex-col border-b sm:flex-row sm:items-center sm:mb-0 md:border-none">
                      <div className="w-40 h-36">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-40 h-36 object-cover rounded-md"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-around">
                        <div className="flex justify-between">
                          <h5 className="text-xl font-semibold mb-2 min-[1400px]:w-57">
                            {product.name.length > 20
                              ? product.name.substring(0, 20) + "..."
                              : product.name}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {moment(product.createdAt).format("MMM Do YYYY")}
                          </p>
                        </div>
                        <p className="text-gray-400 min-[1400px]:w-120 md:w-80 sm:w-40 text-sm mb-4">
                          {product.description.length > 90
                            ? product.description.substring(0, 90) + "..."
                            : product.description}
                        </p>
                        <div className="flex justify-between">
                          <Link
                            className="inline-flex items-center px-3 py-2 font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                            to={`/admin/product/update/${product._id}`}
                          >
                            Product
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
                          <p>$ {product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export { AllProducts };
