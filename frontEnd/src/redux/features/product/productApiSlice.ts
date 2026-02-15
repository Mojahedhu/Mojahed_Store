import type { RootState } from "../../app/store";
import { API_ENDPOINTS } from "../../constants/endpoints";
import { apiSlice } from "../../services/api";
import type {
  GetProductsResponse,
  Product,
  Review,
  uploadType,
} from "./productsTypes";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, { keyword?: string }>({
      query: ({ keyword }) => ({
        url: API_ENDPOINTS.PRODUCT_URL.BASE,
        params: keyword ? { keyword } : undefined,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result) => {
        return result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }];
      },
    }),
    getProductById: builder.query<Product, string>({
      query: (productId) => ({
        url: API_ENDPOINTS.PRODUCT_URL.BY_ID(productId),
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    allProducts: builder.query<Product[], void>({
      query: () => ({
        url: API_ENDPOINTS.PRODUCT_URL.ALL,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductDetails: builder.query<Product, string>({
      query: (productId) => ({
        url: API_ENDPOINTS.PRODUCT_URL.BY_ID(productId),
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation<{ data: Product }, FormData>({
      query: (productData) => ({
        url: API_ENDPOINTS.PRODUCT_URL.BASE,
        method: "POST",
        body: productData,
      }),
      async onQueryStarted(productData, { dispatch, queryFulfilled }) {
        // Temporary optimistic product
        const tempId = `tempId-${Date.now()}`;
        const tempProduct = {
          _id: tempId,
          name: productData.get("name") as string,
          price: Number(productData.get("price")),
          image:
            productData.get("image") instanceof File
              ? URL.createObjectURL(productData.get("image") as File)
              : (productData.get("image") as string),
          category: productData.get("category") as string,
          brand: productData.get("brand") as string,
          countInStock: Number(productData.get("countInStock")),
          description: productData.get("description") as string,
          quantity: Number(productData.get("quantity")),
        };

        // Optimistic update cache
        const patchResult = dispatch(
          productApiSlice.util.updateQueryData(
            "allProducts",
            undefined,
            (draft) => {
              draft.push(tempProduct as Product);
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;

          //Replace temp product with the real product from server
          dispatch(
            productApiSlice.util.updateQueryData(
              "allProducts",
              undefined,
              (draft) => {
                const index = draft.findIndex((p) => p._id === tempId);
                if (index !== -1) {
                  draft[index] = data.data;
                }
              },
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateProduct: builder.mutation<
      Product,
      { productId: string; formData: FormData }
    >({
      query: ({ productId, formData }) => ({
        url: API_ENDPOINTS.PRODUCT_URL.BY_ID(productId),
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
    uploadProductImage: builder.mutation<
      uploadType,
      { formData: FormData; query?: string }
    >({
      query: (data) => ({
        url: API_ENDPOINTS.UPLOAD_URL(data.query),
        method: "POST",
        body: data.formData,
      }),
    }),
    deleteProduct: builder.mutation<Product, string>({
      query: (productId) => ({
        url: API_ENDPOINTS.PRODUCT_URL.BY_ID(productId),
        method: "DELETE",
      }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productApiSlice.util.updateQueryData(
            "allProducts",
            undefined,
            (draft) => {
              return draft.filter((p) => p._id !== productId);
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          // Rolled in error
          patchResult.undo();
        }
      },
    }),
    createReview: builder.mutation<{ message: string }, Review>({
      query: ({ _id, rating, comment }) => ({
        url: API_ENDPOINTS.PRODUCT_URL.REVIEWS(_id),
        method: "POST",
        body: { rating, comment },
      }),
      async onQueryStarted(
        { _id, rating, comment },
        { dispatch, queryFulfilled, getState },
      ) {
        // face optimistic review
        const optimisticReview = {
          _id: Date.now().toString(),
          rating: Number(rating),
          comment,
          user: (getState() as RootState).auth.userInfo?._id || "you",
          createdAt: new Date().toISOString(),
          isOptimistic: true,
          name: (getState() as RootState).auth.userInfo?.username,
        };

        // Apply optimistic update
        const patch = dispatch(
          productApiSlice.util.updateQueryData(
            "getProductDetails",
            _id,
            (draft) => {
              draft.reviews?.push(optimisticReview);
              draft.numReviews! += 1;
              draft.rating =
                (draft.rating! * (draft.numReviews! - 1) + Number(rating)) /
                draft.numReviews!;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback
          patch.undo();
        }
      },
      invalidatesTags: (_r, _e, { _id }) => [{ type: "Product", id: _id }],
    }),
    getTopProducts: builder.query<Product[], void>({
      query: () => ({
        url: API_ENDPOINTS.PRODUCT_URL.TOP,
      }),
      keepUnusedDataFor: 5,
    }),
    getNewProducts: builder.query<Product[], void>({
      query: () => ({
        url: API_ENDPOINTS.PRODUCT_URL.NEW,
      }),
    }),
    getFilteredProducts: builder.query<
      Product[],
      { checked: string[]; radio: string }
    >({
      query: ({ checked, radio }) => ({
        url: API_ENDPOINTS.PRODUCT_URL.FILTER,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useGetFilteredProductsQuery,
} = productApiSlice;
