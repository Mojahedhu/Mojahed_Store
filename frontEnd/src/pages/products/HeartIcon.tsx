import type { Product } from "../../redux/features/product/productsTypes";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect } from "react";

const HeartIcon = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // Register the product from localStorage
      removeFavoriteFromLocalStorage(product);
    } else {
      dispatch(addToFavorites(product));
      // Register the product to localStorage
      addFavoriteToLocalStorage(product);
    }
  };
  return (
    <button
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorite}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </button>
  );
};

export { HeartIcon };
