import React from "react";
import {
  Wallet,
  Link,
  LogOut,
  Send,
  Users,
  Layers,
  ArrowDownToLine,
  Banknote,
  Clock,
  Copy,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../redux/slices/snackbarSlice";
import { Button } from "@mui/material";
import { logout, setToken, setUser } from "../../redux/slices/authSlice";
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
            message: "Referral link copied to clipboard!",
            severity: "success",
          }),
        );
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: "Failed to copy referral link. Try again! ❌",
            severity: "error",
          }),
        );
      });
  };

  const isImpersonating = Boolean(sessionStorage.getItem("adminBackupToken"));

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleBackToAdmin = () => {
    const adminToken = sessionStorage.getItem("adminBackupToken");
    const adminUser = sessionStorage.getItem("adminBackupUser");
    if (!adminToken) return;
    dispatch(setToken(adminToken));
    dispatch(setUser(adminUser ? JSON.parse(adminUser) : null));
    sessionStorage.removeItem("adminBackupToken");
    sessionStorage.removeItem("adminBackupUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    window.location.replace("/admin/dashboard");
  };

  const formatUSD = (val) =>
    `$${(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const stats = [
    {
      label: "Available Balance",
      value: formatUSD(user?.mainWallet),
      icon: Wallet,
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      label: "Total Payouts",
      value: formatUSD(user?.totalPayouts),
      icon: Banknote,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const incomeBreakdown = [
    {
      label: "Total Payouts",
      value: user?.totalPayouts,
      icon: ArrowDownToLine,
    },
    {
      label: "Affiliate Income",
      value: user?.directReferalAmount,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-4 py-6">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-center shadow-lg shadow-blue-200 overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="relative w-[72px] h-[72px] mx-auto rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl uppercase font-extrabold mb-4 shadow-md">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>

          <h2 className="relative text-white text-base font-extrabold uppercase tracking-wide">
            {user?.username || "User"}
          </h2>
          <h2 className="relative text-blue-100 text-sm font-medium break-all mt-0.5">
            {user?.email || "N/A"}
          </h2>
          <p className="relative text-blue-100/80 text-xs mt-2 flex items-center justify-center gap-1.5">
            <Clock size={11} />
            Joined {user?.createdAt ? dateFormatter(user?.createdAt) : "--"}
          </p>
        </div>

        {/* Referral Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm shadow-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Link size={16} className="text-white" />
            </div>
            <h2 className="text-gray-900 font-extrabold text-[15px] tracking-tight">
              Referral Info
            </h2>
          </div>

          <p className="text-gray-500 text-sm break-all bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5">
            {referralLink}
          </p>

          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<Copy size={15} />}
            onClick={handleCopy}
            sx={{
              background: "linear-gradient(135deg, #2563eb, #4338ca)",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "999px",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              py: 1.1,
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                boxShadow: "0 6px 18px rgba(37,99,235,0.4)",
              },
            }}
          >
            Copy Referral Link
          </Button>
        </div>

        {/* Financial Stats Grid */}
        <div>
          <h3 className="text-gray-900 font-extrabold text-[15px] mb-3 px-1 tracking-tight">
            Financial Overview
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-gray-200/70 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={18} className="text-white" strokeWidth={2.2} />
                  </div>
                  <p className="text-lg font-extrabold text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm shadow-gray-100">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Wallet size={16} className="text-white" />
            </div>
            <h2 className="text-gray-900 font-extrabold text-[15px] tracking-tight">
              Income Breakdown
            </h2>
          </div>

          {incomeBreakdown.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex justify-between items-center py-3.5 text-sm ${
                  idx !== incomeBreakdown.length - 1
                    ? "border-b border-gray-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2.5 text-gray-500 font-medium">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Icon size={13} className="text-gray-400" />
                  </div>
                  {item.label}
                </div>
                <span className="text-gray-900 font-extrabold">
                  {formatUSD(item.value)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm shadow-gray-100">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="group w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300"
          >
            <div className="flex items-center gap-2.5 text-gray-900 font-semibold">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                <Send
                  size={14}
                  className="text-blue-600 group-hover:text-white transition-colors duration-300"
                />
              </div>
              Go to Telegram
            </div>
          </a>

          {isImpersonating ? (
            <button
              onClick={handleBackToAdmin}
              className="group w-full flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3.5 hover:bg-red-100 transition-all duration-300 text-red-500"
            >
              <div className="flex items-center gap-2.5 font-semibold">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-500 transition-colors duration-300">
                  <LogOut
                    size={14}
                    className="text-red-500 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                Back to Admin
              </div>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3.5 hover:bg-red-100 transition-all duration-300 text-red-500"
            >
              <div className="flex items-center gap-2.5 font-semibold">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-500 transition-colors duration-300">
                  <LogOut
                    size={14}
                    className="text-red-500 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                Logout
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
