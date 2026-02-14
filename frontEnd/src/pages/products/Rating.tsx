import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
const Rating = ({
  value,
  text,
  color = "yellow-500",
}: {
  value: number;
  text?: string;
  color?: string;
}) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - hasHalfStar;
  const arrayOfFullStars = new Array(fullStars);
  const arrayOfEmptyStars = new Array(emptyStars);
  console.log([...arrayOfEmptyStars.keys()]);
  return (
    <div className="flex items-center">
      {[...arrayOfFullStars].map((_, i) => (
        <FaStar key={i + fullStars} className={`text-${color} ml-1`} />
      ))}
      {hasHalfStar === 1 && <FaStarHalfAlt color={color} />}
      {[...arrayOfEmptyStars].map((_, i) => (
        <FaRegStar key={i + fullStars} className={`text-${color} ml-1`} />
      ))}
      <span className={`rating-text ml-8 text-${color}`}>{text}</span>
    </div>
  );
};

export { Rating };
