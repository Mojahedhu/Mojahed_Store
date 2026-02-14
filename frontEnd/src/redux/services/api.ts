// base RTK Query config
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../constants/endpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINTS.BASE_URL,
  credentials: "include", // for JWT
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Category", "Product", "Order"],
  endpoints: () => ({}),
});
