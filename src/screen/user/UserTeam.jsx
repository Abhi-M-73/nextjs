import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLevelWiseTeam } from "../../api/user.api";
import {
  Users,
  ChevronDown,
  ChevronUp,
  UserCheck2,
  ShieldCheck,
  CalendarCheck2,
  Hourglass,
} from "lucide-react";

const MAX_LEVEL = 15;

// Format a date in IST (Asia/Kolkata) using Indian format, e.g. 25 Sep 2026
const formatIST = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Level income validity status (backend: validity.status)
const VALIDITY_STYLES = {
  active: {
    label: "Level Active",
    badge: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  revived: {
    label: "Level Extended",
    badge: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  expired: {
    label: "Level Expired",
    badge: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  inactive: {
    label: "No Investment",
    badge: "bg-gray-50 text-gray-400",
    dot: "bg-gray-300",
  },
};

// Package validity status (backend: packageValidity.status)
const PACKAGE_STYLES = {
  active: {
    label: "Package Active",
    badge: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  expired: {
    label: "Package Expired",
    badge: "bg-red-50 text-red-500",
    dot: "bg-red-400",
  },
  inactive: {
    label: "No Package",
    badge: "bg-red-50 text-red-500",
    dot: "bg-red-400",
  },
};

const isLevelActive = (user) =>
  ["active", "revived"].includes(user?.validity?.status);

// Sort priority: lower number = shown first
// 0 -> active member + level income active
// 1 -> active member, level income not active
// 2 -> inactive member
const getSortRank = (user) => {
  if (!user?.isVerified) return 2;
  return isLevelActive(user) ? 0 : 1;
};

// Active users on top, inactive at the bottom.
// Within the same group, the most recently activated user comes first.
// Copies the array so the React Query cache is never mutated.
const sortUsers = (users = []) =>
  [...users].sort((a, b) => {
    const rankDiff = getSortRank(a) - getSortRank(b);
    if (rankDiff !== 0) return rankDiff;

    const aDate = a?.activeDate ? new Date(a.activeDate).getTime() : 0;
    const bDate = b?.activeDate ? new Date(b.activeDate).getTime() : 0;
    return bDate - aDate;
  });

const ValidityInfo = ({ validity }) => {
  if (!validity || validity.status === "inactive") return null;
  const till = formatIST(validity.validTill);
  const live = validity.status === "active" || validity.status === "revived";
  // Revived, or active but reset to a fresh 30 days by a new join in the line
  const isRevived = validity.status === "revived" || !!validity.revivedBy;

  return (
    <p className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] font-medium">
      <Hourglass
        size={11}
        className={`flex-shrink-0 ${live ? "text-emerald-500" : "text-gray-300"}`}
      />
      {live ? (
        <>
          <span className="text-gray-500">
            {isRevived ? "Level income extended till" : "Level income till"}
          </span>
          <span className="text-gray-700">{till}</span>
          <span
            className={`whitespace-nowrap ${isRevived ? "text-amber-600" : "text-emerald-600"}`}
          >
            · {validity.daysLeft} {validity.daysLeft === 1 ? "day" : "days"}{" "}
            left
          </span>
        </>
      ) : (
        <>
          <span className="text-gray-400">Level income expired on</span>
          <span className="text-gray-500">{till}</span>
        </>
      )}
    </p>
  );
};

const UserTeam = () => {
  const [activeLevel, setActiveLevel] = useState(null);
  const defaultLevels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: getLevelWiseTeam,
  });

  const response = data?.data || [];

  // Build levels 1..MAX_LEVEL, sort users inside each level, drop empty levels
  const formattedData = defaultLevels
    .map((level) => {
      const found = response.find((item) => item.level === level);
      return found
        ? { ...found, users: sortUsers(found.users) }
        : { level, count: 0, users: [] };
    })
    .filter((team) => team.count > 0);

  const totalUsers = formattedData.reduce(
    (sum, team) => sum + (team.count || 0),
    0,
  );
  const totalActiveUsers = formattedData.reduce(
    (sum, team) =>
      sum + (team.users?.filter((u) => u?.isVerified)?.length || 0),
    0,
  );
  const totalLevelActive = formattedData.reduce(
    (sum, team) => sum + (team.users?.filter(isLevelActive)?.length || 0),
    0,
  );

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-lg mx-auto space-y-4 sm:space-y-6">
        {/* ---------------- STATS SUMMARY ---------------- */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm shadow-gray-100 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
              <Users size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-extrabold text-base sm:text-lg leading-tight">
                {totalUsers}
              </p>
              <p className="text-gray-400 text-[11px] sm:text-xs font-medium leading-tight">
                Total Members
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm shadow-gray-100 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 flex-shrink-0">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-extrabold text-base sm:text-lg leading-tight">
                {totalActiveUsers}
              </p>
              <p className="text-gray-400 text-[11px] sm:text-xs font-medium leading-tight">
                Active Members
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- TEAM STRUCTURE ---------------- */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-5 shadow-sm shadow-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
                <Users size={16} className="text-white" />
              </div>
              <h2 className="text-gray-900 font-extrabold text-base sm:text-[17px] tracking-tight whitespace-nowrap">
                My Team Structure
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-gray-400">
              {totalUsers} total · {totalActiveUsers} active ·{" "}
              {totalLevelActive} level active
            </span>
          </div>

          <div className="space-y-3 sm:space-y-3.5 max-h-[560px] overflow-y-auto sm:pr-1">
            {formattedData.length > 0 ? (
              formattedData.map((team) => {
                const isOpen = activeLevel === team.level;
                return (
                  <div
                    key={team.level}
                    className={`bg-gradient-to-br from-gray-50 to-white border rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 transition-all duration-300 ${
                      isOpen
                        ? "border-blue-200 shadow-md shadow-blue-100/60"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-extrabold shadow-md shadow-blue-200 flex-shrink-0">
                          {team.level}
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-900 text-sm font-bold">
                            Level {team.level}
                          </p>
                          <p className="text-gray-400 text-[11px] sm:text-xs font-medium flex flex-wrap items-center gap-x-1">
                            <UserCheck2
                              size={11}
                              className="text-gray-400 flex-shrink-0"
                            />
                            <span className="whitespace-nowrap">
                              {team.count} members ·
                            </span>
                            <span className="whitespace-nowrap">
                              {team.users?.filter(isLevelActive)?.length || 0}{" "}
                              active
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setActiveLevel(isOpen ? null : team.level)
                        }
                        className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 sm:px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
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

                    {/* Users List (already sorted: active first, inactive last) */}
                    {isOpen && (
                      <div className="mt-3 sm:mt-3.5 space-y-2 max-h-[320px] sm:max-h-[260px] overflow-y-auto">
                        {team.users?.length > 0 ? (
                          team.users.map((user) => {
                            const activatedOn = formatIST(user?.activeDate);
                            const vStyle =
                              VALIDITY_STYLES[user?.validity?.status];
                            const pkg = user?.packageValidity;
                            const pStyle =
                              PACKAGE_STYLES[pkg?.status] ||
                              (user?.isVerified
                                ? PACKAGE_STYLES.active
                                : PACKAGE_STYLES.inactive);

                            return (
                              <div
                                key={user?._id}
                                className={`flex flex-col sm:flex-row sm:justify-between sm:items-center border hover:border-blue-100 hover:shadow-sm transition-all duration-200 rounded-xl p-3 sm:p-3.5 text-sm gap-2.5 sm:gap-3 ${
                                  user?.isVerified
                                    ? "bg-white border-gray-100"
                                    : "bg-gray-50/60 border-gray-100 opacity-80"
                                }`}
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
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

                                    {/* Activation date (IST) */}
                                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium truncate">
                                      <CalendarCheck2
                                        size={11}
                                        className={
                                          activatedOn
                                            ? "text-green-500"
                                            : "text-gray-300"
                                        }
                                      />
                                      {activatedOn ? (
                                        <>
                                          <span className="text-green-500">
                                            Active on
                                          </span>
                                          <span className="text-gray-600">
                                            {activatedOn}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-gray-400">
                                          Not activated
                                        </span>
                                      )}
                                    </p>

                                    {/* Package validity */}
                                    {pkg && pkg.status !== "inactive" && (
                                      <p className="mt-0.5 flex flex-wrap items-center gap-x-1 text-[11px] font-medium">
                                        <ShieldCheck
                                          size={11}
                                          className={`flex-shrink-0 ${
                                            pkg.status === "active"
                                              ? "text-green-500"
                                              : "text-red-400"
                                          }`}
                                        />
                                        <span
                                          className={
                                            pkg.status === "active"
                                              ? "text-gray-600"
                                              : "text-red-500"
                                          }
                                        >
                                          {pkg.label}
                                        </span>
                                      </p>
                                    )}

                                    {/* Level income validity */}
                                    <ValidityInfo validity={user?.validity} />
                                    {isLevelActive(user) &&
                                      user.validity.revivedBy?.username && (
                                        <p className="text-[11px] font-medium text-amber-700 break-words">
                                          Level income extended by{" "}
                                          <span className="uppercase">
                                            {user.validity.revivedBy.username}
                                          </span>
                                        </p>
                                      )}
                                  </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-wrap sm:flex-col sm:flex-nowrap sm:items-end gap-2 text-[11px] sm:text-xs flex-shrink-0">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap flex items-center gap-1 ${pStyle.badge}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`}
                                    />
                                    {pStyle.label}
                                  </span>
                                  {vStyle && (
                                    <span
                                      className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap flex items-center gap-1 ${vStyle.badge}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${vStyle.dot}`}
                                      />
                                      {vStyle.label}
                                    </span>
                                  )}
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
