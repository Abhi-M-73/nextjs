import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../screen/admin/AdminDashboard";
import AllUsers from "../screen/admin/AllUsers";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import { adminRoutes } from "./routes";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRole="admin" />}>
                <Route element={<AdminLayout />}>
                    {adminRoutes.map((section) =>
                        section.items.map((route) => {
                            const Component = route.element;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={<Component />}
                                />
                            );
                        })
                    )}
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
