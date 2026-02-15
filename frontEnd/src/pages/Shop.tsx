import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../redux/app/hooks";
import { useFetchCategoriesQuery } from "../redux/features/category/categoryApiSlice";
import { useGetFilteredProductsQuery } from "../redux/features/product/productApiSlice";
import { setChecked, setRadio } from "../redux/features/shop/shopSlice";
import { Loader } from "../components/Loader";
import { useDebounce } from "../hooks/debounce";
import { useSearchParams } from "react-router";
import { ProductCard } from "./products/ProductCard";
import { useAutoHeight } from "../hooks/useAutoHeight";
import { APP_NAME } from "../config/constants";

const Shop = () => {
  const dispatch = useAppDispatch();
  const DEFAULT_PRICE = 100000;
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { ref, style } = useAutoHeight(showFilter);

  // 🔹 URL-derived state
  const checked = (searchParams.get("categories") as string)?.split(",") || [];
  const priceParams = (searchParams.get("price") as string) || "";
  const brand = (searchParams.get("brand") as string) || "";

  useEffect(() => {
    if (!searchParams.get("price")) {
      setSearchParams((prev) => {
        prev.set("price", DEFAULT_PRICE.toString());
        return prev;
      });
    }
  }, [searchParams, setSearchParams]);

  const debouncePrice = useDebounce(priceParams, 500);

  // 🔹 Sync URL -> Redux (one way)
  useEffect(() => {
    dispatch(setChecked(checked));
    dispatch(setRadio(priceParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Fetch categories
  const { data: categories = [] } = useFetchCategoriesQuery();

  // Fetch Products (SERVER-SIDE BRAND FILTER)
  const { data: products = [], isLoading } = useGetFilteredProductsQuery({
    checked,
    radio: debouncePrice,
  });

  // 🔹 Client-side brand filter (cheap operation)
  const filterProduct = useMemo(() => {
    if (!products) return [];
    if (!brand) return products;

    return products.filter((product) =>
      brand ? product.brand === brand : true,
    );
  }, [products, brand]);

  // 🔹 Unique Brands
  const uniqueBrands = useMemo(() => {
    return [...new Set(products?.map((p) => p.brand).filter(Boolean))];
  }, [products]);

  useEffect(() => {
    dispatch(setRadio(debouncePrice));
  }, [debouncePrice, dispatch]);

  // 🔹 Handler update URL
  const handleCategoryChange = (checkedValue: boolean, id: string) => {
    const updatedChecked = checkedValue
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    setSearchParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      updatedChecked.length
        ? prev.set("categories", updatedChecked.join(","))
        : prev.delete("categories");
      return prev;
    });
  };

  const handlePriceChange = (value: string) => {
    setSearchParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      value ? prev.set("price", value) : prev.delete("price");
      return prev;
    });
  };
  const handleBrandChange = (value: string) => {
    setSearchParams((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      value ? prev.set("brand", value) : prev.delete("brand");
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams({ price: DEFAULT_PRICE.toString() });
  };

  return (
    <>
      <title>{APP_NAME + " - Shop"}</title>
      <div className="container mx-auto">
        <div className="max-[1281px]:ml-16">
          <div className="flex flex-col md:flex-row">
            {/* Mobile / Tablet filter toggle */}
            <div className="md:hidden mb-3">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="w-full bg-black text-white py-2 rounded-lg flex justify-between items-center px-4"
              >
                <span>Filters</span>
                <span
                  className={`transition-transform duration-300 ${
                    showFilter ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
            </div>
            {/* Filter wrapper */}
            <div className="flex max-md:justify-center">
              <div
                className={`
                          max-md:overflow-hidden
                          transition-[max-height, width] duration-2000 ease-in-out`}
                style={{
                  ...style,
                }}
              >
                {/* Filter content */}
                <div className={`bg-[#151515] p-3 my-2 `} ref={ref}>
                  <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                    Filter by categories
                  </h2>
                  <div className="p-5 w-60">
                    {categories?.map((c) => (
                      <div className="mb-2" key={c._id}>
                        <div className="flex items-center mr-4">
                          <input
                            checked={checked.includes(c._id)}
                            type="checkbox"
                            id={`red-checkbox-${c._id}`}
                            onChange={(e) =>
                              handleCategoryChange(e.target.checked, c._id)
                            }
                            className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-pink-500"
                          />
                          <label
                            htmlFor={`red-checkbox-${c._id}`}
                            className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                          >
                            {c.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                    Filter By Brands
                  </h2>
                  <div className="p-5">
                    {uniqueBrands.map((b) => (
                      <div key={b} className="flex items-center mr-5 mb-5">
                        <input
                          type="radio"
                          id={`brand-${b}`}
                          name="brand"
                          checked={brand === b}
                          onChange={() => handleBrandChange(b)}
                          className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 accent-pink-500"
                        />
                        <label
                          htmlFor={`brand-${b}`}
                          className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                        >
                          {b}
                        </label>
                      </div>
                    ))}
                  </div>

                  <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                    Filter By Max Price
                  </h2>
                  <div className="p-5 w-60">
                    <input
                      type="number"
                      value={priceParams}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="Enter price"
                      className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                    />
                  </div>
                  <div className="p-5 pt-0">
                    <button
                      className="w-full border my-4 bg-pink-500 rounded cursor-pointer active:bg-pink-700"
                      onClick={() => {
                        handleReset();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                {/* Filter content */}
              </div>
            </div>

            <div className="p-3 place-items-center">
              <h2 className="h4 text-center mb-2">
                {filterProduct?.length} Products
              </h2>
              <div className="flex flex-wrap max-md:justify-center">
                {isLoading && (
                  <div className="mx-auto my-5">
                    <Loader />
                  </div>
                )}
                {products?.length === 0 ? (
                  <div className="flex flex-col items-center space-y-2 mx-auto">
                    <h4>No products found for the selected filters.</h4>
                    <span>...</span>
                  </div>
                ) : (
                  filterProduct?.map((product) => (
                    <div className="p-3" key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Shop };
