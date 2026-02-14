// CRUD APIs

import { API_ENDPOINTS } from "../../constants/endpoints";
import { apiSlice } from "../../services/api";
import type { User } from "./usersTypes";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      query: (data) => ({
        url: API_ENDPOINTS.USER_URL.AUTH,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.USER_URL.LOGOUT,
        method: "POST",
      }),
    }),
    register: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: API_ENDPOINTS.USER_URL.BASE,
        method: "POST",
        body: data,
      }),
    }),

    profile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: API_ENDPOINTS.USER_URL.PROFILE,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: API_ENDPOINTS.USER_URL.BASE,
        method: "GET",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: API_ENDPOINTS.USER_URL.BY_ID(userId),
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query<User, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USER_URL.BY_ID(id),
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: API_ENDPOINTS.USER_URL.BY_ID(data._id?.toString() || ""),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = userApiSlice;
