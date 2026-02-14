import { useAppSelector } from "../../redux/app/hooks";

const FavoritesCount = () => {
  const favorites = useAppSelector((state) => state.favorites);
  const favoritesCount = favorites.length;
  return (
    <div className="absolute left-2 top-8">
      {favoritesCount > 0 && (
        <span className="bg-pink-500 text-white px-1 py-0 rounded-full text-sm ">
          {favoritesCount}
        </span>
      )}
    </div>
  );
};

export { FavoritesCount };
