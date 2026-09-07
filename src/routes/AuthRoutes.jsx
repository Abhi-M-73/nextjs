import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import UserLayout from "../layout/UserLayout";
import AdminLogin from "../screen/auth/AdminLogin";
import { authRoutes } from "./routes";
import AuthLayout from "../layout/AuthLayout";
import Impersonate from "../screen/landing/Impersonate";

const AuthRoutes = () => {
  console.log("AuthRoutes MOUNTED, path:", window.location.pathname);
  return (
    <Routes>
      <Route path="/impersonate" element={<Impersonate />} />
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
