import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import { userRoutes } from "./routes";

const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRole="user" />}>
                <Route element={<UserLayout />}>
                    {
                        userRoutes.map((route) => (
                            <Route key={route.path} path={route.path} element={<route.element />} />
                        ))
                    }
                </Route>
            </Route>
        </Routes>
    );
};

export default UserRoutes;
