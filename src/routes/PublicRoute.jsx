import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const { user, token } = useSelector((state) => state.auth);
    const role = user?.role?.toLowerCase();

    if (token) {
        if (role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/user/home" replace />;
        }
    }

    return <Outlet />;
};

export default PublicRoute;
