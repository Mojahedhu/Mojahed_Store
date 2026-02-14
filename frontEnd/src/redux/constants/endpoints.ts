export const API_ENDPOINTS = {
  BASE_URL: "",
  USER_URL: {
    BASE: "/api/users",
    AUTH: "/api/users/auth",
    LOGOUT: "/api/users/logout",
    PROFILE: "/api/users/profile",
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  CATEGORY_URL: {
    BASE: "/api/category",
    CATEGORIES: "/api/category/categories",
    BY_ID: (id: string) => `/api/category/${id}`,
  },
  PRODUCT_URL: {
    BASE: "/api/products",
    ALL: "/api/products/all-products",
    TOP: "/api/products/top",
    NEW: "/api/products/new",
    FILTER: "/api/products/filtered-products",
    REVIEWS: (id: string) => `/api/products/${id}/reviews`,
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  UPLOAD_URL: (query?: string) =>
    query ? `/api/upload${query}` : "/api/upload",
  ORDER_URL: {
    BASE: "/api/orders",
    ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
    CHANGE_PAYMENT_METHOD: (orderId: string) =>
      `/api/orders/${orderId}/payment-method`,
    CREATE_PAYPAL_ORDER: (orderId: string) =>
      `/api/orders/${orderId}/create-paypal`,
    CAPTURE_PAYPAL_ORDER: (orderId: string) =>
      `/api/orders/${orderId}/capture-paypal`,
    CREATE_STRIPE_PAYMENT: (orderId: string) =>
      `/api/orders/${orderId}/create-stripe`,
    VERIFY_STRIPE_PAYMENT: (orderId: string) =>
      `/api/orders/${orderId}/verify-stripe`,
    ORDER_PAY: (id: string) => `/api/orders/${id}/pay`,
    ORDER_DELIVER: (id: string) => `/api/orders/${id}/deliver`,
    MY_ORDERS: "/api/orders/mine",
    TOTAL_ORDERS: "/api/orders/total-orders",
    TOTAL_SALES: "/api/orders/total-sales",
    TOTAL_SALES_BY_DATE: "/api/orders/total-sales-by-date",
  },
  PAYPAL_URL: "/api/config/paypal",
};

export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REGISTER: "/auth/register",
  },

  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;
