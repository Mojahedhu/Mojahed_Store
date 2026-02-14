import { APP_NAME } from "../../config/constants";
import { useAppSelector } from "../../redux/app/hooks";
import { Product } from "./Product";

const Favorites = () => {
  const favorites = useAppSelector((state) => state.favorites);

  return (
    <>
      <title>{APP_NAME + " - Favorites"}</title>
      <div className="md:ml-40 ">
        <h1 className="text-lg font-bold ml-12 mt-12">FAVORITE PRODUCTS</h1>
        <div className="flex flex-wrap max-md:justify-center">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export { Favorites };
