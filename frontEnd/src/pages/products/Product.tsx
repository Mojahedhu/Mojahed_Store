import { Link } from "react-router-dom";
import type { Product as ProductType } from "../../redux/features/product/productsTypes";
import { HeartIcon } from "./HeartIcon";

function Product({ product }: Readonly<{ product: ProductType }>) {
  return (
    <div className="sm:ml-8 p-3 relative hover:bg-gray-700">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-120 h-60 rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name.slice(0, 23) + "..."}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-lg dark:bg-pink-900 dark:text-pink-300">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
}

export { Product };
