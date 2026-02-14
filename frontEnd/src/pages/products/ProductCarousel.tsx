import { useGetTopProductsQuery } from "../../redux/features/product/productApiSlice";
import { Message } from "../../components/Message";
import { handleCatchError } from "../../Utils/handleCatchError";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";

const ProductCarousel = () => {
  const { data, isLoading, error, isError } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    SlidesToShow: 1,
    SlidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div>
        <h1>Error</h1>
        <Message variant="error">{handleCatchError(error)}</Message>
      </div>
    );
  }

  return (
    <div className="mb-4 md:block">
      <Slider
        {...settings}
        className="max-[350px]:w-40 w-80 sm:block sm:w-140 md:w-170 lg:w-4xl "
      >
        {data?.map((product) => (
          <div key={product._id}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg object-cover h-120"
            />
            <div className="mt-4 flex justify-between max-[800px]:flex-col ">
              <div className="one">
                <h2>{product.name}</h2>
                <p>$ {product.price}</p> <br /> <br />
                <p className="w-100">
                  {product.description.substring(0, 170)} ...
                </p>
              </div>
              <div className="flex justify-between w-80">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaClock className="mr-2 text-white" /> Added:{" "}
                    {moment(product.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>
                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Rating:{" "}
                    {Math.round(product.rating!)}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
