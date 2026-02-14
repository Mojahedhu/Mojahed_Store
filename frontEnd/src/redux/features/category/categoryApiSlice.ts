import { API_ENDPOINTS } from "../../constants/endpoints";
import { apiSlice } from "../../services/api";
import type { Category, UpdatedCategory } from "./categoryTypes";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (data) => ({
        url: API_ENDPOINTS.CATEGORY_URL.BASE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Temporary client-side category
        const tempId = `tempId-${Date.now()}`;

        const patch = dispatch(
          categoryApiSlice.util.updateQueryData(
            "fetchCategories",
            undefined,
            (draft) => {
              draft.push({ _id: tempId, name: arg.name } as Category);
            }
          )
        );
        // replace temp item with real one
        try {
          const { data } = await queryFulfilled;
          dispatch(
            categoryApiSlice.util.updateQueryData(
              "fetchCategories",
              undefined,
              (draft) => {
                const index = draft.findIndex((c) => c._id === tempId);
                if (index !== -1) {
                  draft[index] = data;
                }
              }
            )
          );
        } catch {
          patch.undo(); // rollback
        }
      },
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdatedCategory }
    >({
      query: ({ data, id }) => ({
        url: API_ENDPOINTS.CATEGORY_URL.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Category", id }],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          categoryApiSlice.util.updateQueryData(
            "fetchCategories",
            undefined,
            (draft) => {
              const category = draft.find((c) => c._id === id);
              if (category) {
                Object.assign(category, data);
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    deleteCategory: builder.mutation<
      { data: Category; message: string },
      string
    >({
      query: (id) => ({
        url: API_ENDPOINTS.CATEGORY_URL.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          categoryApiSlice.util.updateQueryData(
            "fetchCategories",
            undefined,
            (draft) => {
              return draft.filter((c) => c._id !== id);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    fetchCategories: builder.query<Category[], void>({
      query: () => ({
        url: API_ENDPOINTS.CATEGORY_URL.CATEGORIES,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Category" as const,
                id: _id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;
