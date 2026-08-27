import { useState } from "react";
import { IconButton, Menu, MenuItem, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Menu as MenuIcon, Bell, UserCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useLocation } from "react-router-dom";
import mainContent from "../../utils/mainContent";

const routeTitles = {
  home: "Dashboard",
  team: "Team",
  history: "History",
  wallet: "Wallet",
  profile: "Profile",
};

const UserHeader = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const baseRoute = pathSegments[2];
  const title = routeTitles[baseRoute] || "Dashboard";
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
  };

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button className="p-1 -ml-1">
          <MenuIcon size={24} className="text-gray-800" />
        </button>

        <span className="text-xl font-extrabold text-gray-900 tracking-tight">
         <img src={mainContent.applogo} alt="logo" className="w-full h-10" />
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight hidden sm:block">
          <p className="text-[11px] text-gray-500">Welcome back,</p>
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "User"}
          </p>
        </div>

        <button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          className="relative w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"
        >
          <UserCircle2 size={22} className="text-blue-500" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
        </button>

        <button className="relative p-1">
          <Bell size={20} className="text-gray-800" />
          {user?.unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
              {user.unreadNotifications || 0}
            </span>
          )}
        </button>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 220, borderRadius: "12px", mt: 1 } } }}
        >
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "-"}
            </p>
          </div>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "#ef4444", py: 1.2 }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default UserHeader;