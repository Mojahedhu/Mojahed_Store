import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/features/product/productApiSlice";
import { useEffect, useState } from "react";
import { useFetchCategoriesQuery } from "../../redux/features/category/categoryApiSlice";
import { toast } from "react-toastify";
import { handleCatchError } from "../../Utils/handleCatchError";
import { useConfirm } from "../../components/ConfirmDialogue";
import { AdminMenu } from "./AdminMenu";
import { Loader } from "../../components/Loader";
import type { Product } from "../../redux/features/product/productsTypes";
import { APP_NAME } from "../../config/constants";

const AdminProductUpdate = () => {
  const { _id } = useParams();

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductByIdQuery(_id!, { skip: !_id });
  console.log(productData);

  const [form, setForm] = useState<Product | null>(null);

  useEffect(() => {
    if (productData && !form) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(productData);
    }
  }, [productData, form]);

  const navigate = useNavigate();

  const { confirm, ConfirmDialog } = useConfirm();

  // Fetching categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct, { isLoading, error }] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct, { isLoading: isLoadingDelete }] =
    useDeleteProductMutation();

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return toast.error("No file selected");
    const sp = new URLSearchParams(window.location.search);
    if (form?.image_Id) sp.set("image_Id", form?.image_Id);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    console.log(`?${sp}`);
    try {
      let res;
      if (sp.get("image_Id")) {
        res = await uploadProductImage({
          formData,
          query: `?${sp}`,
        }).unwrap();
      } else {
        res = await uploadProductImage({
          formData,
        }).unwrap();
      }

      toast.success(res.message, {
        position: "top-right",
        autoClose: 2000,
      });
      setForm((prev) => ({
        ...prev!,
        image: res.file.image,
        image_Id: res.file.image_Id,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(handleCatchError(error || "Error uploading file"));
    }
  };

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
    if (!form.image && !form.image_Id) {
      return toast.error("Image and image_Id are required");
    }
    try {
      const formData = new FormData();
      formData.append("name", form?.name ?? "");
      formData.append("description", form?.description ?? "");
      formData.append("price", String(form?.price ?? 0));
      formData.append("category", form?.category ?? "");
      formData.append("quantity", String(form?.quantity ?? 0));
      formData.append("brand", form?.brand ?? "");
      formData.append("countInStock", String(form?.countInStock || 0));
      if (form?.image) {
        formData.append("image", form?.image);
        formData.append("image_Id", form?.image_Id);
      }

      // Update Product using the RTK Query mutation
      const data = await updateProduct({
        productId: _id!,
        formData,
      }).unwrap();
      if (error) {
        console.log("Update product error", error);
        toast.error(
          handleCatchError(error, "Product updating failed, please try later"),
          {
            position: "top-right",
            autoClose: 2000,
          },
        );
      }
      console.log(data);
      toast.success("Product successfully updated 🎉", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/all-products-list");
    } catch (error) {
      console.log("Update product error", error);
      toast.error(
        handleCatchError(error, "Product updating failed, please try later"),
        {
          position: "top-right",
          autoClose: 2000,
        },
      );
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete product",
      description: "This action cannot be undone.",
      confirmText: "Delete",
    });

    if (!ok) return;
    try {
      const product = await deleteProduct(_id!).unwrap();

      toast.success(`${product?.name} successfully deleted 🎉`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/all-products-list");
    } catch (error) {
      console.log("Delete product error", error);
      toast.error(
        handleCatchError(error, "Product deletion failed, please try later"),
        {
          position: "top-right",
          autoClose: 2000,
        },
      );
    }
  };

  return (
    <>
      <title>{APP_NAME + " - Update Product"}</title>
      {isLoadingProduct ? (
        <div className="mx-auto place-items-center">
          <h4>Loading...</h4> <Loader />
        </div>
      ) : (
        <>
          <div className="container xl:mx-36 sm:mx-10 w-auto">
            <div className="flex flex-col md:flex-row">
              <AdminMenu />
              <div className="md:w-9/10 p-3">
                <div className="h-12 max-xl:text-center">Update Product</div>
                {form?.image && (
                  <div className="text-center">
                    <img
                      src={form?.image}
                      alt={"product"}
                      className="block mx-auto mb-5 rounded-lg max-h-50 object-cover"
                    />
                  </div>
                )}

                <div className="mb-3 mx-3">
                  <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 overflow-clip">
                    {form?.image ? `${form?.image} ` : "Upload Image "}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={uploadFileHandler}
                      className={form?.image ? "text-pink-500" : "hidden"}
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
                          setForm((prev) => ({
                            ...prev!,
                            name: e.target.value,
                          }))
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
                          setForm((prev) => ({
                            ...prev!,
                            brand: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={form?.description ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    }
                    className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                  ></textarea>
                  <div className="flex max-sm:flex-col justify-between gap-[2%] w-full md:w-[90%]">
                    <div className="flex flex-col justify-between gap-2 w-full">
                      <label htmlFor="stock">Count In Stock</label>
                      <input
                        type="text"
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
                  <div className="flex justify-around">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-10 py-4 mt-5 mr-6 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? <Loader /> : "Update"}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-10 py-4 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700"
                      disabled={isLoadingDelete}
                    >
                      {isLoadingDelete ? <Loader /> : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {ConfirmDialog}
        </>
      )}
    </>
  );
};

export { AdminProductUpdate };
