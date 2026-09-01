import { useState } from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

const DashboardHeader = ({ onMenuClick }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/");
  const baseRoute = pathSegments[2];
  const title = baseRoute || "Dashboard";

  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const handleLogout = () => {
    const isAdmin = user?.role?.toLowerCase() === "admin";

    dispatch(logout());
    setOpenProfile(false);

    window.location.replace(isAdmin ? "/auth/admin-login" : "/auth/login");
  };

  return (
    <div className="w-full h-18 bg-[#04141a] border-b border-gray-700 flex items-center justify-between px-4 md:px-6 text-white">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-700"
        >
          <Menu />
        </button>

        <div className="hidden md:flex flex-col rounded-lg">
          <h1 className="capitalize font-semibold text-lg">{title}</h1>
          <p className="text-gray-400 text-xs">{user?.username || "Admin"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 bg-[#0f2a33] px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            <User size={18} />
            <span className="hidden md:block text-sm">Admin</span>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-60 bg-[#0f2a33] rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
              <button className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-sm">
                <User size={16} />
                {user?.email || "Admin"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-500 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
