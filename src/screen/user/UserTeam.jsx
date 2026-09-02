import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLevelWiseTeam } from "../../api/user.api";
import {
  Users,
  ChevronDown,
  ChevronUp,
  UserCheck2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { dateFormatter } from "../../utils/AdditionalFn";

const MAX_LEVEL = 15;

const UserTeam = () => {
  const [activeLevel, setActiveLevel] = useState(null);
  const defaultLevels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1); // 👈 fix: 1 se 15 tak levels

  const { data, isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: getLevelWiseTeam,
  });

  const response = data?.data || [];

  const formattedData = defaultLevels
    .map((level) => {
      const found = response.find((item) => item.level === level);
      return (
        found || {
          level,
          count: 0,
          users: [],
        }
      );
    })
    .filter((team) => team.count > 0); // 👈 sirf wahi levels dikhao jinme members hain

  // 👇 total users + total active users (saare levels milaake)
  const totalUsers = formattedData.reduce(
    (sum, team) => sum + (team.count || 0),
    0,
  );
  const totalActiveUsers = formattedData.reduce(
    (sum, team) =>
      sum + (team.users?.filter((u) => u?.isVerified)?.length || 0),
    0,
  );
  const totalInactiveUsers = totalUsers - totalActiveUsers;

  const formatINR = (value) =>
    `₹${(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getValidityDays = (expiryDate) => {
    if (!expiryDate) return { label: "No Package", isExpired: true };

    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Expired", isExpired: true };
    if (diffDays === 0) return { label: "Expires today", isExpired: false };
    return { label: `${diffDays} days left`, isExpired: false };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
          <p className="text-sm font-medium text-gray-400">
            Loading your team...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="flex flex-col items-center gap-2 text-center px-6">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-red-500 font-semibold text-sm">
            Something went wrong!
          </p>
          <p className="text-gray-400 text-xs">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* ---------------- STATS SUMMARY ---------------- */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm shadow-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
              <Users size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-extrabold text-lg leading-tight">
                {totalUsers}
              </p>
              <p className="text-gray-400 text-xs font-medium truncate">
                Total Team Members
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm shadow-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 flex-shrink-0">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-extrabold text-lg leading-tight">
                {totalActiveUsers}
              </p>
              <p className="text-gray-400 text-xs font-medium truncate">
                Active Members
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- TEAM STRUCTURE ---------------- */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm shadow-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
                <Users size={16} className="text-white" />
              </div>
              <h2 className="text-gray-900 font-extrabold text-[17px] tracking-tight">
                My Team Structure
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-gray-400">
              {totalUsers} total · {totalActiveUsers} active
            </span>
          </div>

          <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1">
            {formattedData?.length > 0 ? (
              formattedData.map((team) => {
                const isOpen = activeLevel === team.level;
                return (
                  <div
                    key={team.level}
                    className={`bg-gradient-to-br from-gray-50 to-white border rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                      isOpen
                        ? "border-blue-200 shadow-md shadow-blue-100/60"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-extrabold shadow-md shadow-blue-200">
                          {team.level}
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm font-bold">
                            Level {team.level}
                          </p>
                          <p className="text-gray-400 text-xs font-medium flex items-center gap-1">
                            <UserCheck2 size={11} className="text-gray-400" />
                            {team.count} members
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setActiveLevel(
                            activeLevel === team.level ? null : team.level,
                          )
                        }
                        className={`flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {isOpen ? "Hide" : "View"}
                        {isOpen ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    </div>

                    {/* Users List */}
                    {isOpen && (
                      <div className="mt-3.5 space-y-2 max-h-[220px] overflow-y-auto">
                        {team.users?.length > 0 ? (
                          team.users.map((user) => {
                            const validity = getValidityDays(user?.createdAt);
                            return (
                              <div
                                key={user?._id}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all duration-200 rounded-xl p-3.5 text-sm gap-3"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-extrabold flex-shrink-0">
                                    {(user?.username || "U")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-gray-900 font-semibold text-sm truncate">
                                      {user?.name || "Unknown"}
                                    </p>
                                    <p className="text-gray-400 text-xs uppercase truncate">
                                      {user?.username || "—"}
                                    </p>
                                  </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2 text-xs">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap flex items-center gap-1 ${
                                      user?.isVerified
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        user?.isVerified
                                          ? "bg-green-500"
                                          : "bg-red-400"
                                      }`}
                                    />
                                    {user?.isVerified ? "Active" : "Inactive"}
                                  </span>

                                  {/* <span
                                    className={`text-[11px] font-semibold ${
                                      validity.isExpired
                                        ? "text-red-500"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    {validity.label}
                                  </span> */}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 py-6">
                            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                              <Users size={16} className="text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-xs font-medium">
                              No users found
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-6">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                  <Users size={16} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-xs font-medium">
                  No team members yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTeam;
