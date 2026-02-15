import { Link, useLocation } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/features/order/orderApiSlice";
import { Loader } from "../../components/Loader";
import { Message } from "../../components/Message";
import { handleCatchError } from "../../Utils/handleCatchError";
import { AdminMenu } from "./AdminMenu";
import { APP_NAME } from "../../config/constants";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const search = useLocation();

  if (isLoading) {
    return (
      <>
        <title>
          {search.pathname.split("/")[search.pathname.split("/").length - 1] ===
          "dashboard"
            ? APP_NAME + " - Dashboard"
            : APP_NAME + " - Orders List"}
        </title>
        <div className="mx-auto place-items-center mt-20">
          <h4 className="text-center mb-4">Loading...</h4>
          <Loader />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <title>
          {search.pathname.split("/")[search.pathname.split("/").length - 1] ===
          "dashboard"
            ? APP_NAME + " - Dashboard"
            : APP_NAME + " - Orders List"}
        </title>
        <div className="mx-auto place-items-center">
          <Message variant="error">{handleCatchError(error)}</Message>
        </div>
      </>
    );
  }

  return (
    <>
      <title>
        {search.pathname.split("/")[search.pathname.split("/").length - 1] ===
        "dashboard"
          ? APP_NAME + " - Dashboard"
          : APP_NAME + " - Orders List"}
      </title>
      <div className="max-[1300px]:ml-20 max-[1756px]:ml-30">
        <AdminMenu />
        {orders?.length === 0 && !isLoading && (
          <h4 className="text-center mt-20">No orders found</h4>
        )}
        {orders && orders?.length > 0 && (
          <table className="container mx-auto mt-5">
            <thead className="w-full border">
              <tr className="mb-20">
                <th className="text-left pl-1">ITEMS</th>
                <th className="text-left pl-1">ID</th>
                <th className="text-left pl-1">USER</th>
                <th className="text-left pl-1">DATA</th>
                <th className="text-left pl-1">TOTAL</th>
                <th className="text-left pl-1">PAID</th>
                <th className="text-left pl-1">DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-20 h-12 rounded-lg mt-4"
                    />
                  </td>
                  <td>{order._id}</td>
                  <td>{order.user.username ? order.user.username : "N/A"} </td>
                  <td>
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td>$ {order.totalPrice.toFixed(2)}</td>
                  <td className="py">
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
                  <td className="py">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-24 rounded-full">
                        Delivered
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-24 rounded-full">
                        Pending
                      </p>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <button className="py-1 text-center bg-blue-400 w-24 rounded-full cursor-pointer hover:underline hover:bg-pink-700">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export { OrderList };
