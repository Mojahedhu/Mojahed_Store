import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/features/product/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/features/category/categoryApiSlice";
import { toast } from "react-toastify";
import { handleCatchError } from "../../Utils/handleCatchError";
import { AdminMenu } from "./AdminMenu";
import { Loader } from "../../components/Loader";
import type { Product } from "../../redux/features/product/productsTypes";

const ProductList = () => {
  const [form, setForm] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories, isLoading } = useFetchCategoriesQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form?.name) return toast.error("Product name is required");
    if (!form?.description)
      return toast.error("Product description is required");
    if (!form?.price) return toast.error("Product price is required");
    if (!form?.category) return toast.error("Product category is required");
    if (!form?.quantity) return toast.error("Product quantity is required");
    if (!form?.brand) return toast.error("Product brand is required");
    if (!form?.countInStock)
      return toast.error("Product quantity in stock is required");
    if (!form?.image && form?.image_Id) {
      return "Image ans image_Id are required";
    }
    const {
      image,
      image_Id,
      name,
      brand,
      category,
      description,
      price,
      countInStock: stock,
      quantity,
    } = form;
    const productData = new FormData();
    productData.append("image", image);
    productData.append("image_Id", image_Id);
    productData.append("name", name);
    productData.append("brand", brand);
    productData.append("category", category);
    productData.append("description", description);
    productData.append("price", String(price));
    productData.append("countInStock", String(stock));
    productData.append("quantity", String(quantity));

    try {
      const { data, error } = await createProduct(productData);

      if (error) {
        toast.error(
          handleCatchError(error, "Product created field. Try Again later"),
        );
        return;
      }

      toast.success(`${data?.data.name} created successfully 🎉`);
      navigate("/admin/all-products-list");
    } catch (error) {
      toast.error(
        handleCatchError(error, "Product created field. Try Again later"),
      );
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return toast.error("No file selected");
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage({ formData }).unwrap();
      toast.success(res.message);
      setImageUrl(res.file.image);
      setForm((prev) =>
        prev
          ? {
              ...prev,
              image: res.file.image,
              image_Id: res.file.image_Id,
            }
          : {
              image: res.file.image,
              image_Id: res.file.image_Id,
              name: "",
              description: "",
              category: "",
              brand: "",
              quantity: 0,
              countInStock: 0,
              price: 0,
            },
      );
    } catch (error) {
      toast.error(handleCatchError(error));
    }
  };

  return (
    <>
      <title>Mojahed Store - Product List</title>
      <div className="container mx-36 max-sm:mx-5 max-md:mx-10 w-auto">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-9/10 p-3">
            <div className="h-12">Create Product</div>
            {imageUrl && (
              <div className="text-center">
                <img
                  src={imageUrl}
                  alt={"product"}
                  className="block mx-auto max-h-50 object-cover mb-5"
                />
              </div>
            )}

            <div className="mb-3 mx-3">
              <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 overflow-clip">
                {form?.image ?? "Upload Image "}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={imageUrl ? "text-red-500" : "hidden"}
                />
              </label>
            </div>

            <div className="p-3 max-md:flex max-md:flex-col max-md:justify-center max-md:items-center">
              <div className="flex flex-col md:flex-row w-full justify-between gap-[2%] md:w-[90%]">
                <div className="one w-full">
                  <label htmlFor="name">Name</label>
                  <br />
                  <input
                    id="name"
                    type="text"
                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={form?.name ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev!, name: e.target.value }))
                    }
                  />
                </div>
                <div className="two w-full">
                  <label htmlFor="price">Price</label>
                  <br />
                  <input
                    id="price"
                    type="number"
                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={form?.price ?? 0}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev!,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-full justify-between gap-[2%] md:w-[90%]">
                <div className="one w-full">
                  <label htmlFor="quantity">Quantity</label>
                  <br />
                  <input
                    type="number"
                    id="quantity"
                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={form?.quantity ?? 0}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev!,
                        quantity: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="two w-full">
                  <label htmlFor="brand">Brand</label>
                  <br />
                  <input
                    type="text"
                    id="brand"
                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                    value={form?.brand ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev!, brand: e.target.value }))
                    }
                  />
                </div>
              </div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form?.description ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev!, description: e.target.value }))
                }
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              ></textarea>
              <div className="flex max-sm:flex-col justify-between gap-[2%] w-full md:w-[90%]">
                <div className="flex flex-col justify-between gap-2 w-full">
                  <label htmlFor="stock">Count In Stock</label>
                  <input
                    type="number"
                    id="stock"
                    className="p-4 mb-3 border rounded-lg bg-[#101011] text-white"
                    value={form?.countInStock ?? 0}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev!,
                        countInStock: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col justify-between gap-2 w-full">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="p-4 mb-3 border rounded-lg bg-[#101011] text-white"
                    value={form?.category ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev!,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled hidden>
                      Choose Category
                    </option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-10 py-4 mt-5 rounded-lg text-lg font-bold bg-pink-500 hover:bg-pink-600 max-md:w-full"
              >
                {isLoading ? <Loader /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ProductList };
