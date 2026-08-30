import React, { useEffect, useState } from "react";
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
  Clock,
  PackageX,
  Copy,
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

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!user?.packageExpiryDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const expiry = new Date(user.packageExpiryDate).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [user?.packageExpiryDate]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        dispatch(
          showSnackbar({
            message: "Referral link copied to clipboard! 📋",
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
      label: "Available Balance",
      value: formatINR(user?.mainWallet),
      icon: Wallet,
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      label: "Total Payouts",
      value: formatINR(user?.totalPayouts),
      icon: Banknote,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const incomeBreakdown = [
    {
      label: "Cashback Income",
      value: user?.cashbackWallet,
      icon: ArrowDownToLine,
    },
    { label: "Referral Income", value: user?.directReferalAmount, icon: Users },
    { label: "Level Income", value: user?.levelIncome, icon: Layers },
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

        {/* Package Expiry / Countdown Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm shadow-gray-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Clock size={16} className="text-white" />
            </div>
            <h2 className="text-gray-900 font-extrabold text-[15px] tracking-tight">
              Package Expiry
            </h2>
          </div>

          {!user?.packageExpiryDate ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <PackageX size={22} className="text-red-500" />
              </div>
              <p className="text-gray-900 font-semibold text-sm">
                No Active Investment
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Purchase a package to activate your countdown
              </p>
            </div>
          ) : timeLeft?.expired ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <PackageX size={22} className="text-red-500" />
              </div>
              <p className="text-red-500 font-semibold text-sm">
                Package Expired
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {user?.packageExpiryDate
                  ? dateFormatter(user.packageExpiryDate)
                  : "--"}
              </p>
            </div>
          ) : timeLeft ? (
            <div>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl py-3 text-center"
                  >
                    <p className="text-xl font-extrabold text-blue-700 tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </p>
                    <p className="text-[10px] text-blue-500 font-semibold mt-0.5">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-3.5 text-center">
                Expires on {dateFormatter(user.packageExpiryDate)}
              </p>
            </div>
          ) : null}
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
                  {formatINR(item.value)}
                </span>
              </div>
            );
          })}
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

        {/* Settings Section */}
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
