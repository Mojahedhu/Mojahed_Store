import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/features/order/orderApiSlice";
import { Loader } from "../../components/Loader";
import { Message } from "../../components/Message";
import { handleCatchError } from "../../Utils/handleCatchError";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="max-[1470px]:ml-40">
          <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="max-[1470px]:ml-40">
          <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
          <Message variant="error">{handleCatchError(error)}</Message>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto">
      <div className="max-[1470px]:ml-40">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 text-start">IMAGE</th>
              <th className="py-2 text-start">ID</th>
              <th className="py-2 text-start">DATE</th>
              <th className="py-2 text-start">TOTAL</th>
              <th className="py-2 text-start">PAID</th>
              <th className="py-2 text-start">DELIVERED</th>
              <th className="py-2 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <img
                  src={order.orderItems[0].image}
                  alt={order.user.username}
                  className="w-24 h-12 mb-5 rounded-lg"
                />

                <td className="py-2">{order._id}</td>
                <td className="py-2">{order.createdAt.slice(0, 10)}</td>
                <td className="py-2">$ {order.totalPrice}</td>
                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-24 rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-24 rounded-full">
                      Pending
                    </p>
                  )}
                </td>
                <td className="py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-24 rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-24 rounded-full">
                      Pending
                    </p>
                  )}
                </td>
                <td className="px-2 py-2">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-blue-400 text-white px-4 py-1 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 hover:underline cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { UserOrder };
