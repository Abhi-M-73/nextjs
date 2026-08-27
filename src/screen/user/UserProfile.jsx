import React from "react";
import {
  Wallet,
  Link,
  LogOut,
  Send,
  TrendingUp,
  Users,
  Layers,
  ArrowDownToLine,
  Banknote,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../redux/slices/snackbarSlice";
import { Button } from "@mui/material";
import { logout } from "../../redux/slices/authSlice";
import { dateFormatter } from "../../utils/AdditionalFn";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const referralLink = `${window.location.origin}/auth/register?referredBy=${user?.referralCode}`;
  const dispatch = useDispatch();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        dispatch(
          showSnackbar({
            message: "Referral link copied to clipboard! 📋",
            severity: "success",
          })
        );
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: "Failed to copy referral link. Try again! ❌",
            severity: "error",
          })
        );
      });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const formatINR = (val) =>
    `₹${(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const stats = [
    {
      label: "Total Deposit",
      value: formatINR(user?.totalInvestment),
      icon: ArrowDownToLine,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Earnings",
      value: formatINR(user?.totalEarnings),
      icon: TrendingUp,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Total Payouts",
      value: formatINR(user?.totalPayouts),
      icon: Banknote,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Wallet Balance",
      value: formatINR(user?.mainWallet),
      icon: Wallet,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const incomeBreakdown = [
    { label: "Cashback Income", value: user?.cashbackWallet, icon: ArrowDownToLine },
    { label: "Referral Income", value: user?.directReferalAmount, icon: Users },
    { label: "Level Income", value: user?.levelIncome, icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Profile Header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl uppercase font-bold mb-4">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>

          <h2 className="text-blue-600 text-md font-semibold uppercase">
            {user?.username || "User"}
          </h2>
          <h2 className="text-gray-900 text-md font-medium break-all">
            {user?.email || "N/A"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Joined: {user?.createdAt ? dateFormatter(user?.createdAt) : "--"}
          </p>
        </div>

        {/* Financial Stats Grid */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-3 px-1">Financial Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center mb-2`}>
                    <Icon size={18} className={stat.iconColor} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-1 shadow-sm">
          <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
            <Wallet size={18} className="text-blue-600" />
            Income Breakdown
          </div>

          {incomeBreakdown.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex justify-between items-center py-3 text-sm ${
                  idx !== incomeBreakdown.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-gray-500">
                  <Icon size={14} className="text-gray-400" />
                  {item.label}
                </div>
                <span className="text-gray-900 font-semibold">{formatINR(item.value)}</span>
              </div>
            );
          })}
        </div>

        {/* Referral Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Link size={18} className="text-blue-600" />
            Referral Info
          </div>

          <p className="text-gray-500 text-sm break-all bg-gray-50 rounded-lg px-3 py-2">
            {referralLink}
          </p>

          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={handleCopy}
            sx={{
              background: "#2563eb",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "999px",
              "&:hover": { background: "#1d4ed8" },
            }}
          >
            Copy Referral Link
          </Button>
        </div>

        {/* Settings Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Send size={16} className="text-blue-600" />
              Go to Telegram
            </div>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3 hover:bg-red-100 transition text-red-500"
          >
            <div className="flex items-center gap-2 font-medium">
              <LogOut size={16} />
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;