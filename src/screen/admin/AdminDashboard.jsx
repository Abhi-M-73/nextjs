import { Banknote, CreditCard, Users, TrendingUp, Layers, Award, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { getDashbboardData } from "../../api/admin.api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashbboardData();
      if (res?.success) {
        setData(res?.data || {});
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

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-[#020d12] via-[#03151c] to-black min-h-screen text-white">
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {/* ─── USERS ───────────────────────── */}
        <AdminStatCard
          title="Total Users"
          value={data.totalUsers || 0}
          icon={<Users />}
          iconColor="from-purple-500 to-indigo-400"
          loading={loading}
        />

        {/* ─── INVESTMENT ───────────────────── */}
        <AdminStatCard
          title="Total Investment"
          value={data.totalInvestment || 0}
          unit="₹"
          trend="up"
          icon={<CreditCard />}
          iconColor="from-yellow-500 to-yellow-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Investment"
          value={data.todayInvestment || 0}
          unit="₹"
          trend={data.todayInvestment > 0 ? "up" : "down"}
          icon={<CreditCard />}
          iconColor="from-orange-500 to-amber-400"
          loading={loading}
        />

        {/* ─── ROI / CASHBACK ───────────────── */}
        <AdminStatCard
          title="Total Cashback (ROI)"
          value={data.totalRoi || 0}
          unit="₹"
          trend="up"
          icon={<Banknote />}
          iconColor="from-blue-500 to-cyan-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Cashback (ROI)"
          value={data.todayRoi || 0}
          unit="₹"
          trend={data.todayRoi > 0 ? "up" : "down"}
          icon={<Banknote />}
          iconColor="from-sky-500 to-blue-400"
          loading={loading}
        />

        {/* ─── LEVEL INCOME ───────────────── */}
        <AdminStatCard
          title="Total Level Income"
          value={data.totalLevelIncome || 0}
          unit="₹"
          trend="up"
          icon={<Layers />}
          iconColor="from-indigo-500 to-violet-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Level Income"
          value={data.todayLevelIncome || 0}
          unit="₹"
          trend={data.todayLevelIncome > 0 ? "up" : "down"}
          icon={<Layers />}
          iconColor="from-violet-500 to-purple-400"
          loading={loading}
        />

        {/* ─── REFERRAL ───────────────── */}
        <AdminStatCard
          title="Total Referral Income"
          value={data.totalReferral || 0}
          unit="₹"
          trend="up"
          icon={<Gift />}
          iconColor="from-teal-500 to-emerald-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Referral Income"
          value={data.todayReferral || 0}
          unit="₹"
          trend={data.todayReferral > 0 ? "up" : "down"}
          icon={<Gift />}
          iconColor="from-emerald-500 to-green-400"
          loading={loading}
        />

        {/* ─── MATCHING INCOME ───────────────── */}
        <AdminStatCard
          title="Total Matching Income"
          value={data.totalMatchingIncome || 0}
          unit="₹"
          trend="up"
          icon={<TrendingUp />}
          iconColor="from-cyan-500 to-sky-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Matching Income"
          value={data.todayMatchingIncome || 0}
          unit="₹"
          trend={data.todayMatchingIncome > 0 ? "up" : "down"}
          icon={<TrendingUp />}
          iconColor="from-sky-500 to-cyan-400"
          loading={loading}
        />

        {/* ─── RANK REWARD ───────────────── */}
        <AdminStatCard
          title="Total Rank Reward"
          value={data.totalRankReward || 0}
          unit="₹"
          trend="up"
          icon={<Award />}
          iconColor="from-amber-500 to-yellow-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Rank Reward"
          value={data.todayRankReward || 0}
          unit="₹"
          trend={data.todayRankReward > 0 ? "up" : "down"}
          icon={<Award />}
          iconColor="from-yellow-500 to-amber-400"
          loading={loading}
        />

        {/* ─── WITHDRAWALS ───────────────── */}
        <AdminStatCard
          title="Total Withdrawals"
          value={data.totalWithdrawal || 0}
          unit="₹"
          trend="down"
          icon={<Banknote />}
          iconColor="from-red-500 to-rose-400"
          loading={loading}
        />
        <AdminStatCard
          title="Today Withdrawals"
          value={data.todayWithdrawal || 0}
          unit="₹"
          trend={data.todayWithdrawal > 0 ? "up" : "down"}
          icon={<Banknote />}
          iconColor="from-pink-500 to-rose-300"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;