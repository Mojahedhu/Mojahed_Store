import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/features/category/categoryApiSlice";
import { toast } from "react-toastify";
import type { Category } from "../../redux/features/category/categoryTypes";
import { CategoryForm } from "../../components/CategoryForm";
import { Modal } from "../../components/Modal";
import { AdminMenu } from "./AdminMenu";
import { handleCatchError } from "../../Utils/handleCatchError";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [updatingName, setUpdatingName] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [createQuery] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createQuery({ name }).unwrap();
      if ("error" in result) {
        const error =
          (result as Category & { error: string }).error ||
          "Creating category failed, please try again later";
        toast.error(error);
      } else {
        toast.success(`${result.name} created successfully 🎉`);
        setName("");
      }
    } catch (error) {
      toast.error(handleCatchError(error || String(error)));
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        id: selectedCategory!._id,
        data: {
          name: updatingName,
        },
      }).unwrap();
      if ("error" in result) {
        const error =
          (result as Category & { error: string }).error ||
          "Updating category failed, please try again later";
        toast.error(error);
      } else {
        toast.success(`${result.name} updated successfully 🎉`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
        setName("");
      }
    } catch (error) {
      toast.error(handleCatchError(error || String(error)));
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory!._id).unwrap();
      if ("error" in result) {
        const error =
          (result as { data: Category } & { error: string }).error ||
          "Deleting category failed, please try again later";
        toast.error(error);
      } else {
        console.log(result);
        toast.success(`${result.data.name} deleted successfully 🎉`);
        setSelectedCategory(null);
        setModalVisible(false);
        setName("");
        setUpdatingName("");
      }
    } catch (error) {
      toast.error(handleCatchError(error || String(error)));
    }
  };

  return (
    <>
      <title>Mojahed Store - Categories</title>
      <div className="ml-40 flex flex-col md:flex-row">
        <AdminMenu />
        <div className="p-3 md:w-3/4">
          <div className="h-12">Manage Categories</div>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
          <br />
          <hr />
          {categories?.length === 0 && (
            <div className="text-center mt-5">No categories found</div>
          )}
          <div className="flex flex-wrap">
            {categories?.map((category) => (
              <div key={category._id}>
                <button
                  className=" border border-pink-500 text-pink-500 px-4 py-2 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50s"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setName(category.name);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            setValue={setUpdatingName}
          >
            <CategoryForm
              value={updatingName || selectedCategory?.name || ""}
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export { CategoryList };
