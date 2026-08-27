import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import DepositModal from "../../components/all/DepositModel";
import {
  Menu,
  Bell,
  PiggyBank,
  Users,
  TrendingUp,
  Store,
  Wallet,
  ArrowLeftRight,
  UsersRound,
  PieChart,
  ChevronRight,
  Zap,
  UserCircle2,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetchProfile from "../../hooks/useFetchProfile";
import dashboardImage from "../../assets/dashboardImg.png";
import { useSelector } from "react-redux";

const UserHome = () => {
  const { user } = useSelector((state) => state.auth);
  const { fetchUserInfo } = useFetchProfile();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const overviewCards = [
    {
      label: "CASH BACK INCOME",
      sub: "Total Cashback Earnings",
      value: user?.cashbackWallet ?? 0,
      icon: PiggyBank,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      barColor: "bg-green-500",
      onClick: () => navigate("/user/income/cashback"),
    },
    {
      label: "DIRECT INCOME",
      sub: "Total Direct Earnings",
      value: user?.directReferalAmount ?? 0,
      icon: UsersRound,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      barColor: "bg-blue-500",
      onClick: () => navigate("/user/income/direct"),
    },
    {
      label: "DAILY LEVEL INCOME",
      sub: "Total Level Earnings",
      value: user?.levelIncome ?? 0,
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      barColor: "bg-blue-500",
      onClick: () => navigate("/user/income/level"),
    },
    {
      label: "FRANCHISE INCOME",
      sub: "Total Franchise Earnings",
      value: user?.franchiseIncome ?? 0,
      icon: Store,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      barColor: "bg-blue-500",
      onClick: () => navigate("/user/income/franchise"),
    },
  ];

  const quickActions = [
    {
      label: "Add Funds",
      sub: "Top up wallet",
      icon: Wallet,
      onClick: () => navigate("/user/wallet"),
    },
    {
      label: "Withdraw",
      sub: "Request payout",
      icon: ArrowLeftRight,
      onClick: () => navigate("/user/wallet"),
    },
    {
      label: "My Team",
      sub: "View team network",
      icon: Users,
      onClick: () => navigate("/user/team"),
    },
    {
      label: "Reports",
      sub: "View all reports",
      icon: PieChart,
      onClick: () => navigate("/user/history"),
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden p-3 rounded-lg">
          <p className="absolute md:top-8 top-6 left-8 z-10 text-blue-500 text-sm font-medium flex items-center gap-1">
            Hi, <span className="uppercase">{user?.username || "User"}!</span> 👋
          </p>

          {/* Banner Image */}
          <img
            src={dashboardImage}
            alt="Dashboard"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Overview */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="w-2 h-2 bg-blue-600 rounded-sm" />
                <span className="w-2 h-2 bg-blue-600 rounded-sm" />
                <span className="w-2 h-2 bg-blue-600 rounded-sm" />
                <span className="w-2 h-2 bg-blue-600 rounded-sm" />
              </div>
              <h2 className="font-bold text-gray-900">Overview</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <CalendarDays size={14} />
              {today}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.label}
                  onClick={card.onClick}
                  className="text-left bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`p-2 rounded-full ${card.iconBg} flex items-center justify-center`}
                    >
                      <Icon size={16} className={card.iconColor} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 tracking-wide">
                        {card.label}
                      </p>
                      <p className="text-2xl font-extrabold text-gray-900 mt-1">
                        ₹{card.value}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">{card.sub}</p>
                    </div>
                    <div className={`p-1 rounded-full bg-gray-50 flex items-center justify-center`}>
                      <ChevronRight size={12} className="text-blue-600" />
                    </div>
                  </div>

                  <div className={`h-1 rounded-full ${card.barColor} mt-3`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-blue-600 fill-blue-600" />
            <h2 className="font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2  gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="text-center relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
                >
                  <div className=" w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                    <Icon size={20} className="text-blue-600" />
                    <div className="absolute top-3 right-3 text-blue-600">
                      <ChevronRight
                        size={14}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{action.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Invite banner */}
        <div className="px-5">
          <div className="flex items-center justify-between bg-blue-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Grow Your Network, Grow Your Income!
                </p>
                <p className="text-xs text-gray-500">
                  Refer more &amp; earn more with Binext
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/user/invite")}
              endIcon={<ChevronRight size={16} />}
              sx={{
                background: "#2563eb",
                color: "#fff",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                px: 2.5,
                flexShrink: 0,
                "&:hover": { background: "#1d4ed8" },
              }}
            >
              Invite Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;