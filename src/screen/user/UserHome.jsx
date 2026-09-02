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
  BadgeCheck,
  ShieldAlert,
  Banknote,
  UserCheck,
  Sparkles,
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
      label: "AVAILABLE BALANCE",
      sub: "Available Balance",
      value: user?.mainWallet ?? 0,
      icon: Wallet,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      barGradient: "from-purple-400 to-purple-600",
      onClick: () => navigate("/user/wallet"),
      type: "currency",
    },
    {
      label: "TOTAL EARNING",
      sub: "Total Earnings So Far",
      value: user?.totalEarnings ?? 0,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      barGradient: "from-emerald-400 to-emerald-600",
      onClick: () => navigate("/user/profile"),
      type: "currency",
    },
    {
      label: "TODAY INCOME",
      sub: "Earned Today",
      value: user?.todayIncome ?? 0,
      icon: CalendarDays,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      barGradient: "from-amber-400 to-amber-600",
      onClick: () => navigate("/user/history"),
      type: "currency",
    },
    {
      label: "CASHBACK",
      sub: "Total Cashback Earnings",
      value: user?.cashbackWallet ?? 0,
      icon: PiggyBank,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      barGradient: "from-green-400 to-green-600",
      onClick: () => navigate("/user/history"),
      type: "currency",
    },
    {
      label: "LEVEL INCOME",
      sub: "Total Level Earnings",
      value: user?.levelIncome ?? 0,
      icon: TrendingUp,
      gradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      barGradient: "from-indigo-400 to-indigo-600",
      onClick: () => navigate("/user/income/level"),
      type: "currency",
    },
    {
      label: "WITHDRAWAL AMOUNT",
      sub: "Total Withdrawn",
      value: user?.totalPayouts ?? 0,
      icon: Banknote,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      barGradient: "from-orange-400 to-orange-600",
      onClick: () => navigate("/user/history"),
      type: "currency",
    },
    {
      label: "TOTAL DIRECT USERS",
      sub: "Total Team Members",
      value: user?.referedUsers?.length ?? 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      barGradient: "from-blue-400 to-blue-600",
      onClick: () => navigate("/user/team"),
      type: "count",
    },
    {
      label: " DIRECT ACTIVE USERS",
      sub: "Active Direct Referrals",
      value: user?.directActiveReferrals ?? 0,
      icon: UserCheck,
      gradient: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
      barGradient: "from-teal-400 to-teal-600",
      onClick: () => navigate("/user/team"),
      type: "count",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white pb-10">
      <div className="max-w-lg mx-auto space-y-7">
        {/* Hero */}
        <div className="relative overflow-hidden mx-3 mt-3 rounded-2xl shadow-lg shadow-blue-100">
          {/* Banner Image */}
          <img src={dashboardImage} alt="Dashboard" className="w-full h-auto" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Overview */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
                <Sparkles size={16} className="text-white" />
              </div>
              <h2 className="font-extrabold text-gray-900 text-[17px] tracking-tight">
                Overview
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              <CalendarDays size={14} />
              {today}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.label}
                  onClick={card.onClick}
                  className="group text-left bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/70 hover:-translate-y-0.5 hover:border-transparent transition-all duration-300 ease-out"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        size={16}
                        className="text-white"
                        strokeWidth={2.2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                        {card.label}
                      </p>
                      <p className="text-[12px] font-extrabold text-gray-900 mt-1 tracking-tight break-words">
                        {card.type === "currency" &&
                          `₹${Number(card.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        {card.type === "count" && card.value}
                        {card.type === "status" && card.value}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300 mt-1"
                    />
                  </div>

                  <div className="h-1.5 rounded-full bg-gray-100 mt-3.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${card.barGradient} group-hover:opacity-90 transition-opacity`}
                      style={{ width: "70%" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-100">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <h2 className="font-extrabold text-gray-900 text-[17px] tracking-tight">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="group text-center relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-0.5 hover:border-blue-100 transition-all duration-300 ease-out flex flex-col items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/60 group-hover:to-transparent transition-all duration-300" />

                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-2.5 shadow-md shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={20} className="text-white" strokeWidth={2} />
                  </div>
                  <ChevronRight
                    size={13}
                    className="absolute top-3.5 right-3.5 text-blue-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300"
                  />
                  <p className="relative text-sm font-bold text-gray-900">
                    {action.label}
                  </p>
                  <p className="relative text-[11px] text-gray-400 mt-0.5">
                    {action.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Invite banner */}
        <div className="px-5">
          <div className="relative flex items-center justify-between bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-blue-200 overflow-hidden">
            {/* Decorative glow circles */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />

            <div className="relative flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-snug">
                  Grow Your Network, Grow Your Income!
                </p>
                <p className="text-xs text-blue-100 mt-0.5">
                  Refer more &amp; earn more with Binext
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/user/profile")}
              endIcon={<ChevronRight size={16} />}
              sx={{
                background: "#fff",
                color: "#1d4ed8",
                textTransform: "none",
                fontWeight: 800,
                borderRadius: "10px",
                px: 2.5,
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                "&:hover": { background: "#f0f5ff" },
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
