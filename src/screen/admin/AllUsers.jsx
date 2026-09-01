import React, { useCallback, useEffect, useState } from "react";
import { Calendar, RefreshCw, Users, UserCheck, UserX } from "lucide-react";
import { getAllUserList } from "../../api/admin.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import DynamicTable from "../../components/ui/DynamicTable";

const formatAmount = (value) => {
  return `₹${Number(value || 0).toFixed(2)}`;
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getValidityDays = (expiryDate) => {
    if (!expiryDate) return "N/A";

    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    return `${diffDays} days`;
  };
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllUserList();

      if (response?.success) {
        setUsers(Array.isArray(response?.data) ? response.data : []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error while fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const activeUsers = users.filter(
    (user) => user?.isVerified === true || user?.isVerified === "true",
  ).length;

  const inactiveUsers = users.length - activeUsers;

  const columns = [
    {
      key: "sr",
      label: "#",
      isIndex: true,
    },
    {
      key: "username",
      label: "Username",
      render: (value) => (
        <span className="font-semibold text-slate-700">
          {value?.toUpperCase() || "N/A"}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <span className="font-semibold text-slate-700">
          {value?.toUpperCase() || "N/A"}
        </span>
      ),
    },

    {
      key: "totalEarnings",
      label: "Total Earnings",
      render: formatAmount,
    },
    {
      key: "totalInvestment",
      label: "Total Investment",
      render: formatAmount,
    },
    {
      key: "totalPayouts",
      label: "Total Payouts",
      render: formatAmount,
    },
    {
      key: "isVerified",
      label: "Status",
      isBadge: true,
      render: (value) => {
        const isVerified = value === true || value === "true";
        return isVerified ? "Active" : "Inactive";
      },
    },
    {
      key: "packageExpiryDate",
      label: "Validity",
      render: (value) => {
        const days = getValidityDays(value);
        const isExpired = days === "Expired";

        return (
          <span
            className={`text-xs font-semibold ${
              isExpired ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {days}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Joined At",
      render: (value) => (value ? dateFormatter(value) : "N/A"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold text-transparent">
              All Users
            </h1>
            <p className="text-xs text-slate-500">
              Manage and monitor registered platform users
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}

            <button
              type="button"
              onClick={fetchAllUsers}
              disabled={loading}
              title="Refresh users"
              className="rounded-lg p-2 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-slate-600 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold">User Management</h2>
              <p className="text-sm text-indigo-100">
                View and manage all users registered on your platform
              </p>
            </div>

            <div className="hidden rounded-xl bg-white/20 p-4 backdrop-blur-sm md:block">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />

            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total Users
                </p>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : users.length}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Registered platform users
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />

            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Active Users
                </p>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : activeUsers}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Verified platform users
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600" />

            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Inactive Users
                </p>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "—" : inactiveUsers}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Unverified platform users
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <UserX className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
              <Users className="h-4 w-4" />
            </div>

            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Users List
            </h2>

            <div className="ml-3 h-px flex-1 bg-slate-200" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
            <div className="w-full overflow-x-auto">
              <DynamicTable
                dataKey="_id"
                title="All Users"
                data={users}
                columns={columns}
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>System operational</span>
            </div>

            <span>Last sync: {lastUpdated?.toLocaleString() || "Never"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
