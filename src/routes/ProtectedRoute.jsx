import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const { token, user } = useSelector((state) => state.auth);

  const role = user?.role;

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/user/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
