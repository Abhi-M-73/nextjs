import React, { useState } from "react";
import { Menu, Bell, User, LogOut, Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { userLogout } from "../../api/auth.api";

const DashboardHeader = ({ onMenuClick }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const baseRoute = pathSegments[2];
  const title = baseRoute || "Dashboard";

  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    dispatch(logout());
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

        {/* Search */}
        <div className="hidden md:flex flex-col rounded-lg">
          <h1 className="capitalize font-semibold text-lg">{title}</h1>
          <p className="text-gray-400 text-xs">{user?.username || "Admin"}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">
        <button className="relative p-2 rounded-lg hover:bg-gray-700">
          <Bell />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 bg-[#0f2a33] px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            <User size={18} />
            <span className="hidden md:block text-sm">Platform </span>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0f2a33] rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
              <button className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-sm">
                <User size={16} /> Profile
              </button>

              <button className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-sm">
                <Settings size={16} /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-500 text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
