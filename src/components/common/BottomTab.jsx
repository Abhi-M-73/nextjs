import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, History, User, Wallet } from "lucide-react";

const BottomTab = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: "Home", path: "/user/home", icon: Home },
    { label: "Team", path: "/user/team", icon: Users },
    { label: "History", path: "/user/history", icon: History },
    { label: "Wallet", path: "/user/wallet", icon: Wallet },
    { label: "Profile", path: "/user/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        const Icon = tab.icon;

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center flex-1 py-1.5"
          >
            <Icon
              size={22}
              className={active ? "text-blue-600" : "text-gray-400"}
              strokeWidth={active ? 2.4 : 2}
            />
            <span
              className={`text-[11px] mt-1 ${
                active ? "text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomTab;