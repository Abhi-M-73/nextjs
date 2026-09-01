import {
  Banknote,
  CreditCard,
  Users,
  TrendingUp,
  Layers,
  Award,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getDashbboardData } from "../../api/admin.api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashbboardData();
      if (res?.success) {
        setData(res?.data || {});
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return Number(num).toLocaleString("en-IN");
  };

  // Metric card component with modern design
  const MetricCard = ({ title, value, unit, icon, gradient, subtitle }) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
      {/* Gradient accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
      />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            {unit && (
              <span className="text-lg font-semibold text-slate-400">
                {unit}
              </span>
            )}
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              {loading ? "—" : formatNumber(value)}
            </h3>
          </div>
          {/* {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )} */}
        </div>

        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      {/* Trend indicator
      {trend && (
        <div className="flex items-center gap-1 mt-4">
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          )}
          <span
            className={`text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}
          >
            {trend === "up" ? "Increasing" : "Decreasing"}
          </span>
        </div>
      )} */}
    </div>
  );

  // Section header component
  const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">{icon}</div>
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
        {title}
      </h2>
      <div className="flex-1 h-px bg-slate-200 ml-3" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back!</h2>
              <p className="text-indigo-100 text-sm">
                Here's what's happening with your platform today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={data.totalUsers || 0}
            icon={<Users className="w-5 h-5" />}
            gradient="from-indigo-500 to-purple-600"
            subtitle="Active platform users"
          />
          <MetricCard
            title="Total Client Balance"
            value={data.totalClientBalance || 0}
            unit="₹"
            icon={<Wallet className="w-5 h-5" />}
            gradient="from-cyan-500 to-blue-600"
            trend="up"
            subtitle="Sum of all wallet balances"
          />
          <MetricCard
            title="Total Investment"
            value={data.totalInvestment || 0}
            unit="₹"
            icon={<CreditCard className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
            trend="up"
            subtitle="Cumulative investments"
          />
          <MetricCard
            title="Today's Investment"
            value={data.todayInvestment || 0}
            unit="₹"
            icon={<CreditCard className="w-5 h-5" />}
            gradient="from-orange-500 to-amber-600"
            trend={data.todayInvestment > 0 ? "up" : "down"}
            subtitle="Daily investment flow"
          />
        </div>

        {/* Income Breakdown */}
        <div className="mb-8">
          <SectionHeader
            title="Income Breakdown"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="ROI Income"
              value={data.totalRoi || 0}
              unit="₹"
              icon={<Banknote className="w-5 h-5" />}
              gradient="from-blue-500 to-cyan-600"
              trend="up"
              subtitle="Total cashback earned"
            />
            <MetricCard
              title="Level Income"
              value={data.totalLevelIncome || 0}
              unit="₹"
              icon={<Layers className="w-5 h-5" />}
              gradient="from-violet-500 to-purple-600"
              trend="up"
              subtitle="Level-wise earnings"
            />
            <MetricCard
              title="Referral Income"
              value={data.totalReferral || 0}
              unit="₹"
              icon={<Gift className="w-5 h-5" />}
              gradient="from-pink-500 to-rose-600"
              trend="up"
              subtitle="Referral bonuses"
            />
            <MetricCard
              title="Total Income"
              value={
                (data.totalRoi || 0) +
                (data.totalLevelIncome || 0) +
                (data.totalReferral || 0)
              }
              unit="₹"
              icon={<Award className="w-5 h-5" />}
              gradient="from-amber-500 to-yellow-600"
              trend="up"
              subtitle="All income combined"
            />
          </div>
        </div>

        {/* Daily Activity */}
        <div className="mb-8">
          <SectionHeader
            title="Today's Activity"
            icon={<Calendar className="w-4 h-4" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Today cashback Paid"
              value={data.todayRoi || 0}
              unit="₹"
              icon={<Banknote className="w-5 h-5" />}
              gradient="from-blue-500 to-cyan-600"
              trend={data.todayRoi > 0 ? "up" : "down"}
            />
            <MetricCard
              title="Today Level"
              value={data.todayLevelIncome || 0}
              unit="₹"
              icon={<Layers className="w-5 h-5" />}
              gradient="from-indigo-500 to-violet-600"
              trend={data.todayLevelIncome > 0 ? "up" : "down"}
            />
            <MetricCard
              title="Today Referral"
              value={data.todayReferral || 0}
              unit="₹"
              icon={<Gift className="w-5 h-5" />}
              gradient="from-teal-500 to-emerald-600"
              trend={data.todayReferral > 0 ? "up" : "down"}
            />
            <MetricCard
              title="Today Total Income"
              value={
                (data.todayRoi || 0) +
                (data.todayLevelIncome || 0) +
                (data.todayReferral || 0)
              }
              unit="₹"
              icon={<Award className="w-5 h-5" />}
              gradient="from-amber-500 to-orange-600"
              trend="up"
            />
          </div>
        </div>

        {/* Withdrawals */}
        <div>
          <SectionHeader
            title="Withdrawals"
            icon={<Banknote className="w-4 h-4" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Total Withdrawn"
              value={data.totalWithdrawal || 0}
              unit="₹"
              icon={<Banknote className="w-5 h-5" />}
              gradient="from-rose-500 to-pink-600"
              trend="down"
              subtitle="Cumulative withdrawals"
            />
            <MetricCard
              title="Today Withdrawn"
              value={data.todayWithdrawal || 0}
              unit="₹"
              icon={<Banknote className="w-5 h-5" />}
              gradient="from-pink-500 to-rose-600"
              trend={data.todayWithdrawal > 0 ? "up" : "down"}
              subtitle="Daily withdrawal amount"
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System operational</span>
            </div>
            <span>
              Data refreshes automatically • Last sync:{" "}
              {lastUpdated?.toLocaleString() || "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
