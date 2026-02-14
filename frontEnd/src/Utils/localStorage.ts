import type { Product } from "../redux/features/product/productsTypes";

// Add a product to localStorage
export const addFavoriteToLocalStorage = (product: Product) => {
  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Remove a product from localStorage
export const removeFavoriteFromLocalStorage = (product: Product) => {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter((p) => p._id !== product._id);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = () => {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? (JSON.parse(favoritesJSON) as Product[]) : [];
};
