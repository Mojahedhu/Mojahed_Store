import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/app/hooks";

const PrivateRoute = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export { PrivateRoute };
