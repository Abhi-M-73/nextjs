import { Outlet, useLocation } from "react-router-dom";
import BottomTab from "../components/common/BottomTab";
import UserHeader from "../components/common/UserHeader";

const UserLayout = () => {
    const location = useLocation();
    const showBottomTab = location.pathname.startsWith("/user");

    return (
        <div className="min-h-screen shadow flex justify-center">
            <div className="relative w-full max-w-lg bg-white text-black shadow-xl pb-16">
                {showBottomTab && <UserHeader />}
                <Outlet />
                {showBottomTab && <BottomTab />}
            </div>
        </div>
    );
};

export default UserLayout;
