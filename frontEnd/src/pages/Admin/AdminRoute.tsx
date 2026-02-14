import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../redux/app/hooks";

const AdminRoute = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export { AdminRoute };
