import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/features/product/productApiSlice";
import { Loader } from "../components/Loader";
import { Message } from "../components/Message";
import { handleCatchError } from "../Utils/handleCatchError";
import { Header } from "../components/Header";
import { Product } from "./products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, error, isLoading, isError } = useGetProductsQuery({ keyword });

  if (isLoading) {
    return (
      <>
        <title>Mojahed Store - Home</title>
        <div className="mx-auto place-items-center">
          <h4>Loading...</h4> <Loader />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>Mojahed Store - Home</title>
        <div>
          <h1>Error</h1>
          <Message variant="error">{handleCatchError(error)}</Message>
        </div>
      </>
    );
  }

  return (
    <>
      <title>Mojahed Store - Home</title>
      {!keyword && <Header />}

      <div className="flex max-sm:flex-col justify-around items-center max-w-420 mx-auto">
        <h1 className="sm:mt-40 text-[3rem] text-center">Special Products</h1>
        <Link
          to={"/shop"}
          className="bg-pink-600 font-bold rounded-full py-2 px-10 mt-2 sm:mt-40"
        >
          Shop
        </Link>
      </div>
      <div>
        <div className="justify-items-center">
          <div className="max-sm:grid-cols-1 grid grid-cols-2 xl:mx-10 xl:grid-cols-3 mt-8 justify-center">
            {data?.products.map((product) => (
              <div key={product._id} className="max-[300px]:w-[90%]">
                {<Product product={product} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export { Home };
