import { Routes, Route } from "react-router-dom";
import LandingPage from "../screen/landing/LandingPage";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import PublicRoute from "./PublicRoute";
import PageNotFound from "../components/common/PageNotFound";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
            </Route>

            {/* ✅ Protected routes */}
            <Route path="/user/*" element={<UserRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* ✅ Auth routes LAST me */}
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRoutes;