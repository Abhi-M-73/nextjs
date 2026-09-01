import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Ban,
  ShieldCheck,
  KeyRound,
  X,
  Loader2,
} from "lucide-react";
import {
  getAllUserList,
  toggleUserBlock,
  adminChangeUserPassword,
} from "../../api/admin.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import DynamicTable from "../../components/ui/DynamicTable";
import toast from "react-hot-toast";

const formatAmount = (value) => {
  return `₹${Number(value || 0).toFixed(2)}`;
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [blockingId, setBlockingId] = useState(null);

  // Password modal state
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

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

  const handleToggleBlock = async (user) => {
    try {
      setBlockingId(user._id);

      const response = await toggleUserBlock(user._id);

      if (response?.success !== false) {
        toast.success(response?.message || "Login status updated");

        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? { ...u, isLoginBlocked: !u.isLoginBlocked }
              : u,
          ),
        );
      } else {
        toast.error(response?.message || "Failed to update block status");
      }
    } catch (error) {
      console.error("Block toggle error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update block status",
      );
    } finally {
      setBlockingId(null);
    }
  };

  const openPasswordModal = (user) => {
    setPasswordModalUser(user);
    setNewPassword("");
  };

  const closePasswordModal = () => {
    setPasswordModalUser(null);
    setNewPassword("");
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setUpdatingPassword(true);

      const response = await adminChangeUserPassword({
        userId: passwordModalUser._id,
        newPassword: newPassword.trim(),
      });

      if (response?.success !== false) {
        toast.success(
          response?.message ||
            `Password updated for ${passwordModalUser.username}`,
        );
        closePasswordModal();
      } else {
        toast.error(response?.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

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
      key: "isLoginBlocked",
      label: "Block Status",
      render: (value) =>
        value === true ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600">
            <Ban className="h-3 w-3" />
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
            <ShieldCheck className="h-3 w-3" />
            Allowed
          </span>
        ),
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
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleBlock(row)}
            disabled={blockingId === row._id}
            title={row?.isLoginBlocked ? "Unblock user" : "Block user"}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              row?.isLoginBlocked
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            {blockingId === row._id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : row?.isLoginBlocked ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <Ban className="h-3.5 w-3.5" />
            )}
            {row?.isLoginBlocked ? "Unblock" : "Block"}
          </button>

          <button
            type="button"
            onClick={() => openPasswordModal(row)}
            title="Change password"
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Password
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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

      {/* Change Password Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Change Password
              </h3>
              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 text-xs text-slate-500">
              Setting new password for{" "}
              <span className="font-semibold text-slate-700">
                @{passwordModalUser.username}
              </span>
            </p>

            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closePasswordModal}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={updatingPassword}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingPassword ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
