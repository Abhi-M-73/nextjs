import {
  Banknote,
  CreditCard,
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  Layers,
  Award,
  Gift,
  RefreshCw,
  Calendar,
  Wallet,
  Activity,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getDashbboardData } from "../../api/admin.api";

// Drops decimals without rounding
const formatNumber = (num) => {
  const value = Number(num);
  if (!Number.isFinite(value)) return "0";
  return Math.trunc(value).toLocaleString("en-IN");
};

// Section header component
const SectionHeader = ({ title, icon }) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">{icon}</div>
    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
      {title}
    </h2>
    <div className="ml-3 h-px flex-1 bg-slate-200" />
  </div>
);

// Metric card; `note` shows a small line under the value
const MetricCard = ({ title, value, unit, icon, gradient, note, loading }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
    <div
      className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
    />
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          {unit && (
            <span className="text-lg font-semibold text-slate-400">{unit}</span>
          )}
          <h3 className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "—" : formatNumber(value)}
          </h3>
        </div>
        {note && !loading && (
          <p className="mt-1 text-xs text-slate-400">{note}</p>
        )}
      </div>
      <div
        className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDashbboardData();
      if (res?.success) {
        setData(res?.data || {});
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold">Welcome back!</h2>
              <p className="text-sm text-indigo-100">
                Here's what's happening with your platform today
              </p>
            </div>
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              title="Refresh dashboard"
              className="rounded-xl bg-white/20 p-4 backdrop-blur-sm transition hover:bg-white/30 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-6 w-6 text-white ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Today's overview: registrations, activations, deposits */}
        <div className="mb-8">
          <SectionHeader
            title="Today's Overview"
            icon={<Activity className="h-4 w-4" />}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              loading={loading}
              title="Today Registrations"
              value={data.todayRegisteredUsers || 0}
              icon={<UserPlus className="h-5 w-5" />}
              gradient="from-sky-500 to-indigo-600"
              note="New users joined today"
            />
            <MetricCard
              loading={loading}
              title="Today Activations"
              value={data.todayActivatedUsers || 0}
              icon={<UserCheck className="h-5 w-5" />}
              gradient="from-emerald-500 to-teal-600"
              note="Packages activated today"
            />
            <MetricCard
              loading={loading}
              title="Today Deposit"
              value={data.todayDepositAmount || 0}
              unit="₹"
              icon={<CreditCard className="h-5 w-5" />}
              gradient="from-orange-500 to-amber-600"
              note={`${data.todayDepositCount || 0} approved · ${data.todayDepositRequests || 0} requests (${data.todayDepositPending || 0} pending)`}
            />
            <MetricCard
              loading={loading}
              title="Active Users"
              value={data.totalActiveUsers || 0}
              icon={<Users className="h-5 w-5" />}
              gradient="from-fuchsia-500 to-purple-600"
              note={`Out of ${formatNumber(data.totalUsers || 0)} total users`}
            />
          </div>
        </div>

        {/* Key metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            loading={loading}
            title="Total Users"
            value={data.totalUsers || 0}
            icon={<Users className="h-5 w-5" />}
            gradient="from-indigo-500 to-purple-600"
          />
          <MetricCard
            loading={loading}
            title="Total Client Balance"
            value={data.totalClientBalance || 0}
            unit="₹"
            icon={<Wallet className="h-5 w-5" />}
            gradient="from-cyan-500 to-blue-600"
          />
          <MetricCard
            loading={loading}
            title="Total Investment"
            value={data.totalInvestment || 0}
            unit="₹"
            icon={<CreditCard className="h-5 w-5" />}
            gradient="from-amber-500 to-orange-600"
          />
          <MetricCard
            loading={loading}
            title="Today's Investment"
            value={data.todayInvestment || 0}
            unit="₹"
            icon={<CreditCard className="h-5 w-5" />}
            gradient="from-orange-500 to-amber-600"
          />
        </div>

        {/* Income breakdown */}
        <div className="mb-8">
          <SectionHeader
            title="Income Breakdown"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              loading={loading}
              title="CASHBACK Income"
              value={data.totalRoi || 0}
              unit="₹"
              icon={<Banknote className="h-5 w-5" />}
              gradient="from-blue-500 to-cyan-600"
            />
            <MetricCard
              loading={loading}
              title="Level Income"
              value={data.totalLevelIncome || 0}
              unit="₹"
              icon={<Layers className="h-5 w-5" />}
              gradient="from-violet-500 to-purple-600"
            />
            <MetricCard
              loading={loading}
              title="Referral Income"
              value={data.totalReferral || 0}
              unit="₹"
              icon={<Gift className="h-5 w-5" />}
              gradient="from-pink-500 to-rose-600"
            />
            <MetricCard
              loading={loading}
              title="Total Income"
              value={
                (data.totalRoi || 0) +
                (data.totalLevelIncome || 0) +
                (data.totalReferral || 0)
              }
              unit="₹"
              icon={<Award className="h-5 w-5" />}
              gradient="from-amber-500 to-yellow-600"
            />
          </div>
        </div>

        {/* Today's income */}
        <div className="mb-8">
          <SectionHeader
            title="Today's Activity"
            icon={<Calendar className="h-4 w-4" />}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              loading={loading}
              title="Today cashback Paid"
              value={data.todayRoi || 0}
              unit="₹"
              icon={<Banknote className="h-5 w-5" />}
              gradient="from-blue-500 to-cyan-600"
            />
            <MetricCard
              loading={loading}
              title="Today Level"
              value={data.todayLevelIncome || 0}
              unit="₹"
              icon={<Layers className="h-5 w-5" />}
              gradient="from-indigo-500 to-violet-600"
            />
            <MetricCard
              loading={loading}
              title="Today Referral"
              value={data.todayReferral || 0}
              unit="₹"
              icon={<Gift className="h-5 w-5" />}
              gradient="from-teal-500 to-emerald-600"
            />
            <MetricCard
              loading={loading}
              title="Today Total Income"
              value={
                (data.todayRoi || 0) +
                (data.todayLevelIncome || 0) +
                (data.todayReferral || 0)
              }
              unit="₹"
              icon={<Award className="h-5 w-5" />}
              gradient="from-amber-500 to-orange-600"
            />
          </div>
        </div>

        {/* Withdrawals */}
        <div>
          <SectionHeader
            title="Withdrawals"
            icon={<Banknote className="h-4 w-4" />}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MetricCard
              loading={loading}
              title="Total Withdrawn"
              value={data.totalWithdrawal || 0}
              unit="₹"
              icon={<Banknote className="h-5 w-5" />}
              gradient="from-rose-500 to-pink-600"
            />
            <MetricCard
              loading={loading}
              title="Today Withdrawn"
              value={data.todayWithdrawal || 0}
              unit="₹"
              icon={<Banknote className="h-5 w-5" />}
              gradient="from-pink-500 to-rose-600"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>System operational</span>
            </div>
            <span>
              Last sync: {lastUpdated?.toLocaleString("en-IN") || "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
