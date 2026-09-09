import { useState } from "react";
import { IconButton, Menu, MenuItem, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Menu as MenuIcon, Bell, UserCircle2, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser, setToken } from "../../redux/slices/authSlice";
import { useLocation } from "react-router-dom";
import mainContent from "../../utils/mainContent";
import { ShieldCheck } from "lucide-react";

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

  const isActive = user?.status === true;

  // Impersonation session hai ya nahi
  const isImpersonating = Boolean(sessionStorage.getItem("adminBackupToken"));

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
  };

  const handleBackToAdmin = () => {
    setAnchorEl(null);
    const adminToken = sessionStorage.getItem("adminBackupToken");
    const adminUser = sessionStorage.getItem("adminBackupUser");
    if (!adminToken) return;

    // Admin session restore
    dispatch(setToken(adminToken));
    dispatch(setUser(adminUser ? JSON.parse(adminUser) : null));
    sessionStorage.removeItem("adminBackupToken");
    sessionStorage.removeItem("adminBackupUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    window.location.replace("/admin/dashboard");
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-2.5 flex justify-between items-center sticky top-0 z-40 shadow-sm shadow-gray-100/50">
      <div className="flex items-center gap-3">
        <span className="text-xl font-extrabold text-gray-900 tracking-tight">
          <img src={mainContent.applogo} alt="logo" className="w-full h-10" />
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="text-right leading-tight hidden sm:block">
          <p className="text-[11px] text-gray-400 font-medium">Welcome back,</p>
          <p className="text-sm font-bold text-gray-900">
            {user?.name || "User"}
          </p>
        </div>

        <button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          className="group relative flex items-center gap-1.5 pl-0.5 pr-2 py-0.5 rounded-full hover:bg-blue-50 transition-colors duration-300"
        >
          <span className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
            <UserCircle2 size={20} className="text-white" strokeWidth={2} />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              title={isActive ? "Active" : "Inactive"}
            />
          </span>
          <ChevronDown
            size={14}
            className={`text-gray-400 group-hover:text-blue-600 transition-all duration-300 ${menuOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 240,
                borderRadius: "16px",
                mt: 1.5,
                boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                border: "1px solid rgba(226,232,240,0.8)",
                overflow: "hidden",
              },
            },
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
              <UserCircle2 size={22} className="text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">
                {user?.name || "-"}
              </p>
              <p className="text-sm font-bold text-gray-900 uppercase">
                {user?.username || "User"}
              </p>
              <p
                className={`text-[11px] font-semibold mt-0.5 ${isActive ? "text-green-600" : "text-gray-400"
                  }`}
              >
                {isActive ? "● Active" : "● Inactive"}
              </p>
            </div>
          </div>
          <Divider sx={{ borderColor: "rgba(226,232,240,0.8)" }} />

          {/* Impersonation me Back to Admin, warna normal Logout */}
          {isImpersonating ? (
            <MenuItem
              onClick={handleBackToAdmin}
              sx={{
                color: "#f59e0b",
                py: 1.4,
                px: 2,
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": { background: "rgba(245,158,11,0.08)" },
              }}
            >
              <ShieldCheck size={18} style={{ marginRight: 12 }} />
              Back to Admin
            </MenuItem>
          ) : (
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#ef4444",
                py: 1.4,
                px: 2,
                fontWeight: 600,
                fontSize: "14px",
                "&:hover": { background: "rgba(239,68,68,0.06)" },
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Logout
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default UserHeader;
