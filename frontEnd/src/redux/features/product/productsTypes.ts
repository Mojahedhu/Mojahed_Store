export type Product = {
  _id?: string;
  name: string;
  image: string;
  image_Id: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  quantity?: number;
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  reviews?: Review[];
};

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  user?: string;
  createdAt?: string;
  isOptimistic?: boolean;
  name?: string;
};

export type uploadType = {
  message: string;
  file: {
    image: string;
    image_Id: string;
    format: string;
    size: number;
  };
  error?: unknown;
};

export type GetProductsResponse = {
  hasMore: boolean;
  products: Product[];
  page: number;
  pages: number;
};
