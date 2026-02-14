import { Link } from "react-router-dom";
import type { Product } from "../../redux/features/product/productsTypes";
import { HeartIcon } from "./HeartIcon";

const SmallProduct = ({ product }: { product: Product }) => {
  return (
    <div className="w-80 max-[380px]:ml-8 p-3 max-[380px]:w-[95%]">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-47 w-full rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div>{product.name}</div>
            <span className="text-pink-800 bg-pink-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
