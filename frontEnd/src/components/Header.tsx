import ProductCarousel from "../pages/products/ProductCarousel";
import SmallProduct from "../pages/products/SmallProduct";
import { useGetTopProductsQuery } from "../redux/features/product/productApiSlice";
import { handleCatchError } from "../Utils/handleCatchError";
import { Loader } from "./Loader";
import { Message } from "./Message";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div>
        {" "}
        Loading... <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <Message variant="error">{handleCatchError(error)}</Message>
      </div>
    );
  }
  return (
    <div className="flex max-[1550px]:flex-col items-center justify-around gap-[1%] max-w-420 mx-auto">
      <div className="xl:block w-160 max-[380px]:w-[80%]">
        <div className="grid grid-cols-2 w-full gap-1 max-sm:grid-cols-1">
          {data?.map((product) => (
            <div key={product._id} className="place-items-center">
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCarousel />
    </div>
  );
};

export { Header };
